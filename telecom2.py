#!/usr/bin/env python3
"""
Telecom RMS MQTT Hex/Binary Mock Device
=======================================

This version has NO argparse / command-line arguments.

Edit the CONFIG section below only, then run:

    pip install paho-mqtt
    python telecom_rms_mqtt_mock_device_config.py

Broker format supported:
    MQTT_BROKER = "192.168.1.50"
    MQTT_BROKER = "broker.hivemq.com"
    MQTT_BROKER = "mqtt://broker.hivemq.com:1883"
    MQTT_BROKER = "mqtts://your-broker.com:8883"

Payload mode:
    PAYLOAD_MODE = "binary"   # real binary bytes, recommended
    PAYLOAD_MODE = "hex"      # ASCII hex string, easier for testing/backend debugging
"""

from __future__ import annotations

import binascii
import random
import signal
import socket
import struct
import sys
import time
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Tuple
from urllib.parse import urlparse


# =============================================================================
# CONFIG - EDIT THESE VALUES
# =============================================================================

#MQTT_BROKER = "127.0.0.1"       # IP, domain, mqtt://domain:1883, or mqtts://domain:8883
MQTT_BROKER = "101c718374a04285ab37b8eee7fd1030.s1.eu.hivemq.cloud"
MQTT_PORT = 8883                # Used when MQTT_BROKER has no port
MQTT_USERNAME = "hamzarehman"              # Empty string means no username
MQTT_PASSWORD = "password"              # Empty string means no password
MQTT_TLS = True                # True for TLS, or use mqtts:// in MQTT_BROKER

# MQTT_BROKER = "localhost"
# MQTT_PORT = 1883                # Used when MQTT_BROKER has no port
# MQTT_USERNAME = ""              # Empty string means no username
# MQTT_PASSWORD = ""              # Empty string means no password
# MQTT_TLS = False                # True for TLS, or use mqtts:// in MQTT_BROKER
MQTT_QOS = 0
MQTT_RETAIN = False

TENANT_ID = "mobiserve"
SITE_ID = "ISB"
DEVICE_ID = "MOCK-002"

MQTT_TOPIC = f"telecom/{TENANT_ID}/{SITE_ID}/{DEVICE_ID}/telemetry"
#telecom/mobiserve/ISB/MOCK-002/telemetry

INTERVAL_SECONDS = 10            # Send interval
PAYLOAD_MODE = "binary"         # "binary" or "hex"
SEND_COUNT = 0                  # 0 = forever, 10 = send 10 packets then stop

PRINT_HEX_PAYLOAD = False       # True prints full packet hex every send
PRINT_DECODED_SAMPLE = False    # True prints selected decoded values

FORCE_THREE_ALARMS_FOR_TEST = True
TEST_ALARM_FALLBACKS = [(1, 2), (2, 2), (3, 3)]

MANUFACTURER = "huawei"         # huawei, vertiv, zte, delta, generic
MODEL = "smu02c"                # smu02c, smu03a, generic_snmp_rectifier, generic_modbus_gateway
PHASE_COUNT = 3                 # 1 or 3

ENABLE_SOLAR = True
ENABLE_GENSET = True
ENABLE_FUEL = True

CRC_TYPE = "modbus"             # "modbus" or "ccitt"


# =============================================================================
# PACKET MAP
# =============================================================================

PACKET_LENGTH = 425
CRC_OFFSET = 0x9E
RESERVED_OFFSET = 0x96
RESERVED_LENGTH = 8
EXTENSION_CRC_OFFSET = 0x1A7
EXTENSION_CRC_START = 0xA0
FUTURE_RESERVED_OFFSET = 0x167
FUTURE_RESERVED_LENGTH = EXTENSION_CRC_OFFSET - FUTURE_RESERVED_OFFSET

MANUFACTURERS = {
    "huawei": 0x01,
    "vertiv": 0x02,
    "zte": 0x03,
    "delta": 0x04,
    "generic": 0x05,
}

MODELS = {
    "smu03a": 0x01,
    "smu02c": 0x02,
    "generic_snmp_rectifier": 0x10,
    "generic_modbus_gateway": 0x20,
}

