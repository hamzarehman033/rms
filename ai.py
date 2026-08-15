#!/usr/bin/env python3
"""
AI Vision Security & EHS MQTT Binary Packet Decoder
===================================================

This script subscribes to the AI Vision MQTT topic, decodes incoming packets,
prints metadata, and saves incoming JPEG snapshots to disk.

Protocol:
    MQTT_AI_Vision_Security_EHS_Binary_Hex_Protocol.docx

Expected payload:
    Alert snapshot:
        [96-byte binary metadata header][raw JPEG image bytes]

    Heartbeat:
        [96-byte binary metadata header only]

Supported MQTT payload modes:
    - binary: production mode, raw bytes
    - hex: debug mode, ASCII HEX string
    - auto: automatically detect binary or ASCII HEX

Install:
    pip install paho-mqtt

Run:
    python ai_vision_mqtt_decoder_save_images.py

Edit only the CONFIG section below.
"""

from __future__ import annotations

import binascii
import json
import os
import signal
import socket
import struct
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple
from urllib.parse import urlparse


# =============================================================================
# CONFIG - EDIT THESE VALUES
# =============================================================================
# MQTT_BROKER = "mqtts://broker.emqx.io"       # IP, domain, mqtt://domain:1883, or mqtts://domain:8883
# MQTT_PORT = 8883                # Used when MQTT_BROKER has no port
# MQTT_USERNAME = "test"              # Empty string means no username
# MQTT_PASSWORD = "test"              # Empty string means no password
# MQTT_TLS = False                # True for TLS, or use mqtts:// in MQTT_BROKER


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

MQTT_TOPIC_FILTER = f"telecom/{TENANT_ID}/{SITE_ID}/{EDGE_DEVICE_ID}/ai"

# Or subscribe to one site:
# MQTT_TOPIC_FILTER = "aivision/mobiserve/ISB0167/vision"

MQTT_QOS = 1

# auto = accept both binary and ASCII hex debug payloads
# binary = expect raw binary bytes only
# hex = expect ASCII hex string only
PAYLOAD_MODE = "auto"

SAVE_IMAGE_DIR = "received_ai_vision_images"
SAVE_METADATA_JSON = True
PRINT_FULL_METADATA = True
PRINT_HEX_HEADER = False


# =============================================================================
# PROTOCOL CONSTANTS
# =============================================================================

MAGIC = 0xA156
PROTOCOL_VERSION = 0x01
HEADER_SIZE = 96
HEADER_LENGTH = 0x0060

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

IMAGE_FORMAT = {
    0: "none",
    1: "jpeg",
}

IMAGE_ENCODING = {
    0: "raw_binary",
    1: "ascii_hex_debug",
}


# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


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


def crc32_bytes(data: bytes) -> int:
    return binascii.crc32(data) & 0xFFFFFFFF


def read_u8(buf: bytes, offset: int) -> int:
    return buf[offset]


def read_u16(buf: bytes, offset: int) -> int:
    return struct.unpack_from(">H", buf, offset)[0]


def read_u32(buf: bytes, offset: int) -> int:
    return struct.unpack_from(">I", buf, offset)[0]


def safe_enum(mapping: Dict[int, str], value: int) -> str:
    return mapping.get(value, f"unknown_{value}")


def camera_bitmap_to_list(bitmap: int, configured_count: int) -> List[int]:
    online: List[int] = []
    for camera_id in range(1, configured_count + 1):
        if bitmap & (1 << (camera_id - 1)):
            online.append(camera_id)
    return online


def is_probably_ascii_hex(payload: bytes) -> bool:
    """
    Detect ASCII hex payload, e.g. b"A1560102..." or b"A1 56 01 02 ..."
    """
    if not payload:
        return False

    # Raw binary packet starts with A1 56 bytes.
    if len(payload) >= 2 and payload[0] == 0xA1 and payload[1] == 0x56:
        return False

    try:
        text = payload.decode("ascii").strip()
    except UnicodeDecodeError:
        return False

    if len(text) < 4:
        return False

    compact = "".join(text.split())
    if len(compact) % 2 != 0:
        return False

    allowed = set("0123456789abcdefABCDEF")
    return all(ch in allowed for ch in compact)


