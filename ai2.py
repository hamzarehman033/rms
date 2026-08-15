#!/usr/bin/env python3
"""
AI Vision Security & EHS MQTT Mock Edge Device
==============================================

This script mocks a real AI Vision field device/gateway.

Protocol used:
    MQTT_AI_Vision_Security_EHS_Binary_Hex_Protocol.docx

Packet format:
    [96-byte binary metadata header][raw JPEG bytes]

Message types:
    1 = alert_snapshot  -> 96-byte header + JPEG image bytes
    2 = heartbeat       -> 96-byte header only, no image bytes

Production recommendation:
    PAYLOAD_MODE = "binary"

Debug/commissioning:
    PAYLOAD_MODE = "hex"   # sends ASCII hex string, larger but easy to inspect

Install:
    pip install paho-mqtt

Run:
    python ai_vision_mqtt_mock_device_binary.py

Edit only the CONFIG section below.
"""

from __future__ import annotations

import base64
import binascii
import os
import random
import signal
import socket
import struct
import sys
import time
from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple
from urllib.parse import urlparse


# =============================================================================
# CONFIG - EDIT THESE VALUES
# =============================================================================

MQTT_BROKER = "101c718374a04285ab37b8eee7fd1030.s1.eu.hivemq.cloud"
MQTT_PORT = 8883                # Used when MQTT_BROKER has no port
MQTT_USERNAME = "hamzarehman"              # Empty string means no username
MQTT_PASSWORD = "password"              # Empty string means no password
MQTT_TLS = True                # True for TLS, or use mqtts:// in MQTT_BROKER

# TENANT_ID = "mobiserve"
# SITE_ID = "ISB0167"
# EDGE_DEVICE_ID = "001"

TENANT_ID = "mobiserve"
SITE_ID = "ISB"
EDGE_DEVICE_ID = "MOCK-001"


MQTT_TOPIC = f"telecom/{TENANT_ID}/{SITE_ID}/{EDGE_DEVICE_ID}/ai"
#telecom/mobiserve/ISB/MOCK-001/ai

# QoS recommendations:
# - Alert snapshots: QoS 1
# - Heartbeat: QoS 0 for large scale, QoS 1 for smaller/private deployments
SNAPSHOT_QOS = 0
HEARTBEAT_QOS = 0
MQTT_RETAIN = False

# "binary" = raw bytes payload, recommended for production
# "hex"    = ASCII hex string, useful for MQTT Explorer/debugging only
PAYLOAD_MODE = "binary"

# Publish intervals
HEARTBEAT_INTERVAL_SEC = 10
SNAPSHOT_INTERVAL_SEC = 20

# For testing, set SEND_COUNT to a positive number.
# 0 = run forever
SEND_COUNT = 0

# Put up to three image paths here.
# Use JPEG files where possible. If a path is missing, the script uses an internal fallback JPEG.
IMAGE_PATHS = [
    r"C:\Users\hamza.rehman\Downloads\login-pg.jpg",
    r"C:\Users\hamza.rehman\Downloads\login-pg.jpg",
    r"C:\Users\hamza.rehman\Downloads\login-pg.jpg",
]

# AI/camera system settings
CONFIGURED_CAMERA_COUNT = 2
ACTIVE_CAMERA_COUNT = 2
DETECTION_ENABLED = 1          # 1=ON, 0=OFF
MODEL_ID = 1                   # 0=unknown, 1=EHS/security model
DEFAULT_IMAGE_WIDTH = 1280
DEFAULT_IMAGE_HEIGHT = 720

PRINT_HEX_PAYLOAD = False
PRINT_DECODED_HEADER = False


# =============================================================================
# PROTOCOL CONSTANTS
# =============================================================================

MAGIC = 0xA156
PROTOCOL_VERSION = 0x01
HEADER_LENGTH = 0x0060         # 96 bytes
HEADER_SIZE = 96

