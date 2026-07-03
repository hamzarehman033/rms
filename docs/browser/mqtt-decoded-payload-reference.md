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
| isCrcValid | CRC validation result. |
| receivedAtUtc | Backend receive/insert timestamp in UTC. |
| error | Parse/decode error text, null when no error. |
| regionId | Region identifier. |
| subRegionId | Sub-region identifier. |
| zoneId | Zone identifier. |

## Notes

- `site_id_hash` was provided in protocol notes as CRC32/hash of site code (for example `ISB0167`), but it is not currently present in the decoded payload sample above.
- Backend currently sends camelCase fields in `decodedPayload`, so Angular model uses camelCase naming.
- Where protocol docs mention `0/1`, backend may already normalize into boolean values for alarm/availability flags.