def normalize_payload(payload: bytes) -> Tuple[bytes, str]:
    """
    Convert MQTT payload into raw binary packet bytes.
    Returns (packet_bytes, detected_mode).
    """
    if PAYLOAD_MODE == "binary":
        return payload, "binary"

    if PAYLOAD_MODE == "hex":
        text = payload.decode("ascii").strip()
        compact = "".join(text.split())
        return bytes.fromhex(compact), "hex"

    if PAYLOAD_MODE == "auto":
        if is_probably_ascii_hex(payload):
            text = payload.decode("ascii").strip()
            compact = "".join(text.split())
            return bytes.fromhex(compact), "hex"
        return payload, "binary"

    raise ValueError('PAYLOAD_MODE must be "auto", "binary", or "hex"')


def validate_jpeg(image_bytes: bytes) -> bool:
    return len(image_bytes) >= 4 and image_bytes.startswith(b"\xFF\xD8") and image_bytes.endswith(b"\xFF\xD9")


def sanitize_filename_part(value: str) -> str:
    return "".join(ch if ch.isalnum() or ch in ("-", "_") else "_" for ch in value)


def get_topic_parts(topic: str) -> Dict[str, str]:
    """
    Expected topic:
        aivision/{tenant_id}/{site_id}/vision
    """
    parts = topic.split("/")
    result = {
        "tenant_id": "",
        "site_id": "",
        "topic_valid": "false",
    }

    if len(parts) == 4 and parts[0] == "aivision" and parts[3] == "vision":
        result["tenant_id"] = parts[1]
        result["site_id"] = parts[2]
        result["topic_valid"] = "true"

    return result


# =============================================================================
# DECODER
# =============================================================================