MESSAGE_TYPE_ALERT_SNAPSHOT = 1
MESSAGE_TYPE_HEARTBEAT = 2

IMAGE_FORMAT_NONE = 0
IMAGE_FORMAT_JPEG = 1

IMAGE_ENCODING_RAW_BINARY = 0
IMAGE_ENCODING_ASCII_HEX_DEBUG = 1

EVENT_TYPE = {
    0: "helmet_violation",
    1: "vest_violation",
    2: "restricted_zone_violation",
    3: "team_activity",
    4: "intruder_detection",
    5: "crowd_on_site",
    6: "ehs_compliant",
    7: "ehs_violation",
    8: "other_alert",
    255: "none",
}

EHS_CODES = {
    0: "helmet_missing_or_incorrect",
    1: "vest_missing",
    2: "harness_missing_or_incorrect",
    3: "chin_strap_missing_or_open",
    4: "safety_shoes_missing",
    5: "gloves_missing",
    6: "y_lanyard_missing_or_not_connected",
    7: "positioning_lanyard_missing_or_not_connected",
    8: "unsafe_height_or_tower_position",
    9: "inside_restricted_zone",
    10: "other_ehs_violation",
}

ACTIVITY_ZONES = {
    0: "unknown",
    1: "generator_zone",
    2: "rectifier_zone",
    3: "cp_zone",
    4: "tower_zone",
    5: "main_gate",
    6: "fuel_zone",
}

SEVERITY = {
    0: "info",
    1: "warning",
    2: "major",
    3: "critical",
}

SNAPSHOT_REASON = {
    0: "none",
    1: "helmet",
    2: "vest",
    3: "multiple_ehs",
    4: "restricted_zone",
    5: "intruder",
    6: "crowd",
    7: "team_activity",
    8: "compliant",
}

SYSTEM_STATUS = {
    0: "normal",
    1: "degraded",
    2: "camera_issue",
    3: "detection_off",
    4: "comm_issue",
}


# =============================================================================
# SMALL FALLBACK JPEG
# =============================================================================
# 1x1 JPEG image. Used only if IMAGE_PATHS do not exist.
FALLBACK_JPEG_BASE64 = (
    "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////"
    "////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////"
    "////////////////////////////////////////////wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAH/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAEFAqf/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAEDAQE/ASP/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAECAQE/ASP/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAY/Ar//xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAE/IV//2gAMAwEAAgADAAAAEP/EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQMBAT8QH//EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQIBAT8QH//EABQQAQAAAAAAAAAAAAAAAAAAABD/2gAIAQEAAT8QH//Z"
)


# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def parse_broker_config(raw_broker: str, default_port: int, default_tls: bool) -> Tuple[str, int, bool]:
    """
    Accepts:
        "192.168.1.50"
        "broker.hivemq.com"
        "mqtt://broker.hivemq.com:1883"
        "mqtts://broker.example.com:8883"
    """
    raw_broker = raw_broker.strip()

    if "://" not in raw_broker:
        return raw_broker, int(default_port), bool(default_tls)

    parsed = urlparse(raw_broker)
    if parsed.scheme not in ("mqtt", "mqtts", "tcp", "ssl"):
        raise ValueError(f"Unsupported broker scheme: {parsed.scheme}")

    host = parsed.hostname
    if not host:
        raise ValueError(f"Invalid broker address: {raw_broker}")

    tls = parsed.scheme in ("mqtts", "ssl") or default_tls
    port = parsed.port if parsed.port else (8883 if tls else 1883)

    return host, port, tls


def crc32_hash(text: str) -> int:
    return binascii.crc32(text.encode("utf-8")) & 0xFFFFFFFF


def crc32_bytes(data: bytes) -> int:
    return binascii.crc32(data) & 0xFFFFFFFF


def crc16_modbus(data: bytes) -> int:
    """
    CRC16-MODBUS:
        poly 0xA001, init 0xFFFF, reflected
    """
    crc = 0xFFFF
    for b in data:
        crc ^= b
        for _ in range(8):
            if crc & 0x0001:
                crc = (crc >> 1) ^ 0xA001
            else:
                crc >>= 1
            crc &= 0xFFFF
    return crc


