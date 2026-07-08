# MQTT Decoded Payload Reference

This document captures the full decoded payload dictionary for `DeviceDataReceived` and the value semantics to use for binding and display.

## Canonical Payload Sample

```json
{
  "id": 57,
  "tenantId": "mobiserve",
  "deviceId": "MOCK-001",
  "tenantNumber": 0,
  "siteNumber": 0,
  "deviceNumber": 7,
  "epochTime": "2026-07-03T07:47:17+00:00",
  "portalReceiveTime": "2026-07-03T07:47:17+00:00",
  "packetVersion": 1,
  "deviceType": 1,
  "manufacturer": 1,
  "model": 2,
  "deviceIdHash": 1002289381,
  "packetSequence": 74,
  "systemStatus": 1,
  "activeAlarmCount": 0,
  "lineAVoltage": 225.9,
  "lineBVoltage": 224.9,
  "lineCVoltage": 211.8,
  "lineACurrent": 11.3,
  "lineBCurrent": 12.1,
  "lineCCurrent": 12.3,
  "acFrequency": 50,
  "totalAcInputPowerW": 7909,
  "totalAcEnergyWh": 251602,
  "mainsAvailable": true,
  "mainsFailure": false,
  "dcBusVoltage": 53.2,
  "dcLoadCurrent": 123.5,
  "dcLoadPowerW": 6571,
  "dcLoadPercent": 77.2,
  "totalDcEnergyWh": 181392,
  "rectifierInstalledCount": 4,
  "rectifierCommCount": 4,
  "rectifierTotalCurrent": 140.8,
  "rectifierTotalDcPowerW": 7514,
  "rectifierAcFail": false,
  "rectifierMissing": false,
  "rectifierMaxTemperature": 30.6,
  "batteryStatus": 1,
  "batteryVoltage": 54.4,
  "batteryCurrent": 17.3,
  "batteryRemainingPercent": 99,
  "batteryTotalCapacityAh": 500,
  "batteryRemainingCapacityAh": 494.6,
  "batteryBackupTimeMin": 240,
  "batteryTemperature": 24.8,
  "batterySoh": 80,
  "bmuOnlineCount": 5,
  "batteryChargeDischargeKw": 0.94,
  "solarAvailable": true,
  "solarVoltage": 59.7,
  "solarCurrent": 4,
  "solarPowerW": 236,
  "solarEnergyTodayWh": 5041,
  "solarControllerCount": 2,
  "solarControllerCommFail": 0,
  "solarChargingHours": 4,
  "gensetAvailable": true,
  "gensetRunning": false,
  "gensetStartFailure": false,
  "gensetControlMode": 1,
  "gensetRunHours": 320,
  "gensetStartCount": 45,
  "fuelLevelPercent": 70,
  "fuelVolumeL": 350,
  "fuelTheftAlarm": false,
  "fuelLowAlarm": false,
  "ambientTemperature1": 31.3,
  "ambientTemperature2": 30.5,
  "humidity": 47.8,
  "doorOpenAlarm": false,
  "smokeAlarm": false,
  "waterLeakAlarm": false,
  "motionAlarm": false,
  "digitalInputBitmap": 0,
  "relayOutputBitmap": 0,
  "alarm1Code": 0,
  "alarm1Level": null,
  "alarm2Code": 0,
  "alarm2Level": null,
  "alarm3Code": 0,
  "alarm3Level": null,
  "alarmBitmap1": 0,
  "crc16": 59182,
  "gensetPowerW": 0,
  "tenant1LoadW": 2500,
  "tenant1Current": 45.9,
  "tenant2LoadW": 2000,
  "tenant2Current": 36.7,
  "tenant3LoadW": 1500,
  "tenant3Current": 27.5,
  "tenant4LoadW": 1117,
  "tenant4Current": 20.5,
  "isCrcValid": false,
  "receivedAtUtc": "2026-07-03T07:47:17.6140498Z",
  "error": null,
  "regionId": 0,
  "subRegionId": 0,
  "zoneId": 0
}
```

## Value Maps

- `deviceType`
  - `0x01`: telecom RMS power controller/gateway
- `manufacturer`
  - `0x01`: Huawei
  - `0x02`: Vertiv
  - `0x03`: ZTE
  - `0x04`: Delta
  - `0x05`: Generic
- `model`
  - `0x01`: SMU03A
  - `0x02`: SMU02C
  - `0x10`: generic SNMP rectifier
  - `0x20`: generic Modbus gateway
- `systemStatus` bitmask
  - `bit0`: normal
  - `bit1`: major alarm
  - `bit2`: critical alarm
  - `bit3`: warning
  - `bit4`: communication issue
- `mainsAvailable`
  - `false`: not available
  - `true`: available
- `mainsFailure`
  - `false`: normal
  - `true`: mains failure
- `rectifierAcFail`
  - `false`: normal
  - `true`: AC fail at rectifier
- `rectifierMissing`
  - `false`: no missing rectifier alarm
  - `true`: missing rectifier alarm active
- `batteryStatus`
  - `0`: unknown
  - `1`: float charge
  - `2`: boost charge
  - `3`: discharge
  - `4`: idle/offline