def decode_ai_vision_packet(packet: bytes) -> Dict[str, Any]:
    if len(packet) < HEADER_SIZE:
        raise ValueError(f"Packet too short: {len(packet)} bytes. Expected at least {HEADER_SIZE} bytes.")

    magic = read_u16(packet, 0x00)
    if magic != MAGIC:
        raise ValueError(f"Invalid magic: 0x{magic:04X}. Expected 0x{MAGIC:04X}.")

    protocol_version = read_u8(packet, 0x02)
    if protocol_version != PROTOCOL_VERSION:
        raise ValueError(f"Unsupported protocol_version: {protocol_version}. Expected {PROTOCOL_VERSION}.")

    message_type = read_u8(packet, 0x03)
    header_length = read_u16(packet, 0x04)

    if header_length != HEADER_LENGTH:
        raise ValueError(f"Invalid header_length: {header_length}. Expected {HEADER_LENGTH}.")

    flags = read_u16(packet, 0x06)
    image_present_flag = bool(flags & 0x0001)

    header_crc_received = read_u16(packet, 0x50)
    header_crc_calculated = crc16_modbus(packet[0x00:0x50])
    header_crc_ok = header_crc_received == header_crc_calculated

    ehs_code_count = read_u8(packet, 0x28)
    ehs_codes: List[int] = []
    ehs_labels: List[str] = []

    for i in range(min(ehs_code_count, 8)):
        code = read_u8(packet, 0x29 + i)
        if code != 0xFF:
            ehs_codes.append(code)
            ehs_labels.append(safe_enum(EHS_CODES, code))

    camera_status_bitmap = read_u16(packet, 0x3F)
    configured_camera_count = read_u8(packet, 0x33)

    image_size_bytes = read_u32(packet, 0x48)
    image_crc32_received = read_u32(packet, 0x4C)

    image_start = header_length
    image_end = image_start + image_size_bytes
    image_bytes = packet[image_start:image_end] if image_size_bytes > 0 else b""

    image_crc32_calculated = crc32_bytes(image_bytes) if image_bytes else 0
    image_crc32_ok = image_crc32_received == image_crc32_calculated

    if image_size_bytes > 0 and len(image_bytes) != image_size_bytes:
        raise ValueError(
            f"Image size mismatch: header says {image_size_bytes}, "
            f"but only {len(image_bytes)} bytes available."
        )

    metadata: Dict[str, Any] = {
        "decoded_at_utc": now_iso(),

        "magic": f"0x{magic:04X}",
        "protocol_version": protocol_version,
        "message_type": message_type,
        "message_type_name": "alert_snapshot" if message_type == 1 else "heartbeat" if message_type == 2 else f"unknown_{message_type}",
        "header_length": header_length,
        "flags": flags,
        "image_present_flag": image_present_flag,

        "packet_sequence": read_u32(packet, 0x08),
        "timestamp_utc_epoch": read_u32(packet, 0x0C),
        "timestamp_utc_iso": datetime.fromtimestamp(read_u32(packet, 0x0C), tz=timezone.utc).isoformat(),

        "site_id_hash": f"0x{read_u32(packet, 0x10):08X}",
        "edge_device_id_hash": f"0x{read_u32(packet, 0x14):08X}",
        "message_id_hash": f"0x{read_u32(packet, 0x18):08X}",
        "event_id_hash": f"0x{read_u32(packet, 0x1C):08X}",

        "camera_id": read_u8(packet, 0x20),
        "event_type": read_u8(packet, 0x21),
        "event_type_name": safe_enum(EVENT_TYPE, read_u8(packet, 0x21)),
        "severity": read_u8(packet, 0x22),
        "severity_name": safe_enum(SEVERITY, read_u8(packet, 0x22)),
        "confidence": read_u16(packet, 0x23) / 1000.0,
        "activity_zone": read_u8(packet, 0x25),
        "activity_zone_name": safe_enum(ACTIVITY_ZONES, read_u8(packet, 0x25)),
        "object_count": read_u16(packet, 0x26),

        "ehs_code_count": ehs_code_count,
        "ehs_codes": ehs_codes,
        "ehs_labels": ehs_labels,

        "snapshot_reason_code": read_u8(packet, 0x31),
        "snapshot_reason": safe_enum(SNAPSHOT_REASON, read_u8(packet, 0x31)),

        "active_camera_count": read_u8(packet, 0x32),
        "configured_camera_count": configured_camera_count,
        "detection_enabled": read_u8(packet, 0x34),
        "system_status": read_u8(packet, 0x35),
        "system_status_name": safe_enum(SYSTEM_STATUS, read_u8(packet, 0x35)),
        "heartbeat_interval_sec": read_u16(packet, 0x36),
        "edge_uptime_sec": read_u32(packet, 0x38),
        "cpu_usage_percent": read_u8(packet, 0x3C),
        "ram_usage_percent": read_u8(packet, 0x3D),
        "disk_free_percent": read_u8(packet, 0x3E),

        "camera_status_bitmap": f"0x{camera_status_bitmap:04X}",
        "online_cameras": camera_bitmap_to_list(camera_status_bitmap, configured_camera_count),

        "model_id": read_u8(packet, 0x41),
        "image_format": read_u8(packet, 0x42),
        "image_format_name": safe_enum(IMAGE_FORMAT, read_u8(packet, 0x42)),
        "image_encoding": read_u8(packet, 0x43),
        "image_encoding_name": safe_enum(IMAGE_ENCODING, read_u8(packet, 0x43)),
        "image_width": read_u16(packet, 0x44),
        "image_height": read_u16(packet, 0x46),
        "image_size_bytes": image_size_bytes,
        "image_crc32_received": f"0x{image_crc32_received:08X}",
        "image_crc32_calculated": f"0x{image_crc32_calculated:08X}",
        "image_crc32_ok": image_crc32_ok,

        "header_crc16_received": f"0x{header_crc_received:04X}",
        "header_crc16_calculated": f"0x{header_crc_calculated:04X}",
        "header_crc16_ok": header_crc_ok,

        "payload_size_bytes": len(packet),
        "has_image": bool(image_bytes),
        "jpeg_valid": validate_jpeg(image_bytes) if image_bytes else False,
    }

    return {
        "metadata": metadata,
        "image_bytes": image_bytes,
    }


