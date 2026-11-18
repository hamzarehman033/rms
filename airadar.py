#!/usr/bin/env python3
"""
Mock RD-03D radar MQTT publisher - Compact Protocol v2.2 (30 bytes).

Publishes 2 radars, 3 slots each, on the existing AI Vision /ai topic:
    [A1 56] [01] [03] [radar_status] [sequence]
    [A1 4B][A2 4B][A3 4B][B1 4B][B2 4B][B3 4B]

Each target record = angle U8 | distance_mm U16 big-endian | speed_cmps U8.
An unused slot is FF FF FF FF. This is binary MQTT, NOT hex text.
It sends randomized scenes with smooth position jitter, plus optional
simulated sensor disconnects. No physical radar sensor is required.

Requires: pip install paho-mqtt
Tested format using protocol's known 30-byte reference example.
"""

import random
import struct
import threading
import time
import uuid

# -------------------- EDIT CONFIGURATION HERE --------------------
BROKER_HOST = "101c718374a04285ab37b8eee7fd1030.s1.eu.hivemq.cloud"
BROKER_PORT = 8883  # Common alternatives: 8883 for MQTT over TLS
MQTT_USERNAME = "hamzarehman"  # Set only if the broker requires login
MQTT_PASSWORD = "password"
USE_TLS = True    # True for a broker configured with trusted TLS certificate

TENANT_ID = "mobiserve"
SITE_ID = "ISB"
DEVICE_ID = "MOCK-005"  # Must match the platform's subscribed/registered device
MQTT_TOPIC = f"telecom/{TENANT_ID}/{SITE_ID}/{DEVICE_ID}/ai"

PUBLISH_HZ = 5                # One complete radar scene every 200 ms
SCENE_CHANGE_SECONDS = 7.0   # Change target counts periodically
QOS = 0                      # Radar live state: QoS 0 and retain=False
PRINT_EVERY_N_PACKETS = 5    # Log packet hex once per second at 5 Hz
DRY_RUN = False              # True: print without connecting to MQTT
# ---------------------------------------------------------------

MAGIC = b"\xA1\x56"
PROTOCOL_VERSION = 0x01
MESSAGE_TYPE_RADAR = 0x03
EMPTY_SLOT = b"\xFF" * 4
PACKET_LENGTH = 30

# (label, number of Radar A targets, number of Radar B targets,
#  Radar A online, Radar B online)
SCENARIOS = [
    ("A=2, B=0", 2, 0, True, True),
    ("A=0, B=3", 0, 3, True, True),
    ("A=2, B=3", 2, 3, True, True),
    ("A=3, B=2", 3, 2, True, True),
    ("A=1, B=1", 1, 1, True, True),
    ("A=3, B=3", 3, 3, True, True),
    ("No targets", 0, 0, True, True),
    ("A offline, B=2", 0, 2, False, True),
    ("B offline, A=2", 2, 0, True, False),
]


def new_target():
    """Random plausible test target; represents one temporary radar slot."""
    return {
        "angle": random.randint(0, 180),       # whole degrees
        "distance": random.randint(300, 7500), # mm
        "speed": random.randint(0, 200),       # cm/s magnitude
    }


def new_scene(previous_label=None):
    choices = [s for s in SCENARIOS if s[0] != previous_label]
    label, n_a, n_b, online_a, online_b = random.choice(choices)
    slots = [[None, None, None], [None, None, None]]
    for radar_index, count in ((0, n_a), (1, n_b)):
        for slot_index in random.sample(range(3), count):
            slots[radar_index][slot_index] = new_target()
    return label, (online_a, online_b), slots


def move_scene(slots):
    """Small changes every 200ms for a smoother UI than random teleports."""
    for radar in slots:
        for target in radar:
            if target is None:
                continue
            target["angle"] = max(0, min(180, target["angle"] + random.randint(-2, 2)))
            target["distance"] = max(0, min(8000, target["distance"] + random.randint(-80, 80)))
            target["speed"] = max(0, min(255, target["speed"] + random.randint(-5, 5)))


def pack_slot(target):
    if target is None:
        return EMPTY_SLOT
    angle, distance, speed = target["angle"], target["distance"], target["speed"]
    if not (0 <= angle <= 180 and 0 <= distance <= 8000 and 0 <= speed <= 255):
        raise ValueError(f"Invalid mock radar target: {target}")
    return struct.pack(">BHB", angle, distance, speed)


def make_packet(online, slots, sequence):
    if len(online) != 2 or len(slots) != 2 or any(len(r) != 3 for r in slots):
        raise ValueError("Expected two radars, three slots per radar")
    if not (0 <= sequence <= 255):
        raise ValueError("Sequence must be in range 0..255")
    status = (0x01 if online[0] else 0) | (0x02 if online[1] else 0)
    payload = bytearray(MAGIC + bytes((PROTOCOL_VERSION, MESSAGE_TYPE_RADAR, status, sequence)))
    for radar_index in range(2):
        for target in slots[radar_index]:
            if not online[radar_index] and target is not None:
                raise ValueError("Offline radar cannot carry targets")
            payload.extend(pack_slot(target))
    if len(payload) != PACKET_LENGTH:
        raise AssertionError(f"Expected 30 bytes; got {len(payload)}")
    return bytes(payload)