- `solarAvailable`
  - `false`: no solar
  - `true`: solar controller available
- `gensetAvailable`
  - `false`: no generator configured
  - `true`: generator configured
- `gensetRunning`
  - `false`: stopped
  - `true`: running
- `gensetStartFailure`
  - `false`: no start failure
  - `true`: start failure active
- `gensetControlMode`
  - `0`: unknown
  - `1`: auto
  - `2`: manual
  - `3`: disabled
- `fuelTheftAlarm`, `fuelLowAlarm`, `doorOpenAlarm`, `smokeAlarm`, `waterLeakAlarm`, `motionAlarm`
  - `false`: normal
  - `true`: alarm active
- `alarm1Level`, `alarm2Level`, `alarm3Level`
  - `1`: critical
  - `2`: major
  - `3`: minor
  - `4`: warning
  - `null`: no alarm level
- `alarm1Code`, `alarm2Code`, `alarm3Code` (alarm type/title map)
  - `0`: mains failure / utility power not available
  - `1`: AC phase failure / one input phase missing
  - `2`: AC input under-voltage
  - `3`: AC input over-voltage
  - `4`: AC frequency abnormal
  - `5`: AC energy meter or AC sensor communication failure
  - `10`: rectifier AC fail
  - `11`: rectifier missing / removed / not detected
  - `12`: rectifier module fault
  - `13`: rectifier communication failure
  - `14`: rectifier high temperature
  - `15`: rectifier overload / capacity exceeded
  - `20`: DC bus under-voltage
  - `21`: DC bus over-voltage
  - `22`: DC load overload
  - `23`: DC fuse/MCB trip or load branch fault
  - `24`: LVD1 disconnected
  - `25`: LVD2 disconnected
  - `26`: DC output power abnormal
  - `30`: battery low
  - `31`: battery critical low
  - `32`: battery discharging
  - `33`: battery high temperature
  - `34`: battery low temperature
  - `35`: BMU / lithium battery communication failure
  - `36`: battery SOH low
  - `37`: battery current abnormal
  - `38`: battery backup time low
  - `40`: generator running event
  - `41`: generator start failure
  - `42`: generator stop failure
  - `43`: generator fault / controller alarm
  - `44`: generator battery low
  - `45`: generator controller communication failure
  - `46`: generator output power abnormal
  - `50`: fuel low
  - `51`: fuel critical low
  - `52`: fuel theft / sudden fuel drop
  - `53`: fuel sensor communication failure
  - `54`: fuel sensor invalid / out of range
  - `60`: solar charging event
  - `61`: solar controller communication failure
  - `62`: solar low output / abnormal generation
  - `63`: solar input over-voltage
  - `64`: solar controller fault
  - `70`: environment high temperature
  - `71`: environment low temperature
  - `72`: high humidity
  - `73`: door open
  - `74`: smoke alarm
  - `75`: water leak alarm
  - `76`: motion/intrusion alarm
  - `80`: gateway/device communication failure
  - `81`: SNMP device unavailable
  - `82`: Modbus device unavailable
  - `83`: sensor data invalid
  - `84`: data stale / telemetry timeout
  - `90`: tenant 1 load overload
  - `91`: tenant 2 load overload
  - `92`: tenant 3 load overload
  - `93`: tenant 4 load overload
  - `94`: tenant current sensor failure
  - `95`: site outage / load down
  - `65535 (0xFFFF)`: no alarm in this slot / unused alarm code field

## Field Dictionary