FIELD_MAP = [
    # offset, length, field_name, data_type, scale, unit
    (0x00, 4, "epoch_time", "U32", 1, "s"),
    (0x04, 4, "portal_receive_time", "U32", 1, "s"),
    (0x08, 1, "packet_version", "U8", 1, ""),
    (0x09, 1, "device_type", "U8", 1, ""),
    (0x0A, 1, "manufacturer", "U8", 1, ""),
    (0x0B, 1, "model", "U8", 1, ""),
    (0x0C, 4, "site_id_hash", "U32", 1, ""),
    (0x10, 4, "device_id_hash", "U32", 1, ""),
    (0x14, 2, "packet_sequence", "U16", 1, ""),
    (0x16, 2, "system_status", "U16", 1, "bitmask"),
    (0x18, 1, "active_alarm_count", "U8", 1, ""),

    (0x19, 2, "line_a_voltage", "U16", 10, "V"),
    (0x1B, 2, "line_b_voltage", "U16", 10, "V"),
    (0x1D, 2, "line_c_voltage", "U16", 10, "V"),
    (0x1F, 2, "line_a_current", "I16", 10, "A"),
    (0x21, 2, "line_b_current", "I16", 10, "A"),
    (0x23, 2, "line_c_current", "I16", 10, "A"),
    (0x25, 2, "ac_frequency", "U16", 10, "Hz"),
    (0x27, 4, "total_ac_input_power", "U32", 1, "W"),
    (0x2B, 4, "total_ac_energy", "U32", 1, "Wh"),
    (0x2F, 1, "mains_available", "U8", 1, ""),
    (0x30, 1, "mains_failure", "U8", 1, ""),

    (0x31, 2, "dc_bus_voltage", "U16", 10, "V"),
    (0x33, 2, "dc_load_current", "I16", 10, "A"),
    (0x35, 4, "dc_load_power", "U32", 1, "W"),
    (0x39, 2, "dc_load_percent", "U16", 10, "%"),
    (0x3B, 4, "total_dc_energy", "U32", 1, "Wh"),

    (0x3F, 1, "rectifier_installed_count", "U8", 1, ""),
    (0x40, 1, "rectifier_comm_count", "U8", 1, ""),
    (0x41, 2, "rectifier_total_current", "U16", 10, "A"),
    (0x43, 4, "rectifier_total_dc_power", "U32", 1, "W"),
    (0x47, 1, "rectifier_ac_fail", "U8", 1, ""),
    (0x48, 1, "rectifier_missing", "U8", 1, ""),
    (0x49, 2, "rectifier_max_temperature", "I16", 10, "degC"),

    (0x4B, 1, "battery_status", "U8", 1, ""),
    (0x4C, 2, "battery_voltage", "U16", 10, "V"),
    (0x4E, 2, "battery_current", "I16", 10, "A"),
    (0x50, 1, "battery_remaining_percent", "U8", 1, "%"),
    (0x51, 2, "battery_total_capacity", "U16", 10, "Ah"),
    (0x53, 2, "battery_remaining_capacity", "U16", 10, "Ah"),
    (0x55, 2, "battery_backup_time", "U16", 1, "min"),
    (0x57, 2, "battery_temperature", "I16", 10, "degC"),
    (0x59, 1, "battery_soh", "U8", 1, "%"),
    (0x5A, 1, "bmu_online_count", "U8", 1, ""),
    (0x5B, 2, "battery_charge_discharge_power", "U16", 100, "kW"),

    (0x5D, 1, "solar_available", "U8", 1, ""),
    (0x5E, 2, "solar_voltage", "U16", 10, "V"),
    (0x60, 2, "solar_current", "I16", 10, "A"),
    (0x62, 4, "solar_power", "U32", 1, "W"),
    (0x66, 4, "solar_energy_today", "U32", 1, "Wh"),
    (0x6A, 1, "solar_controller_count", "U8", 1, ""),
    (0x6B, 1, "solar_controller_comm_fail", "U8", 1, ""),
    (0x6C, 2, "solar_charging_hours", "U16", 1, "h"),

    (0x6E, 1, "genset_available", "U8", 1, ""),
    (0x6F, 1, "genset_running", "U8", 1, ""),
    (0x70, 1, "genset_start_failure", "U8", 1, ""),
    (0x71, 1, "genset_control_mode", "U8", 1, ""),
    (0x72, 2, "genset_run_hours", "U16", 1, "h"),
    (0x74, 2, "genset_start_count", "U16", 1, ""),

    (0x76, 1, "fuel_level_percent", "U8", 1, "%"),
    (0x77, 2, "fuel_volume_liters", "U16", 1, "L"),
    (0x79, 1, "fuel_theft_alarm", "U8", 1, ""),
    (0x7A, 1, "fuel_low_alarm", "U8", 1, ""),

    (0x7B, 2, "ambient_temperature_1", "I16", 10, "degC"),
    (0x7D, 2, "ambient_temperature_2", "I16", 10, "degC"),
    (0x7F, 2, "humidity", "U16", 10, "%"),

    (0x81, 1, "door_open_alarm", "U8", 1, ""),
    (0x82, 1, "smoke_alarm", "U8", 1, ""),
    (0x83, 1, "water_leak_alarm", "U8", 1, ""),
    (0x84, 1, "motion_alarm", "U8", 1, ""),

    (0x85, 2, "digital_input_bitmap", "U16", 1, "bitmask"),
    (0x87, 2, "relay_output_bitmap", "U16", 1, "bitmask"),

    (0x89, 2, "alarm_1_code", "U16", 1, ""),
    (0x8B, 1, "alarm_1_level", "U8", 1, ""),
    (0x8C, 2, "alarm_2_code", "U16", 1, ""),
    (0x8E, 1, "alarm_2_level", "U8", 1, ""),
    (0x8F, 2, "alarm_3_code", "U16", 1, ""),
    (0x91, 1, "alarm_3_level", "U8", 1, ""),
    (0x92, 4, "alarm_bitmap_1", "U32", 1, "bitmask"),
    (0x96, 8, "reserved", "BYTES", 1, ""),
    (0x9E, 2, "crc16", "U16", 1, ""),
    (0xA0, 4, "genset_power", "U32", 1, "W"),
    (0xA4, 4, "tenant1_load", "U32", 1, "W"),
    (0xA8, 2, "tenant1_current", "I16", 10, "A"),
    (0xAA, 4, "tenant2_load", "U32", 1, "W"),
    (0xAE, 2, "tenant2_current", "I16", 10, "A"),
    (0xB0, 4, "tenant3_load", "U32", 1, "W"),
    (0xB4, 2, "tenant3_current", "I16", 10, "A"),
    (0xB6, 4, "tenant4_load", "U32", 1, "W"),
    (0xBA, 2, "tenant4_current", "I16", 10, "A"),
    (0xBC, 4, "device_uptime", "U32", 1, "s"),
    (0xC0, 2, "signal_strength", "I16", 1, "dBm"),
    (0xC2, 1, "network_type", "U8", 1, ""),
    (0xC3, 1, "sim_status", "U8", 1, ""),
    (0xC4, 4, "data_validity_bitmap", "U32", 1, "bitmask"),
    (0xC8, 2, "last_successful_poll_age", "U16", 1, "s"),
    (0xCA, 1, "gateway_cpu_usage", "U8", 1, "%"),
    (0xCB, 1, "gateway_ram_usage", "U8", 1, "%"),
    (0xCC, 2, "gateway_temperature", "I16", 10, "degC"),
    (0xCE, 1, "active_power_source", "U8", 1, ""),
    (0xCF, 2, "power_source_priority", "U16", 1, ""),
    (0xD1, 1, "hybrid_mode_enabled", "U8", 1, ""),
    (0xD2, 2, "genset_voltage_l1", "U16", 10, "V"),
    (0xD4, 2, "genset_voltage_l2", "U16", 10, "V"),
    (0xD6, 2, "genset_voltage_l3", "U16", 10, "V"),
    (0xD8, 2, "genset_current_l1", "I16", 10, "A"),
    (0xDA, 2, "genset_current_l2", "I16", 10, "A"),
    (0xDC, 2, "genset_current_l3", "I16", 10, "A"),
    (0xDE, 2, "genset_frequency", "U16", 10, "Hz"),
    (0xE0, 2, "genset_battery_voltage", "U16", 10, "V"),
    (0xE2, 2, "genset_fuel_consumption_rate", "U16", 10, "L/h"),
    (0xE4, 2, "genset_next_service_hours", "U16", 1, "h"),
    (0xE6, 2, "fuel_tank_capacity", "U16", 1, "L"),
    (0xE8, 1, "fuel_sensor_status", "U8", 1, ""),
    (0xE9, 2, "fuel_consumption_rate", "U16", 10, "L/h"),
    (0xEB, 2, "fuel_runtime_remaining", "U16", 1, "min"),
    (0xED, 1, "battery_soc", "U8", 1, "%"),
    (0xEE, 2, "battery_cycle_count", "U16", 1, ""),
    (0xF0, 2, "battery_total_discharge_times", "U16", 1, ""),
    (0xF2, 4, "battery_total_discharge_energy", "U32", 1, "Wh"),
    (0xF6, 2, "battery_max_cell_voltage", "U16", 1, "mV"),
    (0xF8, 2, "battery_min_cell_voltage", "U16", 1, "mV"),
    (0xFA, 2, "battery_max_cell_temp", "I16", 10, "degC"),
    (0xFC, 2, "battery_status_extended", "U16", 1, "bitmask"),
    (0xFE, 1, "battery_contactor_status", "U8", 1, ""),
    (0xFF, 1, "rectifier_fault_count", "U8", 1, ""),
    (0x100, 4, "rectifier_capacity_total", "U32", 1, "W"),
    (0x104, 2, "rectifier_capacity_used_percent", "U16", 10, "%"),
    (0x106, 2, "rectifier_efficiency", "U16", 10, "%"),
    (0x108, 1, "rectifier_redundancy_status", "U8", 1, ""),
    (0x109, 2, "rectifier_highest_load_module_percent", "U16", 10, "%"),
    (0x10B, 1, "dc_lvd1_status", "U8", 1, ""),
    (0x10C, 1, "dc_lvd2_status", "U8", 1, ""),
    (0x10D, 4, "dc_fuse_alarm_bitmap", "U32", 1, "bitmask"),
    (0x111, 4, "dc_branch_alarm_bitmap", "U32", 1, "bitmask"),
    (0x115, 2, "dc_critical_load_current", "I16", 10, "A"),
    (0x117, 2, "dc_noncritical_load_current", "I16", 10, "A"),
    (0x119, 1, "battery_lvd_status", "U8", 1, ""),
    (0x11A, 4, "solar_total_energy_lifetime", "U32", 1, "Wh"),
    (0x11E, 1, "solar_controller_fault_count", "U8", 1, ""),
    (0x11F, 2, "solar_battery_charge_current", "I16", 10, "A"),
    (0x121, 1, "solar_mppt_status", "U8", 1, ""),
    (0x122, 4, "solar_daily_peak_power", "U32", 1, "W"),
    (0x126, 4, "solar_panel_string_alarm_bitmap", "U32", 1, "bitmask"),
    (0x12A, 2, "rectifier1_output_current", "U16", 10, "A"),
    (0x12C, 2, "rectifier2_output_current", "U16", 10, "A"),
    (0x12E, 2, "rectifier3_output_current", "U16", 10, "A"),
    (0x130, 2, "rectifier4_output_current", "U16", 10, "A"),
    (0x132, 2, "alarm_4_code", "U16", 1, ""),
    (0x134, 1, "alarm_4_level", "U8", 1, ""),
    (0x135, 2, "alarm_5_code", "U16", 1, ""),
    (0x137, 1, "alarm_5_level", "U8", 1, ""),
    (0x138, 2, "alarm_6_code", "U16", 1, ""),
    (0x13A, 1, "alarm_6_level", "U8", 1, ""),
    (0x13B, 2, "ext_main_l1_voltage", "U16", 10, "V"),
    (0x13D, 2, "ext_main_l2_voltage", "U16", 10, "V"),
    (0x13F, 2, "ext_main_l3_voltage", "U16", 10, "V"),
    (0x141, 2, "ext_main_l1_current", "I16", 10, "A"),
    (0x143, 2, "ext_main_l2_current", "I16", 10, "A"),
    (0x145, 2, "ext_main_l3_current", "I16", 10, "A"),
    (0x147, 2, "ext_main_frequency", "U16", 10, "Hz"),
    (0x149, 4, "ext_main_total_power", "U32", 1, "W"),
    (0x14D, 4, "ext_main_total_energy", "U32", 1, "Wh"),
    (0x151, 2, "ext_genset_l1_voltage", "U16", 10, "V"),
    (0x153, 2, "ext_genset_l2_voltage", "U16", 10, "V"),
    (0x155, 2, "ext_genset_l3_voltage", "U16", 10, "V"),
    (0x157, 2, "ext_genset_l1_current", "I16", 10, "A"),
    (0x159, 2, "ext_genset_l2_current", "I16", 10, "A"),
    (0x15B, 2, "ext_genset_l3_current", "I16", 10, "A"),
    (0x15D, 2, "ext_genset_frequency", "U16", 10, "Hz"),
    (0x15F, 4, "ext_genset_total_power", "U32", 1, "W"),
    (0x163, 4, "ext_genset_total_energy", "U32", 1, "Wh"),
    (0x167, FUTURE_RESERVED_LENGTH, "future_reserved_buffer", "BYTES", 1, ""),
    (0x1A7, 2, "extension_crc16", "U16", 1, ""),
]


# =============================================================================
# UTILS
# =============================================================================

def clamp(value: float, low: float, high: float) -> float:
    return max(low, min(high, value))


def random_walk(value: float, low: float, high: float, step: float) -> float:
    return clamp(value + random.uniform(-step, step), low, high)


def chance(probability: float) -> bool:
    return random.random() < probability


def crc32_hash(text: str) -> int:
    return binascii.crc32(text.encode("utf-8")) & 0xFFFFFFFF


def write_u8(buf: bytearray, offset: int, value: int) -> None:
    buf[offset] = int(clamp(value, 0, 255))


def write_u16(buf: bytearray, offset: int, value: int) -> None:
    struct.pack_into(">H", buf, offset, int(clamp(value, 0, 0xFFFF)))


def write_i16(buf: bytearray, offset: int, value: int) -> None:
    struct.pack_into(">h", buf, offset, int(clamp(value, -32768, 32767)))


def write_u32(buf: bytearray, offset: int, value: int) -> None:
    struct.pack_into(">I", buf, offset, int(clamp(value, 0, 0xFFFFFFFF)))


def write_invalid_u8(buf: bytearray, offset: int) -> None:
    write_u8(buf, offset, 0xFF)


def write_invalid_u16(buf: bytearray, offset: int) -> None:
    write_u16(buf, offset, 0xFFFF)


def write_invalid_i16(buf: bytearray, offset: int) -> None:
    write_i16(buf, offset, 0x7FFF)


def write_invalid_u32(buf: bytearray, offset: int) -> None:
    write_u32(buf, offset, 0xFFFFFFFF)


def scaled_u16(value: float, scale: int) -> int:
    return int(round(value * scale))


def scaled_i16(value: float, scale: int) -> int:
    return int(round(value * scale))


def crc16_modbus(data: bytes) -> int:
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