def verify_protocol_reference():
    """Verify against the exact reference packet from the v2.2 document."""
    online = (True, True)
    slots = [
        [{"angle": 123, "distance": 350, "speed": 17}, None, None],
        [{"angle": 52, "distance": 1594, "speed": 102}, None, None],
    ]
    expected = bytes.fromhex(
        "A1 56 01 03 03 2A "
        "7B 01 5E 11 FF FF FF FF FF FF FF FF "
        "34 06 3A 66 FF FF FF FF FF FF FF FF"
    )
    actual = make_packet(online, slots, sequence=0x2A)
    assert actual == expected, "Protocol reference HEX does not match v2.2"
    assert len(actual) == 30


def format_scene(slots, online):
    parts = []
    for index, name in ((0, "A"), (1, "B")):
        if not online[index]:
            parts.append(f"{name}=OFFLINE")
        else:
            live = [(slot + 1, t) for slot, t in enumerate(slots[index]) if t is not None]
            parts.append(f"{name}={len(live)} target(s)")
    return " | ".join(parts)


def main():
    verify_protocol_reference()
    if not (0 < PUBLISH_HZ <= 50) or SCENE_CHANGE_SECONDS <= 0:
        raise SystemExit("PUBLISH_HZ must be 1..50 and SCENE_CHANGE_SECONDS positive")
    if BROKER_HOST == "YOUR_MQTT_BROKER_IP_OR_HOST" and not DRY_RUN:
        raise SystemExit("First edit BROKER_HOST at the top of this script")

    connected = threading.Event()
    client = None

    if not DRY_RUN:
        try:
            import paho.mqtt.client as mqtt
        except ImportError:
            raise SystemExit("Missing dependency. Install it with: pip install paho-mqtt")

        # Works with paho-mqtt 1.x and 2.x (VERSION1 callback API).
        client = mqtt.Client(client_id="radar-mock-" + uuid.uuid4().hex[:10],
                             protocol=mqtt.MQTTv311)
        if MQTT_USERNAME:
            client.username_pw_set(MQTT_USERNAME, MQTT_PASSWORD)
        if USE_TLS:
            client.tls_set()  # OS certificate authorities; TLS verification stays ON.

        def on_connect(_client, _userdata, _flags, rc, *args):
            if int(rc) == 0:
                connected.set()
                print(f"[MQTT] Connected to {BROKER_HOST}:{BROKER_PORT}")
            else:
                connected.clear()
                print(f"[MQTT] Connection refused: {rc}")

        def on_disconnect(_client, _userdata, rc, *args):
            connected.clear()
            print(f"[MQTT] Disconnected ({rc}); waiting for reconnect...")

        client.on_connect = on_connect
        client.on_disconnect = on_disconnect
        client.reconnect_delay_set(min_delay=1, max_delay=10)
        try:
            client.connect(BROKER_HOST, BROKER_PORT, keepalive=60)
            client.loop_start()
        except OSError as exc:
            raise SystemExit(f"Could not connect to MQTT broker: {exc}")

        if not connected.wait(10):
            client.loop_stop()
            raise SystemExit("No successful MQTT CONNACK. Check broker/port/credentials/TLS.")
    else:
        print("[DRY RUN] MQTT disabled; packets printed but not sent.")

    print(f"Topic: {MQTT_TOPIC}")
    print(f"Format: 30-byte BINARY / A1 56 01 03 / QoS {QOS} / retain=False / {PUBLISH_HZ} Hz")
    print("Ctrl+C stops. Scene target counts change periodically.\n")

    seq = 0
    packet_counter = 0
    next_scene_time = 0.0
    label = None
    online = (True, True)
    slots = [[None] * 3, [None] * 3]
    interval = 1.0 / PUBLISH_HZ
    next_send = time.monotonic()

    try:
        while True:
            now = time.monotonic()
            if now >= next_scene_time:
                label, online, slots = new_scene(previous_label=label)
                next_scene_time = now + SCENE_CHANGE_SECONDS
                print(f"\n[NEW SCENE] {label} / {format_scene(slots, online)}")
            else:
                move_scene(slots)

            payload = make_packet(online, slots, seq)
            if DRY_RUN or connected.is_set():
                if client is not None:
                    result = client.publish(MQTT_TOPIC, payload=payload, qos=QOS, retain=False)
                    if result.rc != mqtt.MQTT_ERR_SUCCESS:
                        print(f"[MQTT] Publish failed: rc={result.rc}")
                if packet_counter % max(1, PRINT_EVERY_N_PACKETS) == 0:
                    print(f"SEQ={seq:03d} | status=0x{payload[4]:02X} | "
                          f"{format_scene(slots, online)} | {len(payload)} bytes")
                    print("HEX:", payload.hex(" ").upper())
            elif packet_counter % max(1, PRINT_EVERY_N_PACKETS) == 0:
                print("[MQTT] Not connected; dropping stale position frame")

            seq = (seq + 1) & 0xFF
            packet_counter += 1
            next_send += interval
            delay = next_send - time.monotonic()
            if delay > 0:
                time.sleep(delay)
            elif delay < -interval:
                next_send = time.monotonic()
    except KeyboardInterrupt:
        print("\nStopping publisher...")
        if client is not None and connected.is_set():
            # Publish an immediate clear/offline frame (not retained).
            final_packet = make_packet((False, False), [[None] * 3, [None] * 3], seq)
            client.publish(MQTT_TOPIC, payload=final_packet, qos=QOS, retain=False)
            time.sleep(0.15)
    finally:
        if client is not None:
            client.disconnect()
            client.loop_stop()
        print("Stopped.")


if __name__ == "__main__":
    main()