def write_u8(buf: bytearray, offset: int, value: int) -> None:
    buf[offset] = max(0, min(255, int(value)))


def write_u16(buf: bytearray, offset: int, value: int) -> None:
    struct.pack_into(">H", buf, offset, max(0, min(0xFFFF, int(value))))


def write_u32(buf: bytearray, offset: int, value: int) -> None:
    struct.pack_into(">I", buf, offset, max(0, min(0xFFFFFFFF, int(value))))


def read_u8(buf: bytes, offset: int) -> int:
    return buf[offset]


def read_u16(buf: bytes, offset: int) -> int:
    return struct.unpack_from(">H", buf, offset)[0]


def read_u32(buf: bytes, offset: int) -> int:
    return struct.unpack_from(">I", buf, offset)[0]


def clamp(value: float, min_value: float, max_value: float) -> float:
    return max(min_value, min(max_value, value))


def random_walk(value: float, min_value: float, max_value: float, step: float) -> float:
    return clamp(value + random.uniform(-step, step), min_value, max_value)


def is_jpeg(data: bytes) -> bool:
    return len(data) >= 4 and data[0:2] == b"\xFF\xD8" and data[-2:] == b"\xFF\xD9"


def get_jpeg_size(data: bytes) -> Tuple[int, int]:
    """
    Lightweight JPEG size parser.
    Returns (width, height). Falls back to defaults if not detected.
    """
    try:
        if len(data) < 4 or data[0:2] != b"\xFF\xD8":
            return DEFAULT_IMAGE_WIDTH, DEFAULT_IMAGE_HEIGHT

        i = 2
        while i < len(data) - 9:
            if data[i] != 0xFF:
                i += 1
                continue

            marker = data[i + 1]
            i += 2

            # Standalone markers without length
            if marker in (0xD8, 0xD9, 0x01) or (0xD0 <= marker <= 0xD7):
                continue

            if i + 2 > len(data):
                break

            segment_length = struct.unpack(">H", data[i:i + 2])[0]
            if segment_length < 2:
                break

            # SOF markers that contain dimensions
            if marker in (
                0xC0, 0xC1, 0xC2, 0xC3,
                0xC5, 0xC6, 0xC7,
                0xC9, 0xCA, 0xCB,
                0xCD, 0xCE, 0xCF,
            ):
                if i + 7 <= len(data):
                    height = struct.unpack(">H", data[i + 3:i + 5])[0]
                    width = struct.unpack(">H", data[i + 5:i + 7])[0]
                    return width, height

            i += segment_length

    except Exception:
        pass

    return DEFAULT_IMAGE_WIDTH, DEFAULT_IMAGE_HEIGHT


def load_jpeg_or_fallback(path: str) -> Tuple[bytes, int, int, str]:
    """
    Reads JPEG bytes from path.
    If not available, returns embedded fallback JPEG.
    """
    if path and os.path.exists(path):
        with open(path, "rb") as f:
            data = f.read()

        if is_jpeg(data):
            w, h = get_jpeg_size(data)
            return data, w, h, path

        # If non-JPEG, try converting via Pillow if available.
        try:
            from PIL import Image  # type: ignore
            import io
            with Image.open(path) as img:
                img = img.convert("RGB")
                out = io.BytesIO()
                img.save(out, format="JPEG", quality=80, optimize=True)
                jpeg = out.getvalue()
                return jpeg, img.width, img.height, path + " (converted to JPEG)"
        except Exception as exc:
            print(f"[WARN] Image path is not JPEG and Pillow conversion failed: {path} ({exc})")

    fallback = base64.b64decode(FALLBACK_JPEG_BASE64)
    return fallback, 1, 1, "internal_fallback_1x1.jpg"