def crc16_ccitt_false(data: bytes) -> int:
    crc = 0xFFFF
    for b in data:
        crc ^= (b << 8)
        for _ in range(8):
            if crc & 0x8000:
                crc = ((crc << 1) ^ 0x1021) & 0xFFFF
            else:
                crc = (crc << 1) & 0xFFFF
    return crc


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


# =============================================================================
# STATE SIMULATOR
# =============================================================================

@dataclass
class TelecomRmsState:
    site_id: str
    device_id: str
    manufacturer: int
    model: int
    phase_count: int = 3

    packet_sequence: int = 0
    device_start_time: int = field(default_factory=lambda: int(time.time()))
    signal_strength: float = -72.0
    network_type: int = 4
    sim_status: int = 2
    last_successful_poll_age: int = 5
    gateway_cpu_usage: float = 23.0
    gateway_ram_usage: float = 48.0
    gateway_temperature: float = 42.5
    power_source_priority: int = 0x1206
    hybrid_mode_enabled: int = 1

    mains_available: int = 1
    mains_failure: int = 0
    line_a_voltage: float = 228.0
    line_b_voltage: float = 229.0
    line_c_voltage: float = 227.0
    line_a_current: float = 20.0
    line_b_current: float = 20.0
    line_c_current: float = 20.0
    ac_frequency: float = 50.0
    total_ac_energy: float = 250000.0

    dc_bus_voltage: float = 54.4
    dc_load_current: float = 120.0
    dc_load_power: float = 6500.0
    dc_load_percent: float = 75.0
    total_dc_energy: float = 180000.0

    rectifier_installed_count: int = 4
    rectifier_comm_count: int = 4
    rectifier_total_current: float = 125.0
    rectifier_total_dc_power: float = 6800.0
    rectifier_ac_fail: int = 0
    rectifier_missing: int = 0
    rectifier_max_temperature: float = 31.0

    battery_status: int = 1
    battery_voltage: float = 54.3
    battery_current: float = 8.0
    battery_remaining_percent: float = 96.0
    battery_total_capacity: float = 500.0
    battery_temperature: float = 24.0
    battery_soh: int = 98
    bmu_online_count: int = 5

    solar_available: int = 1
    solar_voltage: float = 55.0
    solar_current: float = 20.0
    solar_power: float = 1100.0
    solar_energy_today: float = 5000.0
    solar_controller_count: int = 2
    solar_controller_comm_fail: int = 0
    solar_charging_hours: int = 4

    genset_available: int = 1
    genset_running: int = 0
    genset_start_failure: int = 0
    genset_control_mode: int = 1
    genset_run_hours: int = 320
    genset_start_count: int = 45
    genset_power: float = 0.0
    genset_voltage_l1: float = 221.0
    genset_voltage_l2: float = 220.0
    genset_voltage_l3: float = 222.0
    genset_current_l1: float = 0.0
    genset_current_l2: float = 0.0
    genset_current_l3: float = 0.0
    genset_frequency: float = 50.0
    genset_battery_voltage: float = 12.6
    genset_fuel_consumption_rate: float = 0.0
    genset_next_service_hours: int = 120

    fuel_tank_capacity_liters: int = 500
    fuel_level_percent: float = 70.0
    fuel_theft_alarm: int = 0
    fuel_low_alarm: int = 0
    fuel_sensor_status: int = 1
    fuel_consumption_rate: float = 0.0
    fuel_runtime_remaining: int = 0

    battery_cycle_count: int = 24
    battery_total_discharge_times: int = 18
    battery_total_discharge_energy: float = 125000.0
    battery_max_cell_voltage: int = 3650
    battery_min_cell_voltage: int = 3625
    battery_max_cell_temp: float = 30.0
    battery_status_extended: int = 0
    battery_contactor_status: int = 2

    tenant1_load: float = 2500.0
    tenant2_load: float = 2000.0
    tenant3_load: float = 1500.0
    tenant4_load: float = 1117.0

    ambient_temperature_1: float = 29.0
    ambient_temperature_2: float = 31.0
    humidity: float = 52.0
    door_open_alarm: int = 0
    smoke_alarm: int = 0
    water_leak_alarm: int = 0
    motion_alarm: int = 0

    digital_input_bitmap: int = 0
    relay_output_bitmap: int = 0

    dc_lvd1_status: int = 1
    dc_lvd2_status: int = 1
    dc_fuse_alarm_bitmap: int = 0
    dc_branch_alarm_bitmap: int = 0
    battery_lvd_status: int = 1
    solar_total_energy_lifetime: float = 500000.0
    solar_daily_peak_power: float = 0.0
    solar_panel_string_alarm_bitmap: int = 0
    ext_genset_total_energy: float = 0.0

    active_alarms: List[Tuple[int, int]] = field(default_factory=list)

    def update(self, interval_seconds: float) -> None:
        self.packet_sequence = (self.packet_sequence + 1) % 65536
        self.signal_strength = random_walk(self.signal_strength, -95.0, -55.0, 2.0)
        self.last_successful_poll_age = 0 if chance(0.95) else int(clamp(self.last_successful_poll_age + interval_seconds, 0, 65535))
        self.gateway_cpu_usage = random_walk(self.gateway_cpu_usage, 5.0, 90.0, 4.0)
        self.gateway_ram_usage = random_walk(self.gateway_ram_usage, 20.0, 85.0, 2.0)
        self.gateway_temperature = random_walk(self.gateway_temperature, 28.0, 65.0, 0.5)

        if self.mains_available and chance(0.01):
            self.mains_available = 0
        elif not self.mains_available and chance(0.15):
            self.mains_available = 1
        self.mains_failure = 0 if self.mains_available else 1

        if self.genset_available:
            if self.mains_failure:
                self.genset_start_failure = 1 if chance(0.03) else 0
                self.genset_running = 0 if self.genset_start_failure else 1
            else:
                self.genset_running = 1 if chance(0.003) else 0
                self.genset_start_failure = 0
        else:
            self.genset_running = 0
            self.genset_start_failure = 0

        ac_source_active = bool(self.mains_available or self.genset_running)

        if ac_source_active:
            self.line_a_voltage = random_walk(self.line_a_voltage, 210.0, 245.0, 1.8)
            if self.phase_count == 3:
                self.line_b_voltage = random_walk(self.line_b_voltage, 210.0, 245.0, 1.8)
                self.line_c_voltage = random_walk(self.line_c_voltage, 210.0, 245.0, 1.8)
            self.ac_frequency = random_walk(self.ac_frequency, 49.7, 50.3, 0.05)
        else:
            self.line_a_voltage = 0.0
            self.line_b_voltage = 0.0
            self.line_c_voltage = 0.0
            self.ac_frequency = 0.0

        self.dc_bus_voltage = random_walk(self.dc_bus_voltage, 53.2, 55.4, 0.15)
        self.dc_load_current = random_walk(self.dc_load_current, 60.0, 180.0, 4.5)
        self.dc_load_power = max(0.0, self.dc_bus_voltage * self.dc_load_current)
        self.dc_load_percent = clamp((self.dc_load_current / 160.0) * 100.0, 20.0, 110.0)

        # Keep per-tenant loads coherent with total DC load while allowing small variation.
        shares = [0.35, 0.28, 0.21, 0.16]
        raw_tenant_loads = [
            random_walk(self.dc_load_power * shares[0], 300.0, max(self.dc_load_power, 300.0), 90.0),
            random_walk(self.dc_load_power * shares[1], 250.0, max(self.dc_load_power, 250.0), 80.0),
            random_walk(self.dc_load_power * shares[2], 200.0, max(self.dc_load_power, 200.0), 70.0),
            random_walk(self.dc_load_power * shares[3], 150.0, max(self.dc_load_power, 150.0), 60.0),
        ]
        load_sum = sum(raw_tenant_loads)
        normalization = (self.dc_load_power / load_sum) if load_sum > 0 else 0.0
        self.tenant1_load = raw_tenant_loads[0] * normalization
        self.tenant2_load = raw_tenant_loads[1] * normalization
        self.tenant3_load = raw_tenant_loads[2] * normalization
        self.tenant4_load = raw_tenant_loads[3] * normalization

        if self.solar_available:
            self.solar_voltage = random_walk(self.solar_voltage, 48.0, 62.0, 0.8)
            self.solar_current = random_walk(self.solar_current, 0.0, 65.0, 5.0)
            if chance(0.08):
                self.solar_current *= random.uniform(0.2, 0.8)
            self.solar_power = max(0.0, self.solar_voltage * self.solar_current)
            self.solar_controller_comm_fail = 1 if chance(0.005) else 0
            self.solar_energy_today += self.solar_power * interval_seconds / 3600.0
            self.solar_total_energy_lifetime += self.solar_power * interval_seconds / 3600.0
            self.solar_daily_peak_power = max(self.solar_daily_peak_power, self.solar_power)
            self.solar_panel_string_alarm_bitmap = 1 if self.solar_controller_comm_fail else 0
        else:
            self.solar_voltage = 0.0
            self.solar_current = 0.0
            self.solar_power = 0.0
            self.solar_controller_count = 0
            self.solar_controller_comm_fail = 0
            self.solar_panel_string_alarm_bitmap = 0

        if ac_source_active:
            self.battery_status = 1 if self.battery_remaining_percent >= 90 else 2
            self.battery_current = random_walk(self.battery_current, 2.0, 18.0, 1.5)
            self.battery_voltage = random_walk(self.battery_voltage, 53.6, 55.2, 0.08)
            self.battery_remaining_percent = clamp(self.battery_remaining_percent + random.uniform(0.00, 0.08), 0.0, 100.0)
        else:
            self.battery_status = 3
            load_after_solar = max(0.0, self.dc_load_power - self.solar_power)
            discharge_current = load_after_solar / max(self.battery_voltage, 1.0)
            self.battery_current = -clamp(discharge_current, 5.0, 200.0)
            self.battery_voltage = random_walk(self.battery_voltage, 47.0, 54.0, 0.25)
            ah_used = abs(self.battery_current) * interval_seconds / 3600.0
            percent_drop = (ah_used / max(self.battery_total_capacity, 1.0)) * 100.0
            self.battery_remaining_percent = clamp(self.battery_remaining_percent - percent_drop, 0.0, 100.0)
            self.battery_total_discharge_energy += load_after_solar * interval_seconds / 3600.0

        self.battery_temperature = random_walk(self.battery_temperature, 18.0, 42.0, 0.25)
        self.battery_soh = int(clamp(self.battery_soh + random.choice([0, 0, 0, 0, -1]), 80, 100))
        self.battery_max_cell_voltage = int(clamp(self.battery_voltage / 15.0 * 1000 + random.uniform(5, 20), 2500, 4200))
        self.battery_min_cell_voltage = int(clamp(self.battery_voltage / 15.0 * 1000 - random.uniform(5, 20), 2500, 4200))
        self.battery_max_cell_temp = random_walk(self.battery_max_cell_temp, 20.0, 50.0, 0.3)
        self.battery_status_extended = 1 if self.battery_remaining_percent < 20 else 0
        self.battery_contactor_status = 2 if self.battery_voltage > 44 else 3

        if ac_source_active:
            self.rectifier_ac_fail = 0
            self.rectifier_missing = 1 if chance(0.002) else 0
            self.rectifier_comm_count = self.rectifier_installed_count - self.rectifier_missing
            charging_current = max(self.battery_current, 0.0)
            self.rectifier_total_current = self.dc_load_current + charging_current
            self.rectifier_total_dc_power = self.dc_load_power + (self.battery_voltage * charging_current)
            self.rectifier_max_temperature = random_walk(self.rectifier_max_temperature, 24.0, 55.0, 0.8)
        else:
            self.rectifier_ac_fail = 1
            self.rectifier_comm_count = 0
            self.rectifier_total_current = 0.0
            self.rectifier_total_dc_power = 0.0
            self.rectifier_max_temperature = random_walk(self.rectifier_max_temperature, 20.0, 45.0, 0.4)

        if ac_source_active:
            total_ac_power = self.rectifier_total_dc_power / random.uniform(0.93, 0.96)
            if self.phase_count == 3:
                avg_v = max((self.line_a_voltage + self.line_b_voltage + self.line_c_voltage) / 3.0, 1.0)
                phase_current = total_ac_power / (3.0 * avg_v)
                self.line_a_current = clamp(phase_current * random.uniform(0.92, 1.08), 0.0, 80.0)
                self.line_b_current = clamp(phase_current * random.uniform(0.92, 1.08), 0.0, 80.0)
                self.line_c_current = clamp(phase_current * random.uniform(0.92, 1.08), 0.0, 80.0)
            else:
                self.line_a_current = clamp(total_ac_power / max(self.line_a_voltage, 1.0), 0.0, 120.0)
                self.line_b_current = 0.0
                self.line_c_current = 0.0
        else:
            total_ac_power = 0.0
            self.line_a_current = 0.0
            self.line_b_current = 0.0
            self.line_c_current = 0.0

        self.total_ac_energy += total_ac_power * interval_seconds / 3600.0
        self.total_dc_energy += self.dc_load_power * interval_seconds / 3600.0

        if self.genset_running:
            self.genset_run_hours = min(65535, self.genset_run_hours + int(interval_seconds / 3600))
            self.genset_fuel_consumption_rate = random_walk(self.genset_fuel_consumption_rate or 2.2, 1.0, 8.0, 0.25)
            self.fuel_consumption_rate = self.genset_fuel_consumption_rate
            consumed_liters = self.genset_fuel_consumption_rate * interval_seconds / 3600.0
            consumed_percent = consumed_liters / max(self.fuel_tank_capacity_liters, 1) * 100.0
            self.fuel_level_percent = clamp(self.fuel_level_percent - consumed_percent, 0.0, 100.0)
            self.genset_power = max(0.0, self.dc_load_power - self.solar_power)
            self.genset_voltage_l1 = random_walk(self.genset_voltage_l1, 210.0, 245.0, 1.5)
            self.genset_voltage_l2 = random_walk(self.genset_voltage_l2, 210.0, 245.0, 1.5)
            self.genset_voltage_l3 = random_walk(self.genset_voltage_l3, 210.0, 245.0, 1.5)
            avg_genset_voltage = max((self.genset_voltage_l1 + self.genset_voltage_l2 + self.genset_voltage_l3) / 3.0, 1.0)
            genset_phase_current = self.genset_power / (3.0 * avg_genset_voltage)
            self.genset_current_l1 = clamp(genset_phase_current * random.uniform(0.92, 1.08), 0.0, 120.0)
            self.genset_current_l2 = clamp(genset_phase_current * random.uniform(0.92, 1.08), 0.0, 120.0)
            self.genset_current_l3 = clamp(genset_phase_current * random.uniform(0.92, 1.08), 0.0, 120.0)
            self.genset_frequency = random_walk(self.genset_frequency, 49.7, 50.3, 0.05)
            self.genset_battery_voltage = random_walk(self.genset_battery_voltage, 11.8, 14.4, 0.08)
            self.ext_genset_total_energy += self.genset_power * interval_seconds / 3600.0
        else:
            self.genset_power = 0.0
            self.genset_current_l1 = 0.0
            self.genset_current_l2 = 0.0
            self.genset_current_l3 = 0.0
            self.genset_fuel_consumption_rate = 0.0
            self.fuel_consumption_rate = 0.0

        if chance(0.001):
            self.fuel_theft_alarm = 1
            self.fuel_level_percent = clamp(self.fuel_level_percent - random.uniform(3.0, 10.0), 0.0, 100.0)
        elif chance(0.05):
            self.fuel_theft_alarm = 0
        self.fuel_low_alarm = 1 if self.fuel_level_percent < 20.0 else 0
        fuel_volume_liters = self.fuel_tank_capacity_liters * self.fuel_level_percent / 100.0
        self.fuel_runtime_remaining = int((fuel_volume_liters / max(self.fuel_consumption_rate, 0.1)) * 60) if self.genset_running else 0
        self.fuel_sensor_status = 1 if ENABLE_FUEL else 2

        self.ambient_temperature_1 = random_walk(self.ambient_temperature_1, 18.0, 48.0, 0.35)
        self.ambient_temperature_2 = random_walk(self.ambient_temperature_2, 18.0, 50.0, 0.35)
        self.humidity = random_walk(self.humidity, 20.0, 90.0, 1.0)

        self.door_open_alarm = 1 if chance(0.004) else (0 if chance(0.20) else self.door_open_alarm)
        self.smoke_alarm = 1 if chance(0.0005) else (0 if chance(0.10) else self.smoke_alarm)
        self.water_leak_alarm = 1 if chance(0.0008) else (0 if chance(0.10) else self.water_leak_alarm)
        self.motion_alarm = 1 if chance(0.003) else (0 if chance(0.20) else self.motion_alarm)

        self.relay_output_bitmap = 0
        if self.genset_running:
            self.relay_output_bitmap |= 1 << 0
        if self.ambient_temperature_1 > 35:
            self.relay_output_bitmap |= 1 << 1

        self.digital_input_bitmap = 0
        if self.door_open_alarm:
            self.digital_input_bitmap |= 1 << 0
        if self.smoke_alarm:
            self.digital_input_bitmap |= 1 << 1
        if self.water_leak_alarm:
            self.digital_input_bitmap |= 1 << 2
        if self.motion_alarm:
            self.digital_input_bitmap |= 1 << 3
        if self.fuel_low_alarm:
            self.digital_input_bitmap |= 1 << 4
        if self.mains_failure:
            self.digital_input_bitmap |= 1 << 5

        self.dc_fuse_alarm_bitmap = 1 if self.dc_load_percent > 105 else 0
        self.dc_branch_alarm_bitmap = 1 if self.tenant1_load > self.dc_load_power * 0.50 else 0
        self.dc_lvd1_status = 2 if self.dc_load_percent > 110 else 1
        self.dc_lvd2_status = 2 if self.battery_remaining_percent < 15 else 1
        self.battery_lvd_status = self.dc_lvd2_status

        self.active_alarms = self.build_active_alarm_list()

    def build_alarm_bitmap(self) -> int:
        bitmap = 0
        if self.mains_failure:
            bitmap |= 1 << 0
        if self.rectifier_ac_fail or self.rectifier_missing:
            bitmap |= 1 << 1
        if self.battery_remaining_percent < 35:
            bitmap |= 1 << 2
        if self.door_open_alarm:
            bitmap |= 1 << 3
        if self.genset_running:
            bitmap |= 1 << 4
        if self.genset_start_failure:
            bitmap |= 1 << 5
        if self.solar_controller_comm_fail:
            bitmap |= 1 << 6
        if self.fuel_low_alarm:
            bitmap |= 1 << 7
        if self.fuel_theft_alarm:
            bitmap |= 1 << 8
        if self.ambient_temperature_1 > 40 or self.ambient_temperature_2 > 42:
            bitmap |= 1 << 9
        if self.smoke_alarm:
            bitmap |= 1 << 10
        if self.water_leak_alarm:
            bitmap |= 1 << 11
        if self.motion_alarm:
            bitmap |= 1 << 12
        return bitmap

    def build_active_alarm_list(self) -> List[Tuple[int, int]]:
        alarms: List[Tuple[int, int]] = []
        if self.mains_failure:
            alarms.append((701, 2))
        if self.rectifier_missing:
            alarms.append((755, 2))
        if self.rectifier_ac_fail:
            alarms.append((756, 2))
        if self.battery_remaining_percent < 20:
            alarms.append((801, 1))
        elif self.battery_remaining_percent < 35:
            alarms.append((802, 2))
        if self.genset_start_failure:
            alarms.append((794, 2))
        if self.solar_controller_comm_fail:
            alarms.append((850, 3))
        if self.fuel_low_alarm:
            alarms.append((901, 3))
        if self.fuel_theft_alarm:
            alarms.append((902, 2))
        if self.door_open_alarm:
            alarms.append((910, 4))
        if self.smoke_alarm:
            alarms.append((920, 1))
        if self.water_leak_alarm:
            alarms.append((921, 2))
        if self.motion_alarm:
            alarms.append((922, 4))
        if self.ambient_temperature_1 > 40 or self.ambient_temperature_2 > 42:
            alarms.append((930, 3))
        return alarms[:6]

    def system_status(self) -> int:
        levels = [level for _, level in self.active_alarms]
        status = 0
        if not self.active_alarms:
            status |= 1 << 0
        if 2 in levels:
            status |= 1 << 1
        if 1 in levels:
            status |= 1 << 2
        if 3 in levels or 4 in levels:
            status |= 1 << 3
        if self.solar_controller_comm_fail:
            status |= 1 << 4
        return status

    def to_engineering_dict(self) -> Dict[str, Any]:
        remaining_ah = self.battery_total_capacity * self.battery_remaining_percent / 100.0
        backup_minutes = remaining_ah / max(abs(self.dc_load_current), 1.0) * 60.0
        battery_power_kw = abs(self.battery_voltage * self.battery_current) / 1000.0
        fuel_volume = self.fuel_tank_capacity_liters * self.fuel_level_percent / 100.0
        now = int(time.time())
        active_power_source = 5 if sum([
            bool(self.mains_available),
            bool(self.genset_running),
            bool(self.solar_power > 100),
            bool(self.battery_status == 3),
        ]) > 1 else (
            1 if self.mains_available else
            2 if self.genset_running else
            3 if self.solar_power > 100 else
            4 if self.battery_status == 3 else
            0
        )
        data_validity_bitmap = 0
        data_validity_bitmap |= 1 << 0  # AC
        data_validity_bitmap |= 1 << 1  # DC
        data_validity_bitmap |= 1 << 2  # battery
        if ENABLE_FUEL:
            data_validity_bitmap |= 1 << 3
        if self.solar_available:
            data_validity_bitmap |= 1 << 4
        if self.genset_available:
            data_validity_bitmap |= 1 << 5
        rectifier_fault_count = max(self.rectifier_installed_count - self.rectifier_comm_count, 0)
        rectifier_capacity_total = self.rectifier_installed_count * 3000
        rectifier_capacity_used_percent = (self.rectifier_total_dc_power / max(rectifier_capacity_total, 1)) * 100.0
        rectifier_redundancy_status = 4 if rectifier_fault_count else (3 if rectifier_capacity_used_percent > 95 else 1)
        rectifier_highest_load_module_percent = rectifier_capacity_used_percent / max(self.rectifier_comm_count, 1)
        per_rectifier_current = self.rectifier_total_current / max(self.rectifier_comm_count, 1)
        solar_battery_charge_current = max(self.solar_current - (self.dc_load_current * 0.10), 0.0)
        solar_mppt_status = 2 if self.solar_controller_comm_fail else (1 if self.solar_available else 4)

        return {
            "device_uptime": max(now - self.device_start_time, 0),
            "signal_strength": self.signal_strength,
            "network_type": self.network_type,
            "sim_status": self.sim_status,
            "data_validity_bitmap": data_validity_bitmap,
            "last_successful_poll_age": self.last_successful_poll_age,
            "gateway_cpu_usage": self.gateway_cpu_usage,
            "gateway_ram_usage": self.gateway_ram_usage,
            "gateway_temperature": self.gateway_temperature,
            "active_power_source": active_power_source,
            "power_source_priority": self.power_source_priority,
            "hybrid_mode_enabled": self.hybrid_mode_enabled,
            "packet_sequence": self.packet_sequence,
            "system_status": self.system_status(),
            "active_alarm_count": len(self.active_alarms),

            "line_a_voltage": self.line_a_voltage,
            "line_b_voltage": self.line_b_voltage if self.phase_count == 3 else None,
            "line_c_voltage": self.line_c_voltage if self.phase_count == 3 else None,
            "line_a_current": self.line_a_current,
            "line_b_current": self.line_b_current if self.phase_count == 3 else None,
            "line_c_current": self.line_c_current if self.phase_count == 3 else None,
            "ac_frequency": self.ac_frequency,
            "total_ac_input_power": self.rectifier_total_dc_power / 0.95 if (self.mains_available or self.genset_running) else 0.0,
            "total_ac_energy": self.total_ac_energy,
            "mains_available": self.mains_available,
            "mains_failure": self.mains_failure,

            "dc_bus_voltage": self.dc_bus_voltage,
            "dc_load_current": self.dc_load_current,
            "dc_load_power": self.dc_load_power,
            "dc_load_percent": self.dc_load_percent,
            "total_dc_energy": self.total_dc_energy,

            "rectifier_installed_count": self.rectifier_installed_count,
            "rectifier_comm_count": self.rectifier_comm_count,
            "rectifier_total_current": self.rectifier_total_current,
            "rectifier_total_dc_power": self.rectifier_total_dc_power,
            "rectifier_ac_fail": self.rectifier_ac_fail,
            "rectifier_missing": self.rectifier_missing,
            "rectifier_max_temperature": self.rectifier_max_temperature,

            "battery_status": self.battery_status,
            "battery_voltage": self.battery_voltage,
            "battery_current": self.battery_current,
            "battery_remaining_percent": self.battery_remaining_percent,
            "battery_total_capacity": self.battery_total_capacity,
            "battery_remaining_capacity": remaining_ah,
            "battery_backup_time": backup_minutes,
            "battery_temperature": self.battery_temperature,
            "battery_soh": self.battery_soh,
            "bmu_online_count": self.bmu_online_count,
            "battery_charge_discharge_power": battery_power_kw,

            "solar_available": self.solar_available,
            "solar_voltage": self.solar_voltage,
            "solar_current": self.solar_current,
            "solar_power": self.solar_power,
            "solar_energy_today": self.solar_energy_today,
            "solar_controller_count": self.solar_controller_count,
            "solar_controller_comm_fail": self.solar_controller_comm_fail,
            "solar_charging_hours": self.solar_charging_hours,

            "genset_available": self.genset_available,
            "genset_running": self.genset_running,
            "genset_start_failure": self.genset_start_failure,
            "genset_control_mode": self.genset_control_mode,
            "genset_run_hours": self.genset_run_hours,
            "genset_start_count": self.genset_start_count,
            "genset_power": self.genset_power,
            "genset_voltage_l1": self.genset_voltage_l1,
            "genset_voltage_l2": self.genset_voltage_l2,
            "genset_voltage_l3": self.genset_voltage_l3,
            "genset_current_l1": self.genset_current_l1,
            "genset_current_l2": self.genset_current_l2,
            "genset_current_l3": self.genset_current_l3,
            "genset_frequency": self.genset_frequency,
            "genset_battery_voltage": self.genset_battery_voltage,
            "genset_fuel_consumption_rate": self.genset_fuel_consumption_rate,
            "genset_next_service_hours": self.genset_next_service_hours,

            "fuel_level_percent": self.fuel_level_percent,
            "fuel_volume_liters": fuel_volume,
            "fuel_theft_alarm": self.fuel_theft_alarm,
            "fuel_low_alarm": self.fuel_low_alarm,
            "fuel_tank_capacity": self.fuel_tank_capacity_liters,
            "fuel_sensor_status": self.fuel_sensor_status,
            "fuel_consumption_rate": self.fuel_consumption_rate,
            "fuel_runtime_remaining": self.fuel_runtime_remaining,

            "ambient_temperature_1": self.ambient_temperature_1,
            "ambient_temperature_2": self.ambient_temperature_2,
            "humidity": self.humidity,
            "door_open_alarm": self.door_open_alarm,
            "smoke_alarm": self.smoke_alarm,
            "water_leak_alarm": self.water_leak_alarm,
            "motion_alarm": self.motion_alarm,

            "digital_input_bitmap": self.digital_input_bitmap,
            "relay_output_bitmap": self.relay_output_bitmap,

            "alarm_bitmap_1": self.build_alarm_bitmap(),
            "active_alarms": self.active_alarms,

            "battery_soc": self.battery_remaining_percent,
            "battery_cycle_count": self.battery_cycle_count,
            "battery_total_discharge_times": self.battery_total_discharge_times,
            "battery_total_discharge_energy": self.battery_total_discharge_energy,
            "battery_max_cell_voltage": self.battery_max_cell_voltage,
            "battery_min_cell_voltage": self.battery_min_cell_voltage,
            "battery_max_cell_temp": self.battery_max_cell_temp,
            "battery_status_extended": self.battery_status_extended,
            "battery_contactor_status": self.battery_contactor_status,
            "rectifier_fault_count": rectifier_fault_count,
            "rectifier_capacity_total": rectifier_capacity_total,
            "rectifier_capacity_used_percent": rectifier_capacity_used_percent,
            "rectifier_efficiency": 95.0 if self.rectifier_total_dc_power > 0 else 0.0,
            "rectifier_redundancy_status": rectifier_redundancy_status,
            "rectifier_highest_load_module_percent": rectifier_highest_load_module_percent,
            "dc_lvd1_status": self.dc_lvd1_status,
            "dc_lvd2_status": self.dc_lvd2_status,
            "dc_fuse_alarm_bitmap": self.dc_fuse_alarm_bitmap,
            "dc_branch_alarm_bitmap": self.dc_branch_alarm_bitmap,
            "dc_critical_load_current": self.tenant1_load / max(self.dc_bus_voltage, 1.0),
            "dc_noncritical_load_current": (self.tenant2_load + self.tenant3_load + self.tenant4_load) / max(self.dc_bus_voltage, 1.0),
            "battery_lvd_status": self.battery_lvd_status,
            "solar_total_energy_lifetime": self.solar_total_energy_lifetime,
            "solar_controller_fault_count": 1 if self.solar_controller_comm_fail else 0,
            "solar_battery_charge_current": solar_battery_charge_current,
            "solar_mppt_status": solar_mppt_status,
            "solar_daily_peak_power": self.solar_daily_peak_power,
            "solar_panel_string_alarm_bitmap": self.solar_panel_string_alarm_bitmap,
            "rectifier1_output_current": per_rectifier_current if self.rectifier_comm_count >= 1 else 0.0,
            "rectifier2_output_current": per_rectifier_current if self.rectifier_comm_count >= 2 else 0.0,
            "rectifier3_output_current": per_rectifier_current if self.rectifier_comm_count >= 3 else 0.0,
            "rectifier4_output_current": per_rectifier_current if self.rectifier_comm_count >= 4 else 0.0,
            "ext_main_l1_voltage": self.line_a_voltage,
            "ext_main_l2_voltage": self.line_b_voltage if self.phase_count == 3 else 0.0,
            "ext_main_l3_voltage": self.line_c_voltage if self.phase_count == 3 else 0.0,
            "ext_main_l1_current": self.line_a_current,
            "ext_main_l2_current": self.line_b_current if self.phase_count == 3 else 0.0,
            "ext_main_l3_current": self.line_c_current if self.phase_count == 3 else 0.0,
            "ext_main_frequency": self.ac_frequency,
            "ext_main_total_power": self.rectifier_total_dc_power / 0.95 if (self.mains_available or self.genset_running) else 0.0,
            "ext_main_total_energy": self.total_ac_energy,
            "ext_genset_l1_voltage": self.genset_voltage_l1,
            "ext_genset_l2_voltage": self.genset_voltage_l2,
            "ext_genset_l3_voltage": self.genset_voltage_l3,
            "ext_genset_l1_current": self.genset_current_l1,
            "ext_genset_l2_current": self.genset_current_l2,
            "ext_genset_l3_current": self.genset_current_l3,
            "ext_genset_frequency": self.genset_frequency,
            "ext_genset_total_power": self.genset_power,
            "ext_genset_total_energy": self.ext_genset_total_energy,

            "tenant1_load": self.tenant1_load,
            "tenant1_current": self.tenant1_load / max(self.dc_bus_voltage, 1.0),
            "tenant2_load": self.tenant2_load,
            "tenant2_current": self.tenant2_load / max(self.dc_bus_voltage, 1.0),
            "tenant3_load": self.tenant3_load,
            "tenant3_current": self.tenant3_load / max(self.dc_bus_voltage, 1.0),
            "tenant4_load": self.tenant4_load,
            "tenant4_current": self.tenant4_load / max(self.dc_bus_voltage, 1.0),
        }