| Field | Meaning |
|---|---|
| id | Database/event row identifier. |
| tenantId | Tenant identifier string. |
| deviceId | Device code/serial in readable format. |
| tenantNumber | Numeric tenant index in packet. |
| siteNumber | Numeric site index in packet. |
| deviceNumber | Numeric device index in packet. |
| epochTime | Device event time (ISO timestamp). |
| portalReceiveTime | Platform receive timestamp (ISO). |
| packetVersion | Packet schema version. |
| deviceType | Device type enum (see value maps). |
| manufacturer | Manufacturer enum (see value maps). |
| model | Model enum (see value maps). |
| deviceIdHash | CRC32/hash of device serial/ID. |
| packetSequence | Incrementing packet counter from device. |
| systemStatus | Overall status bitmask (see value maps). |
| activeAlarmCount | Count of currently active alarms. |
| lineAVoltage | AC phase A (or AB) voltage. |
| lineBVoltage | AC phase B (or BC) voltage; `0xFFFF` sentinel if unavailable/single phase. |
| lineCVoltage | AC phase C (or CA) voltage; `0xFFFF` sentinel if unavailable/single phase. |
| lineACurrent | AC phase A current. |
| lineBCurrent | AC phase B current; `0x7FFF` sentinel if unavailable. |
| lineCCurrent | AC phase C current; `0x7FFF` sentinel if unavailable. |
| acFrequency | AC input frequency. |
| totalAcInputPowerW | Total AC input power feeding site/rectifiers. |
| totalAcEnergyWh | Cumulative AC energy meter reading. |
| mainsAvailable | Grid/mains availability flag (see value maps). |
| mainsFailure | Mains failure alarm flag (see value maps). |
| dcBusVoltage | DC output bus voltage. |
| dcLoadCurrent | Total DC load/output current. |
| dcLoadPowerW | Total DC load/output power. |
| dcLoadPercent | DC load utilization percentage. |
| totalDcEnergyWh | Cumulative DC energy meter reading. |
| rectifierInstalledCount | Count of installed rectifier modules. |
| rectifierCommCount | Count of communicating rectifier modules. |
| rectifierTotalCurrent | Total rectifier output current. |
| rectifierTotalDcPowerW | Total rectifier DC output power. |
| rectifierAcFail | Rectifier AC fail alarm flag. |
| rectifierMissing | Missing rectifier alarm flag. |
| rectifierMaxTemperature | Maximum rectifier temperature. |
| batteryStatus | Battery operation mode enum (see value maps). |
| batteryVoltage | Battery voltage. |
| batteryCurrent | Battery current (sign convention depends on firmware). |
| batteryRemainingPercent | Remaining battery capacity percent. |
| batteryTotalCapacityAh | Installed battery capacity (Ah). |
| batteryRemainingCapacityAh | Remaining battery capacity (Ah). |
| batteryBackupTimeMin | Estimated backup time remaining (minutes). |
| batteryTemperature | Average battery temperature. |
| batterySoh | Battery state of health percentage. |
| bmuOnlineCount | Number of BMUs online/communicating. |
| batteryChargeDischargeKw | Absolute battery charge/discharge power (kW). |
| solarAvailable | Solar controller configured/available flag. |
| solarVoltage | Solar/PV bus voltage. |
| solarCurrent | Solar/PV charging current. |
| solarPowerW | Solar/PV charging power. |
| solarEnergyTodayWh | Solar energy generated today. |
| solarControllerCount | Installed solar controller count. |
| solarControllerCommFail | Solar controller communication failure flag/count. |
| solarChargingHours | Total solar charging hours. |
| gensetAvailable | Generator configured flag. |
| gensetRunning | Generator running flag. |
| gensetStartFailure | Generator start-failure alarm flag. |
| gensetControlMode | Generator control mode enum (see value maps). |
| gensetRunHours | Generator run hours. |
| gensetStartCount | Generator start count. |
| fuelLevelPercent | Fuel level percentage. |
| fuelVolumeL | Fuel volume in liters. |
| fuelTheftAlarm | Fuel theft/drop alarm flag. |
| fuelLowAlarm | Low fuel alarm flag. |
| ambientTemperature1 | Ambient temperature sensor 1. |
| ambientTemperature2 | Ambient temperature sensor 2. |
| humidity | Humidity reading. |
| doorOpenAlarm | Door open alarm flag. |
| smokeAlarm | Smoke alarm flag. |
| waterLeakAlarm | Water leak alarm flag. |
| motionAlarm | Motion/intrusion alarm flag. |
| digitalInputBitmap | Bitmask for DIN1-DIN16. |
| relayOutputBitmap | Bitmask for DO1-DO16 relays/outputs. |
| alarm1Code | First active alarm code/index. |
| alarm1Level | First active alarm severity level enum. |
| alarm2Code | Second active alarm code/index. |
| alarm2Level | Second active alarm severity level enum. |
| alarm3Code | Third active alarm code/index. |
| alarm3Level | Third active alarm severity level enum. |
| alarmBitmap1 | Generic alarm flags bitmap (mains, rectifier, battery, door, generator, solar, fuel, environment). |
| crc16 | CRC checksum from packet. |
| gensetPowerW | Generator output/load power. If generator power meter is unavailable, protocol may carry sentinel 0xFFFFFFFF. |
| tenant1LoadW | Tenant 1 DC load power for shared sites. |
| tenant1Current | Tenant 1 DC load current. |
| tenant2LoadW | Tenant 2 DC load power for shared sites. |
| tenant2Current | Tenant 2 DC load current. |
| tenant3LoadW | Tenant 3 DC load power for shared sites. |
| tenant3Current | Tenant 3 DC load current. |
| tenant4LoadW | Tenant 4 DC load power for shared sites. |
| tenant4Current | Tenant 4 DC load current. |
| isCrcValid | CRC validation result. |
| receivedAtUtc | Backend receive/insert timestamp in UTC. |
| error | Parse/decode error text, null when no error. |
| regionId | Region identifier. |
| subRegionId | Sub-region identifier. |
| zoneId | Zone identifier. |

## Notes

- `site_id_hash` was provided in protocol notes as CRC32/hash of site code (for example `ISB0167`), but it is not currently present in the decoded payload sample above.
- Base payload bytes `0x00` through `0x9F` remain unchanged. Extended fields are appended from `0xA0` onward.
- CRC at `0x9E` is still computed over base bytes `0x00` through `0x9D` for backward compatibility.
- Backend currently sends camelCase fields in `decodedPayload`, so Angular model uses camelCase naming.
- Where protocol docs mention `0/1`, backend may already normalize into boolean values for alarm/availability flags.