def save_image_and_metadata(topic: str, decoded: Dict[str, Any]) -> Tuple[Optional[str], Optional[str]]:
    metadata = decoded["metadata"]
    image_bytes: bytes = decoded["image_bytes"]

    topic_info = get_topic_parts(topic)
    tenant_id = topic_info.get("tenant_id") or "unknown_tenant"
    site_id = topic_info.get("site_id") or "unknown_site"

    event_type_name = metadata.get("event_type_name", "event")
    camera_id = metadata.get("camera_id", 0)
    sequence = metadata.get("packet_sequence", 0)
    timestamp = metadata.get("timestamp_utc_epoch", int(time.time()))

    day = datetime.fromtimestamp(int(timestamp), tz=timezone.utc).strftime("%Y-%m-%d")

    output_dir = Path(SAVE_IMAGE_DIR) / sanitize_filename_part(tenant_id) / sanitize_filename_part(site_id) / day
    output_dir.mkdir(parents=True, exist_ok=True)

    base_name = (
        f"{int(timestamp)}_seq{sequence}_cam{camera_id}_"
        f"{sanitize_filename_part(str(event_type_name))}"
    )

    image_path: Optional[str] = None
    metadata_path: Optional[str] = None

    if image_bytes:
        image_path_obj = output_dir / f"{base_name}.jpg"
        with open(image_path_obj, "wb") as f:
            f.write(image_bytes)
        image_path = str(image_path_obj)

    if SAVE_METADATA_JSON:
        metadata_copy = dict(metadata)
        metadata_copy["topic"] = topic
        metadata_copy["tenant_id_from_topic"] = tenant_id
        metadata_copy["site_id_from_topic"] = site_id
        metadata_copy["saved_image_path"] = image_path

        metadata_path_obj = output_dir / f"{base_name}.json"
        with open(metadata_path_obj, "w", encoding="utf-8") as f:
            json.dump(metadata_copy, f, indent=2, ensure_ascii=False)
        metadata_path = str(metadata_path_obj)

    return image_path, metadata_path


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


def print_metadata_summary(topic: str, detected_payload_mode: str, metadata: Dict[str, Any], image_path: Optional[str]) -> None:
    msg_type = metadata.get("message_type")
    msg_type_name = metadata.get("message_type_name")

    print("\n" + "=" * 100)
    print(f"Topic:              {topic}")
    print(f"Payload mode:       {detected_payload_mode}")
    print(f"Message:            {msg_type} ({msg_type_name})")
    print(f"Sequence:           {metadata.get('packet_sequence')}")
    print(f"Timestamp:          {metadata.get('timestamp_utc_iso')}")
    print(f"Header CRC:         {metadata.get('header_crc16_ok')} "
          f"{metadata.get('header_crc16_received')} / {metadata.get('header_crc16_calculated')}")
    print(f"Payload bytes:      {metadata.get('payload_size_bytes')}")

    if msg_type == MESSAGE_TYPE_ALERT_SNAPSHOT:
        print("-" * 100)
        print(f"Camera ID:          {metadata.get('camera_id')}")
        print(f"Event:              {metadata.get('event_type')} ({metadata.get('event_type_name')})")
        print(f"Severity:           {metadata.get('severity')} ({metadata.get('severity_name')})")
        print(f"Confidence:         {metadata.get('confidence')}")
        print(f"Zone:               {metadata.get('activity_zone')} ({metadata.get('activity_zone_name')})")
        print(f"Object Count:       {metadata.get('object_count')}")
        print(f"EHS Codes:          {metadata.get('ehs_codes')}")
        print(f"EHS Labels:         {metadata.get('ehs_labels')}")
        print(f"Snapshot Reason:    {metadata.get('snapshot_reason_code')} ({metadata.get('snapshot_reason')})")
        print(f"Image:              {metadata.get('image_width')}x{metadata.get('image_height')} "
              f"{metadata.get('image_size_bytes')} bytes")
        print(f"Image CRC:          {metadata.get('image_crc32_ok')} "
              f"{metadata.get('image_crc32_received')} / {metadata.get('image_crc32_calculated')}")
        print(f"JPEG valid:         {metadata.get('jpeg_valid')}")
        print(f"Saved image:        {image_path}")

    elif msg_type == MESSAGE_TYPE_HEARTBEAT:
        print("-" * 100)
        print(f"System Status:      {metadata.get('system_status')} ({metadata.get('system_status_name')})")
        print(f"Cameras:            {metadata.get('active_camera_count')}/{metadata.get('configured_camera_count')}")
        print(f"Online Cameras:     {metadata.get('online_cameras')}")
        print(f"Detection Enabled:  {metadata.get('detection_enabled')}")
        print(f"Heartbeat Interval: {metadata.get('heartbeat_interval_sec')} sec")
        print(f"Uptime:             {metadata.get('edge_uptime_sec')} sec")
        print(f"CPU/RAM/Disk:       {metadata.get('cpu_usage_percent')}% / "
              f"{metadata.get('ram_usage_percent')}% / {metadata.get('disk_free_percent')}%")

    if PRINT_FULL_METADATA:
        print("-" * 100)
        print(json.dumps(metadata, indent=2, ensure_ascii=False))

    print("=" * 100 + "\n")