# =============================================================================
# ENCODER / DECODER
# =============================================================================

def encode_packet(state: TelecomRmsState) -> Tuple[bytes, Dict[str, Any]]:
    values = state.to_engineering_dict()
    buf = bytearray(PACKET_LENGTH)

    alarms_for_packet = list(values["active_alarms"])
    if FORCE_THREE_ALARMS_FOR_TEST:
        used_alarm_codes = {code for code, _ in alarms_for_packet}
        for code, level in TEST_ALARM_FALLBACKS:
            if len(alarms_for_packet) >= 3:
                break
            if code in used_alarm_codes:
                continue
            alarms_for_packet.append((code, level))
            used_alarm_codes.add(code)
    alarms_for_packet = alarms_for_packet[:6]

    now = int(time.time())

    write_u32(buf, 0x00, now)
    write_u32(buf, 0x04, now)
    write_u8(buf, 0x08, 0x03)
    write_u8(buf, 0x09, 0x01)
    write_u8(buf, 0x0A, state.manufacturer)
    write_u8(buf, 0x0B, state.model)
    write_u32(buf, 0x0C, crc32_hash(state.site_id))
    write_u32(buf, 0x10, crc32_hash(state.device_id))
    write_u16(buf, 0x14, values["packet_sequence"])
    write_u16(buf, 0x16, values["system_status"])
    write_u8(buf, 0x18, len(alarms_for_packet))

    write_u16(buf, 0x19, scaled_u16(values["line_a_voltage"], 10))
    if state.phase_count == 3:
        write_u16(buf, 0x1B, scaled_u16(values["line_b_voltage"], 10))
        write_u16(buf, 0x1D, scaled_u16(values["line_c_voltage"], 10))
        write_i16(buf, 0x21, scaled_i16(values["line_b_current"], 10))
        write_i16(buf, 0x23, scaled_i16(values["line_c_current"], 10))
    else:
        write_invalid_u16(buf, 0x1B)
        write_invalid_u16(buf, 0x1D)
        write_invalid_i16(buf, 0x21)
        write_invalid_i16(buf, 0x23)

    write_i16(buf, 0x1F, scaled_i16(values["line_a_current"], 10))
    write_u16(buf, 0x25, scaled_u16(values["ac_frequency"], 10))
    write_u32(buf, 0x27, int(round(values["total_ac_input_power"])))
    write_u32(buf, 0x2B, int(round(values["total_ac_energy"])))
    write_u8(buf, 0x2F, values["mains_available"])
    write_u8(buf, 0x30, values["mains_failure"])

    write_u16(buf, 0x31, scaled_u16(values["dc_bus_voltage"], 10))
    write_i16(buf, 0x33, scaled_i16(values["dc_load_current"], 10))
    write_u32(buf, 0x35, int(round(values["dc_load_power"])))
    write_u16(buf, 0x39, scaled_u16(values["dc_load_percent"], 10))
    write_u32(buf, 0x3B, int(round(values["total_dc_energy"])))

    write_u8(buf, 0x3F, values["rectifier_installed_count"])
    write_u8(buf, 0x40, values["rectifier_comm_count"])
    write_u16(buf, 0x41, scaled_u16(values["rectifier_total_current"], 10))
    write_u32(buf, 0x43, int(round(values["rectifier_total_dc_power"])))
    write_u8(buf, 0x47, values["rectifier_ac_fail"])
    write_u8(buf, 0x48, values["rectifier_missing"])
    write_i16(buf, 0x49, scaled_i16(values["rectifier_max_temperature"], 10))

    write_u8(buf, 0x4B, values["battery_status"])
    write_u16(buf, 0x4C, scaled_u16(values["battery_voltage"], 10))
    write_i16(buf, 0x4E, scaled_i16(values["battery_current"], 10))
    write_u8(buf, 0x50, int(round(values["battery_remaining_percent"])))
    write_u16(buf, 0x51, scaled_u16(values["battery_total_capacity"], 10))
    write_u16(buf, 0x53, scaled_u16(values["battery_remaining_capacity"], 10))
    write_u16(buf, 0x55, int(round(values["battery_backup_time"])))
    write_i16(buf, 0x57, scaled_i16(values["battery_temperature"], 10))
    write_u8(buf, 0x59, values["battery_soh"])
    write_u8(buf, 0x5A, values["bmu_online_count"])
    write_u16(buf, 0x5B, scaled_u16(values["battery_charge_discharge_power"], 100))

    if state.solar_available:
        write_u8(buf, 0x5D, values["solar_available"])
        write_u16(buf, 0x5E, scaled_u16(values["solar_voltage"], 10))
        write_i16(buf, 0x60, scaled_i16(values["solar_current"], 10))
        write_u32(buf, 0x62, int(round(values["solar_power"])))
        write_u32(buf, 0x66, int(round(values["solar_energy_today"])))
        write_u8(buf, 0x6A, values["solar_controller_count"])
        write_u8(buf, 0x6B, values["solar_controller_comm_fail"])
        write_u16(buf, 0x6C, values["solar_charging_hours"])
    else:
        write_invalid_u8(buf, 0x5D)
        write_invalid_u16(buf, 0x5E)
        write_invalid_i16(buf, 0x60)
        write_invalid_u32(buf, 0x62)
        write_invalid_u32(buf, 0x66)
        write_invalid_u8(buf, 0x6A)
        write_invalid_u8(buf, 0x6B)
        write_invalid_u16(buf, 0x6C)

    if state.genset_available:
        write_u8(buf, 0x6E, values["genset_available"])
        write_u8(buf, 0x6F, values["genset_running"])
        write_u8(buf, 0x70, values["genset_start_failure"])
        write_u8(buf, 0x71, values["genset_control_mode"])
        write_u16(buf, 0x72, values["genset_run_hours"])
        write_u16(buf, 0x74, values["genset_start_count"])
    else:
        write_invalid_u8(buf, 0x6E)
        write_invalid_u8(buf, 0x6F)
        write_invalid_u8(buf, 0x70)
        write_invalid_u8(buf, 0x71)
        write_invalid_u16(buf, 0x72)
        write_invalid_u16(buf, 0x74)

    if ENABLE_FUEL:
        write_u8(buf, 0x76, int(round(values["fuel_level_percent"])))
        write_u16(buf, 0x77, int(round(values["fuel_volume_liters"])))
        write_u8(buf, 0x79, values["fuel_theft_alarm"])
        write_u8(buf, 0x7A, values["fuel_low_alarm"])
    else:
        write_invalid_u8(buf, 0x76)
        write_invalid_u16(buf, 0x77)
        write_invalid_u8(buf, 0x79)
        write_invalid_u8(buf, 0x7A)

    write_i16(buf, 0x7B, scaled_i16(values["ambient_temperature_1"], 10))
    write_i16(buf, 0x7D, scaled_i16(values["ambient_temperature_2"], 10))
    write_u16(buf, 0x7F, scaled_u16(values["humidity"], 10))
    write_u8(buf, 0x81, values["door_open_alarm"])
    write_u8(buf, 0x82, values["smoke_alarm"])
    write_u8(buf, 0x83, values["water_leak_alarm"])
    write_u8(buf, 0x84, values["motion_alarm"])

    write_u16(buf, 0x85, values["digital_input_bitmap"])
    write_u16(buf, 0x87, values["relay_output_bitmap"])

    alarm_offsets = [(0x89, 0x8B), (0x8C, 0x8E), (0x8F, 0x91)]
    for i, (code_offset, level_offset) in enumerate(alarm_offsets):
        if i < len(alarms_for_packet):
            code, level = alarms_for_packet[i]
        else:
            code, level = 0, 0
        code = normalize_alarm_code(code)
        write_u16(buf, code_offset, code)
        write_u8(buf, level_offset, level)

    write_u32(buf, 0x92, values["alarm_bitmap_1"])

    for i in range(RESERVED_LENGTH):
        buf[RESERVED_OFFSET + i] = 0x00

    if CRC_TYPE.lower() == "ccitt":
        crc = crc16_ccitt_false(bytes(buf[:CRC_OFFSET]))
    else:
        crc = crc16_modbus(bytes(buf[:CRC_OFFSET]))

    write_u16(buf, CRC_OFFSET, crc)

    # Extended fields appended after legacy CRC (0xA0+). Bytes 0x00-0x9F remain unchanged.
    if state.genset_available:
        write_u32(buf, 0xA0, int(round(values["genset_power"])))
    else:
        write_invalid_u32(buf, 0xA0)
    write_u32(buf, 0xA4, int(round(values["tenant1_load"])))
    write_i16(buf, 0xA8, scaled_i16(values["tenant1_current"], 10))
    write_u32(buf, 0xAA, int(round(values["tenant2_load"])))
    write_i16(buf, 0xAE, scaled_i16(values["tenant2_current"], 10))
    write_u32(buf, 0xB0, int(round(values["tenant3_load"])))
    write_i16(buf, 0xB4, scaled_i16(values["tenant3_current"], 10))
    write_u32(buf, 0xB6, int(round(values["tenant4_load"])))
    write_i16(buf, 0xBA, scaled_i16(values["tenant4_current"], 10))

    write_u32(buf, 0xBC, int(round(values["device_uptime"])))
    write_i16(buf, 0xC0, int(round(values["signal_strength"])))
    write_u8(buf, 0xC2, values["network_type"])
    write_u8(buf, 0xC3, values["sim_status"])
    write_u32(buf, 0xC4, values["data_validity_bitmap"])
    write_u16(buf, 0xC8, values["last_successful_poll_age"])
    write_u8(buf, 0xCA, int(round(values["gateway_cpu_usage"])))
    write_u8(buf, 0xCB, int(round(values["gateway_ram_usage"])))
    write_i16(buf, 0xCC, scaled_i16(values["gateway_temperature"], 10))
    write_u8(buf, 0xCE, values["active_power_source"])
    write_u16(buf, 0xCF, values["power_source_priority"])
    write_u8(buf, 0xD1, values["hybrid_mode_enabled"])

    if state.genset_available:
        write_u16(buf, 0xD2, scaled_u16(values["genset_voltage_l1"], 10))
        write_u16(buf, 0xD4, scaled_u16(values["genset_voltage_l2"], 10))
        write_u16(buf, 0xD6, scaled_u16(values["genset_voltage_l3"], 10))
        write_i16(buf, 0xD8, scaled_i16(values["genset_current_l1"], 10))
        write_i16(buf, 0xDA, scaled_i16(values["genset_current_l2"], 10))
        write_i16(buf, 0xDC, scaled_i16(values["genset_current_l3"], 10))
        write_u16(buf, 0xDE, scaled_u16(values["genset_frequency"], 10))
        write_u16(buf, 0xE0, scaled_u16(values["genset_battery_voltage"], 10))
        write_u16(buf, 0xE2, scaled_u16(values["genset_fuel_consumption_rate"], 10))
        write_u16(buf, 0xE4, values["genset_next_service_hours"])
    else:
        for offset in (0xD2, 0xD4, 0xD6, 0xDE, 0xE0, 0xE2, 0xE4):
            write_invalid_u16(buf, offset)
        for offset in (0xD8, 0xDA, 0xDC):
            write_invalid_i16(buf, offset)

    if ENABLE_FUEL:
        write_u16(buf, 0xE6, values["fuel_tank_capacity"])
        write_u8(buf, 0xE8, values["fuel_sensor_status"])
        write_u16(buf, 0xE9, scaled_u16(values["fuel_consumption_rate"], 10))
        write_u16(buf, 0xEB, values["fuel_runtime_remaining"])
    else:
        write_invalid_u16(buf, 0xE6)
        write_invalid_u8(buf, 0xE8)
        write_invalid_u16(buf, 0xE9)
        write_invalid_u16(buf, 0xEB)

    write_u8(buf, 0xED, int(round(values["battery_soc"])))
    write_u16(buf, 0xEE, values["battery_cycle_count"])
    write_u16(buf, 0xF0, values["battery_total_discharge_times"])
    write_u32(buf, 0xF2, int(round(values["battery_total_discharge_energy"])))
    write_u16(buf, 0xF6, values["battery_max_cell_voltage"])
    write_u16(buf, 0xF8, values["battery_min_cell_voltage"])
    write_i16(buf, 0xFA, scaled_i16(values["battery_max_cell_temp"], 10))
    write_u16(buf, 0xFC, values["battery_status_extended"])
    write_u8(buf, 0xFE, values["battery_contactor_status"])

    write_u8(buf, 0xFF, values["rectifier_fault_count"])
    write_u32(buf, 0x100, values["rectifier_capacity_total"])
    write_u16(buf, 0x104, scaled_u16(values["rectifier_capacity_used_percent"], 10))
    write_u16(buf, 0x106, scaled_u16(values["rectifier_efficiency"], 10))
    write_u8(buf, 0x108, values["rectifier_redundancy_status"])
    write_u16(buf, 0x109, scaled_u16(values["rectifier_highest_load_module_percent"], 10))

    write_u8(buf, 0x10B, values["dc_lvd1_status"])
    write_u8(buf, 0x10C, values["dc_lvd2_status"])
    write_u32(buf, 0x10D, values["dc_fuse_alarm_bitmap"])
    write_u32(buf, 0x111, values["dc_branch_alarm_bitmap"])
    write_i16(buf, 0x115, scaled_i16(values["dc_critical_load_current"], 10))
    write_i16(buf, 0x117, scaled_i16(values["dc_noncritical_load_current"], 10))
    write_u8(buf, 0x119, values["battery_lvd_status"])

    if state.solar_available:
        write_u32(buf, 0x11A, int(round(values["solar_total_energy_lifetime"])))
        write_u8(buf, 0x11E, values["solar_controller_fault_count"])
        write_i16(buf, 0x11F, scaled_i16(values["solar_battery_charge_current"], 10))
        write_u8(buf, 0x121, values["solar_mppt_status"])
        write_u32(buf, 0x122, int(round(values["solar_daily_peak_power"])))
        write_u32(buf, 0x126, values["solar_panel_string_alarm_bitmap"])
    else:
        write_invalid_u32(buf, 0x11A)
        write_invalid_u8(buf, 0x11E)
        write_invalid_i16(buf, 0x11F)
        write_invalid_u8(buf, 0x121)
        write_invalid_u32(buf, 0x122)
        write_invalid_u32(buf, 0x126)

    write_u16(buf, 0x12A, scaled_u16(values["rectifier1_output_current"], 10))
    write_u16(buf, 0x12C, scaled_u16(values["rectifier2_output_current"], 10))
    write_u16(buf, 0x12E, scaled_u16(values["rectifier3_output_current"], 10))
    write_u16(buf, 0x130, scaled_u16(values["rectifier4_output_current"], 10))

    extra_alarm_offsets = [(0x132, 0x134), (0x135, 0x137), (0x138, 0x13A)]
    for i, (code_offset, level_offset) in enumerate(extra_alarm_offsets, start=3):
        if i < len(alarms_for_packet):
            code, level = alarms_for_packet[i]
        else:
            code, level = 0, 0
        write_u16(buf, code_offset, normalize_alarm_code(code))
        write_u8(buf, level_offset, level)

    write_u16(buf, 0x13B, scaled_u16(values["ext_main_l1_voltage"], 10))
    if state.phase_count == 3:
        write_u16(buf, 0x13D, scaled_u16(values["ext_main_l2_voltage"], 10))
        write_u16(buf, 0x13F, scaled_u16(values["ext_main_l3_voltage"], 10))
        write_i16(buf, 0x143, scaled_i16(values["ext_main_l2_current"], 10))
        write_i16(buf, 0x145, scaled_i16(values["ext_main_l3_current"], 10))
    else:
        write_invalid_u16(buf, 0x13D)
        write_invalid_u16(buf, 0x13F)
        write_invalid_i16(buf, 0x143)
        write_invalid_i16(buf, 0x145)
    write_i16(buf, 0x141, scaled_i16(values["ext_main_l1_current"], 10))
    write_u16(buf, 0x147, scaled_u16(values["ext_main_frequency"], 10))
    write_u32(buf, 0x149, int(round(values["ext_main_total_power"])))
    write_u32(buf, 0x14D, int(round(values["ext_main_total_energy"])))

    if state.genset_available:
        write_u16(buf, 0x151, scaled_u16(values["ext_genset_l1_voltage"], 10))
        write_u16(buf, 0x153, scaled_u16(values["ext_genset_l2_voltage"], 10))
        write_u16(buf, 0x155, scaled_u16(values["ext_genset_l3_voltage"], 10))
        write_i16(buf, 0x157, scaled_i16(values["ext_genset_l1_current"], 10))
        write_i16(buf, 0x159, scaled_i16(values["ext_genset_l2_current"], 10))
        write_i16(buf, 0x15B, scaled_i16(values["ext_genset_l3_current"], 10))
        write_u16(buf, 0x15D, scaled_u16(values["ext_genset_frequency"], 10))
        write_u32(buf, 0x15F, int(round(values["ext_genset_total_power"])))
        write_u32(buf, 0x163, int(round(values["ext_genset_total_energy"])))
    else:
        for offset in (0x151, 0x153, 0x155, 0x15D):
            write_invalid_u16(buf, offset)
        for offset in (0x157, 0x159, 0x15B):
            write_invalid_i16(buf, offset)
        write_invalid_u32(buf, 0x15F)
        write_invalid_u32(buf, 0x163)

    for i in range(FUTURE_RESERVED_LENGTH):
        buf[FUTURE_RESERVED_OFFSET + i] = 0x00

    if CRC_TYPE.lower() == "ccitt":
        extension_crc = crc16_ccitt_false(bytes(buf[EXTENSION_CRC_START:EXTENSION_CRC_OFFSET]))
    else:
        extension_crc = crc16_modbus(bytes(buf[EXTENSION_CRC_START:EXTENSION_CRC_OFFSET]))
    write_u16(buf, EXTENSION_CRC_OFFSET, extension_crc)

    values["active_alarm_count"] = len(alarms_for_packet)
    values["alarm_1_code"], values["alarm_1_level"] = alarms_for_packet[0] if len(alarms_for_packet) > 0 else (0, 0)
    values["alarm_2_code"], values["alarm_2_level"] = alarms_for_packet[1] if len(alarms_for_packet) > 1 else (0, 0)
    values["alarm_3_code"], values["alarm_3_level"] = alarms_for_packet[2] if len(alarms_for_packet) > 2 else (0, 0)
    values["alarm_4_code"], values["alarm_4_level"] = alarms_for_packet[3] if len(alarms_for_packet) > 3 else (0, 0)
    values["alarm_5_code"], values["alarm_5_level"] = alarms_for_packet[4] if len(alarms_for_packet) > 4 else (0, 0)
    values["alarm_6_code"], values["alarm_6_level"] = alarms_for_packet[5] if len(alarms_for_packet) > 5 else (0, 0)
    values["alarm_1_code"] = normalize_alarm_code(values["alarm_1_code"])
    values["alarm_2_code"] = normalize_alarm_code(values["alarm_2_code"])
    values["alarm_3_code"] = normalize_alarm_code(values["alarm_3_code"])
    values["alarm_4_code"] = normalize_alarm_code(values["alarm_4_code"])
    values["alarm_5_code"] = normalize_alarm_code(values["alarm_5_code"])
    values["alarm_6_code"] = normalize_alarm_code(values["alarm_6_code"])

    values["crc16"] = crc
    values["extension_crc16"] = extension_crc
    values["hex_payload"] = bytes(buf).hex(" ").upper()

    return bytes(buf), values