# =============================================================================
# EVENT GENERATOR
# =============================================================================

@dataclass
class EdgeRuntimeState:
    sequence: int = 0
    start_time: float = time.time()
    cpu_usage: float = 32.0
    ram_usage: float = 55.0
    disk_free: float = 72.0
    active_camera_count: int = ACTIVE_CAMERA_COUNT
    configured_camera_count: int = CONFIGURED_CAMERA_COUNT
    detection_enabled: int = DETECTION_ENABLED
    camera_status_bitmap: int = 0x0003

    def update_health(self) -> None:
        self.cpu_usage = random_walk(self.cpu_usage, 15.0, 92.0, 7.0)
        self.ram_usage = random_walk(self.ram_usage, 30.0, 88.0, 4.0)
        self.disk_free = random_walk(self.disk_free, 20.0, 95.0, 1.0)

        # Simulate occasional camera issue
        if random.random() < 0.02:
            self.active_camera_count = max(1, self.configured_camera_count - 1)
        elif random.random() < 0.20:
            self.active_camera_count = self.configured_camera_count

        self.camera_status_bitmap = 0
        for camera_id in range(1, self.active_camera_count + 1):
            self.camera_status_bitmap |= (1 << (camera_id - 1))

    def system_status(self) -> int:
        if self.detection_enabled == 0:
            return 3  # detection_off
        if self.active_camera_count < self.configured_camera_count:
            return 2  # camera_issue
        if self.cpu_usage > 85 or self.ram_usage > 85 or self.disk_free < 10:
            return 1  # degraded
        return 0      # normal

    def uptime_sec(self) -> int:
        return int(time.time() - self.start_time)

    def next_sequence(self) -> int:
        self.sequence = (self.sequence + 1) & 0xFFFFFFFF
        return self.sequence


def random_event_metadata() -> Dict[str, object]:
    """
    Produces realistic random event metadata.
    """
    event_choices = [
        0,  # helmet_violation
        1,  # vest_violation
        2,  # restricted_zone_violation
        3,  # team_activity
        4,  # intruder_detection
        5,  # crowd_on_site
        6,  # ehs_compliant
        7,  # ehs_violation
    ]
    event_type = random.choice(event_choices)

    camera_id = random.randint(1, max(1, CONFIGURED_CAMERA_COUNT))
    activity_zone = random.choice([1, 2, 3, 4, 5, 6])
    object_count = random.randint(1, 3)
    ehs_codes: List[int] = []
    snapshot_reason_code = 0
    severity = 0
    confidence = round(random.uniform(0.76, 0.97), 3)

    if event_type == 0:
        severity = 2
        ehs_codes = [0]
        snapshot_reason_code = 1
    elif event_type == 1:
        severity = 2
        ehs_codes = [1]
        snapshot_reason_code = 2
    elif event_type == 2:
        severity = 2
        ehs_codes = [9]
        snapshot_reason_code = 4
    elif event_type == 3:
        severity = 0
        ehs_codes = []
        snapshot_reason_code = 7
        object_count = random.randint(1, 4)
    elif event_type == 4:
        severity = random.choice([2, 3])
        ehs_codes = []
        snapshot_reason_code = 5
        object_count = random.randint(1, 2)
    elif event_type == 5:
        severity = 2
        ehs_codes = []
        snapshot_reason_code = 6
        object_count = random.randint(5, 12)
    elif event_type == 6:
        severity = 0
        ehs_codes = []
        snapshot_reason_code = 8
    elif event_type == 7:
        severity = random.choice([2, 3])
        code_pool = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        ehs_codes = random.sample(code_pool, k=random.randint(2, 4))
        snapshot_reason_code = 3

    return {
        "event_type": event_type,
        "severity": severity,
        "confidence": confidence,
        "camera_id": camera_id,
        "activity_zone": activity_zone,
        "object_count": object_count,
        "ehs_codes": ehs_codes[:8],
        "snapshot_reason_code": snapshot_reason_code,
    }