def main() -> int:
    client_id = f"decoder-{socket.gethostname()}-{os.getpid()}"
    client, broker_host, broker_port = create_mqtt_client(client_id)

    stop = {"value": False}

    def stop_handler(signum, frame):
        stop["value"] = True
        try:
            client.disconnect()
        except Exception:
            pass

    signal.signal(signal.SIGINT, stop_handler)
    signal.signal(signal.SIGTERM, stop_handler)

    def on_connect(client, userdata, flags, reason_code, properties=None):
        print(f"[MQTT] Connected to {broker_host}:{broker_port}, reason={reason_code}")
        print(f"[MQTT] Subscribing to: {MQTT_TOPIC_FILTER}")
        client.subscribe(MQTT_TOPIC_FILTER, qos=MQTT_QOS)

    def on_message(client, userdata, msg):
        try:
            packet, detected_payload_mode = normalize_payload(msg.payload)

            if PRINT_HEX_HEADER:
                print("[DEBUG] Header HEX:", packet[:HEADER_SIZE].hex(" ").upper())

            decoded = decode_ai_vision_packet(packet)
            image_path, metadata_path = save_image_and_metadata(msg.topic, decoded)

            metadata = decoded["metadata"]
            metadata["saved_metadata_path"] = metadata_path

            print_metadata_summary(msg.topic, detected_payload_mode, metadata, image_path)

        except Exception as exc:
            print("\n" + "!" * 100)
            print(f"[ERROR] Failed to decode message on topic: {msg.topic}")
            print(f"[ERROR] Payload size: {len(msg.payload)} bytes")
            print(f"[ERROR] {exc}")
            print("!" * 100 + "\n")

    # paho v1/v2 compatible callback assignment
    client.on_connect = on_connect
    client.on_message = on_message

    print("=" * 100)
    print("AI Vision Security & EHS MQTT Binary Packet Decoder")
    print("=" * 100)
    print(f"Broker:        {broker_host}:{broker_port}")
    print(f"Topic Filter:  {MQTT_TOPIC_FILTER}")
    print(f"Payload Mode:  {PAYLOAD_MODE}")
    print(f"Save Dir:      {SAVE_IMAGE_DIR}")
    print("=" * 100)

    client.connect(broker_host, broker_port, keepalive=60)

    # Blocking loop until Ctrl+C
    try:
        client.loop_forever()
    except KeyboardInterrupt:
        pass
    finally:
        try:
            client.disconnect()
        except Exception:
            pass
        print("Stopped.")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