def read_u8(buf: bytes, offset: int) -> Optional[int]:
    value = buf[offset]
    return None if value == 0xFF else value


def read_u16(buf: bytes, offset: int) -> Optional[int]:
    value = struct.unpack_from(">H", buf, offset)[0]
    return None if value == 0xFFFF else value


def read_i16(buf: bytes, offset: int) -> Optional[int]:
    value = struct.unpack_from(">h", buf, offset)[0]
    return None if value == 0x7FFF else value


def read_u32(buf: bytes, offset: int) -> Optional[int]:
    value = struct.unpack_from(">I", buf, offset)[0]
    return None if value == 0xFFFFFFFF else value


def decode_packet(buf: bytes) -> Dict[str, Any]:
    decoded: Dict[str, Any] = {}

    for offset, length, name, dtype, scale, unit in FIELD_MAP:
        if dtype == "BYTES":
            decoded[name] = buf[offset:offset + length].hex(" ").upper()
            continue

        if dtype == "U8":
            raw = read_u8(buf, offset)
        elif dtype == "U16":
            raw = read_u16(buf, offset)
        elif dtype == "I16":
            raw = read_i16(buf, offset)
        elif dtype == "U32":
            raw = read_u32(buf, offset)
        else:
            raw = None

        if raw is None:
            decoded[name] = None
        elif scale and scale not in (0, 1):
            decoded[name] = raw / scale
        else:
            decoded[name] = raw

    return decoded