# =============================================================================
# PACKET ENCODER / DECODER
# =============================================================================

def build_header(
    *,
    state: EdgeRuntimeState,
    message_type: int,
    message_id: str,
    event_id: str,
    camera_id: int,
    event_type: int,
    severity: int,
    confidence: float,
    activity_zone: int,
    object_count: int,
    ehs_codes: List[int],
    snapshot_reason_code: int,
    image_bytes: bytes,
    image_width: int,
    image_height: int,
) -> bytes:
    """
    Build the fixed 96-byte binary metadata header.
    """
    header = bytearray(HEADER_SIZE)

    sequence = state.next_sequence()
    timestamp = int(time.time())
    image_present = 1 if image_bytes else 0
    flags = 0x0001 if image_present else 0x0000

    confidence_scaled = int(round(clamp(confidence, 0.0, 1.0) * 1000))

    # Basic header
    write_u16(header, 0x00, MAGIC)
    write_u8(header, 0x02, PROTOCOL_VERSION)
    write_u8(header, 0x03, message_type)
    write_u16(header, 0x04, HEADER_LENGTH)
    write_u16(header, 0x06, flags)
    write_u32(header, 0x08, sequence)
    write_u32(header, 0x0C, timestamp)
    write_u32(header, 0x10, crc32_hash(SITE_ID))
    write_u32(header, 0x14, crc32_hash(EDGE_DEVICE_ID))
    write_u32(header, 0x18, crc32_hash(message_id))
    write_u32(header, 0x1C, crc32_hash(event_id) if event_id else 0)

    # Event metadata
    write_u8(header, 0x20, camera_id)
    write_u8(header, 0x21, event_type)
    write_u8(header, 0x22, severity)
    write_u16(header, 0x23, confidence_scaled)
    write_u8(header, 0x25, activity_zone)
    write_u16(header, 0x26, object_count)

    # EHS codes, max 8
    ehs_codes = ehs_codes[:8]
    write_u8(header, 0x28, len(ehs_codes))
    for i in range(8):
        write_u8(header, 0x29 + i, ehs_codes[i] if i < len(ehs_codes) else 0xFF)

    write_u8(header, 0x31, snapshot_reason_code)

    # Heartbeat / system fields
    write_u8(header, 0x32, state.active_camera_count)
    write_u8(header, 0x33, state.configured_camera_count)
    write_u8(header, 0x34, state.detection_enabled)
    write_u8(header, 0x35, state.system_status())
    write_u16(header, 0x36, HEARTBEAT_INTERVAL_SEC)
    write_u32(header, 0x38, state.uptime_sec())
    write_u8(header, 0x3C, int(round(state.cpu_usage)))
    write_u8(header, 0x3D, int(round(state.ram_usage)))
    write_u8(header, 0x3E, int(round(state.disk_free)))
    write_u16(header, 0x3F, state.camera_status_bitmap)
    write_u8(header, 0x41, MODEL_ID)

    # Image metadata
    if image_bytes:
        write_u8(header, 0x42, IMAGE_FORMAT_JPEG)
        write_u8(header, 0x43, IMAGE_ENCODING_RAW_BINARY)
        write_u16(header, 0x44, image_width)
        write_u16(header, 0x46, image_height)
        write_u32(header, 0x48, len(image_bytes))
        write_u32(header, 0x4C, crc32_bytes(image_bytes))
    else:
        write_u8(header, 0x42, IMAGE_FORMAT_NONE)
        write_u8(header, 0x43, IMAGE_ENCODING_RAW_BINARY)
        write_u16(header, 0x44, 0)
        write_u16(header, 0x46, 0)
        write_u32(header, 0x48, 0)
        write_u32(header, 0x4C, 0)

    # Header CRC16 over bytes 0x00 to 0x4F.
    # header_crc16 field itself is at 0x50 and must be written after calculation.
    header_crc = crc16_modbus(bytes(header[0x00:0x50]))
    write_u16(header, 0x50, header_crc)

    # 0x52-0x5F remain zero reserved bytes
    return bytes(header)


def build_alert_snapshot_packet(state: EdgeRuntimeState) -> Tuple[bytes, Dict[str, object]]:
    """
    Build message_type=1 alert_snapshot packet.
    """
    metadata = random_event_metadata()

    image_path = random.choice(IMAGE_PATHS)
    image_bytes, width, height, actual_path = load_jpeg_or_fallback(image_path)

    timestamp = time.strftime("%Y%m%dT%H%M%SZ", time.gmtime())
    message_id = f"{SITE_ID}-CAM{metadata['camera_id']}-{timestamp}-{state.sequence + 1:06d}"
    event_id = f"EVT-{SITE_ID}-{state.sequence + 1:06d}"

    header = build_header(
        state=state,
        message_type=MESSAGE_TYPE_ALERT_SNAPSHOT,
        message_id=message_id,
        event_id=event_id,
        camera_id=int(metadata["camera_id"]),
        event_type=int(metadata["event_type"]),
        severity=int(metadata["severity"]),
        confidence=float(metadata["confidence"]),
        activity_zone=int(metadata["activity_zone"]),
        object_count=int(metadata["object_count"]),
        ehs_codes=list(metadata["ehs_codes"]),
        snapshot_reason_code=int(metadata["snapshot_reason_code"]),
        image_bytes=image_bytes,
        image_width=width,
        image_height=height,
    )

    packet = header + image_bytes

    info = {
        "message_id": message_id,
        "event_id": event_id,
        "message_type": 1,
        "camera_id": metadata["camera_id"],
        "event_type": metadata["event_type"],
        "event_name": EVENT_TYPE.get(int(metadata["event_type"]), "unknown"),
        "severity": metadata["severity"],
        "confidence": metadata["confidence"],
        "activity_zone": metadata["activity_zone"],
        "activity_zone_name": ACTIVITY_ZONES.get(int(metadata["activity_zone"]), "unknown"),
        "object_count": metadata["object_count"],
        "ehs_codes": metadata["ehs_codes"],
        "ehs_labels": [EHS_CODES.get(c, "unknown") for c in metadata["ehs_codes"]],
        "snapshot_reason_code": metadata["snapshot_reason_code"],
        "snapshot_reason": SNAPSHOT_REASON.get(int(metadata["snapshot_reason_code"]), "unknown"),
        "image_path": actual_path,
        "image_size_bytes": len(image_bytes),
        "image_width": width,
        "image_height": height,
        "packet_size_bytes": len(packet),
    }

    return packet, info


def build_heartbeat_packet(state: EdgeRuntimeState) -> Tuple[bytes, Dict[str, object]]:
    """
    Build message_type=2 heartbeat packet.
    """
    timestamp = time.strftime("%Y%m%dT%H%M%SZ", time.gmtime())
    message_id = f"{SITE_ID}-HB-{timestamp}-{state.sequence + 1:06d}"

    header = build_header(
        state=state,
        message_type=MESSAGE_TYPE_HEARTBEAT,
        message_id=message_id,
        event_id="",
        camera_id=0,
        event_type=255,
        severity=0,
        confidence=0.0,
        activity_zone=0,
        object_count=0,
        ehs_codes=[],
        snapshot_reason_code=0,
        image_bytes=b"",
        image_width=0,
        image_height=0,
    )

    info = {
        "message_id": message_id,
        "message_type": 2,
        "system_status": state.system_status(),
        "system_status_name": SYSTEM_STATUS.get(state.system_status(), "unknown"),
        "active_camera_count": state.active_camera_count,
        "configured_camera_count": state.configured_camera_count,
        "detection_enabled": state.detection_enabled,
        "edge_uptime_sec": state.uptime_sec(),
        "cpu_usage_percent": int(round(state.cpu_usage)),
        "ram_usage_percent": int(round(state.ram_usage)),
        "disk_free_percent": int(round(state.disk_free)),
        "camera_status_bitmap": state.camera_status_bitmap,
        "packet_size_bytes": len(header),
    }

    return header, info