def normalize_alarm_code(code: int) -> int:
    return abs(int(code)) % 100


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


def main() -> int:
    if PAYLOAD_MODE not in ("binary", "hex"):
        print('ERROR: PAYLOAD_MODE must be "binary" or "hex".', file=sys.stderr)
        return 1

    manufacturer_code = MANUFACTURERS.get(MANUFACTURER.lower(), MANUFACTURERS["generic"])
    model_code = MODELS.get(MODEL.lower(), MODELS["generic_snmp_rectifier"])

    state = TelecomRmsState(
        site_id=SITE_ID,
        device_id=DEVICE_ID,
        manufacturer=manufacturer_code,
        model=model_code,
        phase_count=PHASE_COUNT,
    )

    if not ENABLE_SOLAR:
        state.solar_available = 0
    if not ENABLE_GENSET:
        state.genset_available = 0
    if not ENABLE_FUEL:
        state.fuel_level_percent = 0
        state.fuel_tank_capacity_liters = 0

    client_id = f"mock-{DEVICE_ID}-{socket.gethostname()}"
    client, broker_host, broker_port = create_mqtt_client(client_id)

    print("=" * 80)
    print("Telecom RMS MQTT Mock Device")
    print("=" * 80)
    print(f"Broker:       {broker_host}:{broker_port}")
    print(f"Topic:        {MQTT_TOPIC}")
    print(f"Interval:     {INTERVAL_SECONDS} sec")
    print(f"Payload mode: {PAYLOAD_MODE}")
    print(f"Packet size:  {PACKET_LENGTH} bytes")
    print("=" * 80)

    client.connect(broker_host, broker_port, keepalive=60)
    client.loop_start()

    stop = {"value": False}

    def stop_handler(signum, frame):
        stop["value"] = True

    signal.signal(signal.SIGINT, stop_handler)
    signal.signal(signal.SIGTERM, stop_handler)

    sent = 0

    try:
        while not stop["value"]:
            state.update(INTERVAL_SECONDS)
            packet, values = encode_packet(state)

            if PAYLOAD_MODE == "hex":
                payload = packet.hex().upper().encode("ascii")
                payload_description = f"{len(payload)} ASCII hex chars"
            else:
                payload = packet
                payload_description = f"{len(payload)} binary bytes"

            publish_result = client.publish(MQTT_TOPIC, payload=payload, qos=MQTT_QOS, retain=MQTT_RETAIN)
            if MQTT_QOS > 0:
                publish_result.wait_for_publish()

            sent += 1

            print(
                f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] "
                f"sent={sent} "
                f"seq={values['packet_sequence']} "
                f"payload={payload_description} "
                f"AC_A={values['line_a_voltage']:.1f}V/{values['line_a_current']:.1f}A "
                f"DC={values['dc_bus_voltage']:.1f}V/{values['dc_load_current']:.1f}A/{values['dc_load_power']:.0f}W "
                f"Batt={values['battery_voltage']:.1f}V/{values['battery_current']:.1f}A/{values['battery_remaining_percent']:.0f}% "
                f"Solar={values['solar_power']:.0f}W "
                f"GenRun={values['genset_running']} "
                f"Fuel={values['fuel_level_percent']:.0f}% "
                f"Alarms={values['active_alarm_count']} "
                f"Alarm1={values['alarm_1_code']}/{values['alarm_1_level']} "
                f"Alarm2={values['alarm_2_code']}/{values['alarm_2_level']} "
                f"Alarm3={values['alarm_3_code']}/{values['alarm_3_level']} "
                f"CRC=0x{values['crc16']:04X}"
            )

            if PRINT_HEX_PAYLOAD:
                print(values["hex_payload"])

            if PRINT_DECODED_SAMPLE:
                decoded = decode_packet(packet)
                print({
                    "packet_sequence": decoded.get("packet_sequence"),
                    "line_a_voltage": decoded.get("line_a_voltage"),
                    "line_a_current": decoded.get("line_a_current"),
                    "dc_bus_voltage": decoded.get("dc_bus_voltage"),
                    "dc_load_current": decoded.get("dc_load_current"),
                    "dc_load_power": decoded.get("dc_load_power"),
                    "battery_voltage": decoded.get("battery_voltage"),
                    "battery_current": decoded.get("battery_current"),
                    "battery_remaining_percent": decoded.get("battery_remaining_percent"),
                    "solar_power": decoded.get("solar_power"),
                    "genset_running": decoded.get("genset_running"),
                    "fuel_level_percent": decoded.get("fuel_level_percent"),
                    "alarm_1_code": decoded.get("alarm_1_code"),
                    "alarm_1_level": decoded.get("alarm_1_level"),
                    "alarm_2_code": decoded.get("alarm_2_code"),
                    "alarm_2_level": decoded.get("alarm_2_level"),
                    "alarm_3_code": decoded.get("alarm_3_code"),
                    "alarm_3_level": decoded.get("alarm_3_level"),
                    "alarm_bitmap_1": decoded.get("alarm_bitmap_1"),
                })

            if SEND_COUNT > 0 and sent >= SEND_COUNT:
                break

            time.sleep(INTERVAL_SECONDS)

    finally:
        client.loop_stop()
        client.disconnect()
        print("Stopped.")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