def decode_header(packet: bytes) -> Dict[str, object]:
    """
    Debug decoder for the first 96 bytes.
    """
    if len(packet) < HEADER_SIZE:
        raise ValueError("Packet too short")

    ehs_count = read_u8(packet, 0x28)
    ehs_codes = []
    for i in range(min(ehs_count, 8)):
        code = read_u8(packet, 0x29 + i)
        if code != 0xFF:
            ehs_codes.append(code)

    return {
        "magic": f"0x{read_u16(packet, 0x00):04X}",
        "protocol_version": read_u8(packet, 0x02),
        "message_type": read_u8(packet, 0x03),
        "header_length": read_u16(packet, 0x04),
        "flags": read_u16(packet, 0x06),
        "packet_sequence": read_u32(packet, 0x08),
        "timestamp_utc": read_u32(packet, 0x0C),
        "site_id_hash": f"0x{read_u32(packet, 0x10):08X}",
        "edge_device_id_hash": f"0x{read_u32(packet, 0x14):08X}",
        "message_id_hash": f"0x{read_u32(packet, 0x18):08X}",
        "event_id_hash": f"0x{read_u32(packet, 0x1C):08X}",
        "camera_id": read_u8(packet, 0x20),
        "event_type": read_u8(packet, 0x21),
        "severity": read_u8(packet, 0x22),
        "confidence": read_u16(packet, 0x23) / 1000.0,
        "activity_zone": read_u8(packet, 0x25),
        "object_count": read_u16(packet, 0x26),
        "ehs_code_count": ehs_count,
        "ehs_codes": ehs_codes,
        "snapshot_reason_code": read_u8(packet, 0x31),
        "active_camera_count": read_u8(packet, 0x32),
        "configured_camera_count": read_u8(packet, 0x33),
        "detection_enabled": read_u8(packet, 0x34),
        "system_status": read_u8(packet, 0x35),
        "heartbeat_interval_sec": read_u16(packet, 0x36),
        "edge_uptime_sec": read_u32(packet, 0x38),
        "cpu_usage_percent": read_u8(packet, 0x3C),
        "ram_usage_percent": read_u8(packet, 0x3D),
        "disk_free_percent": read_u8(packet, 0x3E),
        "camera_status_bitmap": f"0x{read_u16(packet, 0x3F):04X}",
        "model_id": read_u8(packet, 0x41),
        "image_format": read_u8(packet, 0x42),
        "image_encoding": read_u8(packet, 0x43),
        "image_width": read_u16(packet, 0x44),
        "image_height": read_u16(packet, 0x46),
        "image_size_bytes": read_u32(packet, 0x48),
        "image_crc32": f"0x{read_u32(packet, 0x4C):08X}",
        "header_crc16": f"0x{read_u16(packet, 0x50):04X}",
    }


# =============================================================================
# MQTT
# =============================================================================

def create_mqtt_client(client_id: str):
    try:
        import paho.mqtt.client as mqtt
    except ImportError as exc:
        print("ERROR: paho-mqtt is not installed. Run: pip install paho-mqtt", file=sys.stderr)
        raise exc

    try:
        client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id=client_id)
    except Exception:
        client = mqtt.Client(client_id=client_id)

    if MQTT_USERNAME:
        client.username_pw_set(MQTT_USERNAME, MQTT_PASSWORD)

    broker_host, broker_port, broker_tls = parse_broker_config(MQTT_BROKER, MQTT_PORT, MQTT_TLS)

    if broker_tls:
        client.tls_set()

    return client, broker_host, broker_port


def publish_packet(client, packet: bytes, qos: int) -> None:
    if PAYLOAD_MODE == "binary":
        payload = packet
    elif PAYLOAD_MODE == "hex":
        payload = packet.hex().upper().encode("ascii")
    else:
        raise ValueError('PAYLOAD_MODE must be "binary" or "hex"')

    result = client.publish(MQTT_TOPIC, payload=payload, qos=qos, retain=False)
    if qos > 0:
        result.wait_for_publish()


def main() -> int:
    if PAYLOAD_MODE not in ("binary", "hex"):
        print('ERROR: PAYLOAD_MODE must be "binary" or "hex".', file=sys.stderr)
        return 1

    state = EdgeRuntimeState()
    client_id = f"mock-{EDGE_DEVICE_ID}-{socket.gethostname()}"
    client, broker_host, broker_port = create_mqtt_client(client_id)

    print("=" * 90)
    print("AI Vision Security & EHS MQTT Mock Edge Device")
    print("=" * 90)
    print(f"Broker:       {broker_host}:{broker_port}")
    print(f"Topic:        {MQTT_TOPIC}")
    print(f"Payload mode: {PAYLOAD_MODE}")
    print(f"Header size:  {HEADER_SIZE} bytes")
    print(f"Heartbeat:    every {HEARTBEAT_INTERVAL_SEC} sec")
    print(f"Snapshot:     every {SNAPSHOT_INTERVAL_SEC} sec")
    print(f"Image paths:  {IMAGE_PATHS}")
    print("=" * 90)

    client.connect(broker_host, broker_port, keepalive=60)
    client.loop_start()

    stop = {"value": False}

    def stop_handler(signum, frame):
        stop["value"] = True

    signal.signal(signal.SIGINT, stop_handler)
    signal.signal(signal.SIGTERM, stop_handler)

    next_heartbeat = 0.0
    next_snapshot = 0.0
    sent_total = 0

    try:
        while not stop["value"]:
            now = time.time()
            state.update_health()

            if now >= next_heartbeat:
                packet, info = build_heartbeat_packet(state)
                publish_packet(client, packet, HEARTBEAT_QOS)
                sent_total += 1

                print(
                    f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] "
                    f"HEARTBEAT sent "
                    f"seq={decode_header(packet)['packet_sequence']} "
                    f"status={info['system_status']}({info['system_status_name']}) "
                    f"cams={info['active_camera_count']}/{info['configured_camera_count']} "
                    f"detect={info['detection_enabled']} "
                    f"cpu={info['cpu_usage_percent']}% "
                    f"ram={info['ram_usage_percent']}% "
                    f"payload={len(packet)} bytes"
                )

                if PRINT_DECODED_HEADER:
                    print(decode_header(packet))
                if PRINT_HEX_PAYLOAD:
                    print(packet.hex(" ").upper())

                next_heartbeat = now + HEARTBEAT_INTERVAL_SEC

            if now >= next_snapshot:
                packet, info = build_alert_snapshot_packet(state)
                publish_packet(client, packet, SNAPSHOT_QOS)
                sent_total += 1

                print(
                    f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] "
                    f"SNAPSHOT sent "
                    f"event={info['event_type']}({info['event_name']}) "
                    f"severity={info['severity']} "
                    f"cam={info['camera_id']} "
                    f"confidence={info['confidence']} "
                    f"zone={info['activity_zone']}({info['activity_zone_name']}) "
                    f"ehs={info['ehs_codes']} "
                    f"image={info['image_size_bytes']}B "
                    f"packet={info['packet_size_bytes']}B "
                    f"path={info['image_path']}"
                )

                if PRINT_DECODED_HEADER:
                    print(decode_header(packet))
                if PRINT_HEX_PAYLOAD:
                    print(packet[:HEADER_SIZE].hex(" ").upper() + " ... JPEG_BYTES ...")

                next_snapshot = now + SNAPSHOT_INTERVAL_SEC

            if SEND_COUNT > 0 and sent_total >= SEND_COUNT:
                break

            time.sleep(0.2)

    finally:
        client.loop_stop()
        client.disconnect()
        print("Stopped.")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
