# MQTT Decoded Payload Reference

This document captures the decoded payload dictionary for `DeviceDataReceived` and the value semantics to use for binding and display.

## Packet Version

- Current packet: v1.2
- `packetVersion`: `3` (`0x03`)
- Payload length: `425` bytes (`0x1A9`)
- Compatibility: bytes `0x00` through `0xBB` preserve the v1.1 layout. New v1.2 fields start at `0xBC`.
- Legacy compatibility: older devices may still send v1.1 packets with `packetVersion = 2` and `188` bytes.
- Base CRC: `crc16` at `0x9E`, computed over bytes `0x00..0x9D`.
- Extension CRC: `extensionCrc16` at `0x1A7`, computed over bytes `0xA0..0x1A6`.

## Canonical Payload Sample

```json
{
  "id": 57,
  "tenantId": "mobiserve",
  "deviceId": "MOCK-001",
  "tenantNumber": 0,
  "siteNumber": 0,
  "deviceNumber": 7,
  "epochTime": "2026-07-18T08:41:17+00:00",
  "portalReceiveTime": "2026-07-18T08:41:17+00:00",
  "packetVersion": 3,
  "deviceType": 1,
  "manufacturer": 1,
  "model": 2,
  "siteIdHash": 16113112,
  "deviceIdHash": 794748950,
  "packetSequence": 74,
  "systemStatus": 1,
  "activeAlarmCount": 3,
  "lineAVoltage": 221.3,
  "lineBVoltage": 220.8,
  "lineCVoltage": 222,
  "lineACurrent": 37.8,
  "lineBCurrent": 36.5,
  "lineCCurrent": 35.9,
  "acFrequency": 50,
  "totalAcInputPowerW": 8225,
  "totalAcEnergyWh": 251602,
  "mainsAvailable": true,
  "mainsFailure": false,
  "dcBusVoltage": 54.5,
  "dcLoadCurrent": 131.1,
  "dcLoadPowerW": 7117,
  "dcLoadPercent": 85,
  "totalDcEnergyWh": 181392,
  "rectifierInstalledCount": 3,
  "rectifierCommCount": 3,
  "rectifierTotalCurrent": 142.6,
  "rectifierTotalDcPowerW": 7817,
  "rectifierAcFail": false,
  "rectifierMissing": true,
  "rectifierMaxTemperature": 30.6,
  "batteryStatus": 1,
  "batteryVoltage": 54.5,
  "batteryCurrent": 11,
  "batteryRemainingPercent": 99,
  "batteryTotalCapacityAh": 500,
  "batteryRemainingCapacityAh": 495,
  "batteryBackupTimeMin": 216,
  "batteryTemperature": 21.8,
  "batterySoh": 90,
  "bmuOnlineCount": 5,
  "batteryChargeDischargeKw": 0.6,
  "solarAvailable": true,
  "solarVoltage": 56,
  "solarCurrent": 15,
  "solarPowerW": 840,
  "solarEnergyTodayWh": 5000,
  "solarControllerCount": 2,
  "solarControllerCommFail": true,
  "solarChargingHours": 6,
  "gensetAvailable": true,
  "gensetRunning": true,
  "gensetStartFailure": false,
  "gensetControlMode": 1,
  "gensetRunHours": 320,
  "gensetStartCount": 45,
  "fuelLevelPercent": 18,
  "fuelVolumeL": 90,
  "fuelTheftAlarm": false,
  "fuelLowAlarm": true,
  "ambientTemperature1": 31.3,
  "ambientTemperature2": 30.5,
  "humidity": 47.8,
  "doorOpenAlarm": true,
  "smokeAlarm": false,
  "waterLeakAlarm": false,
  "motionAlarm": false,
  "digitalInputBitmap": 17,
  "relayOutputBitmap": 1,
  "alarm1Code": 11,
  "alarm1Level": 2,
  "alarm2Code": 50,
  "alarm2Level": 3,
  "alarm3Code": 73,
  "alarm3Level": 4,
  "alarmBitmap1": 730,
  "crc16": 7604,
  "gensetPowerW": 5000,
  "tenant1LoadW": 3200,
  "tenant1Current": 58.7,
  "tenant2LoadW": 1800,
  "tenant2Current": 33,
  "tenant3LoadW": 1300,
  "tenant3Current": 23.9,
  "tenant4LoadW": 817,
  "tenant4Current": 15,
  "deviceUptime": 987654,
  "signalStrength": -72,
  "networkType": 4,
  "simStatus": 2,
  "dataValidityBitmap": 63,
  "lastSuccessfulPollAge": 5,
  "gatewayCpuUsage": 23,
  "gatewayRamUsage": 48,
  "gatewayTemperature": 42.5,
  "activePowerSource": 5,
  "powerSourcePriority": 4614,
  "hybridModeEnabled": true,
  "gensetVoltageL1": 221,
  "gensetVoltageL2": 220,
  "gensetVoltageL3": 222,
  "gensetCurrentL1": 12.6,
  "gensetCurrentL2": 12.4,
  "gensetCurrentL3": 12.7,
  "gensetFrequency": 50,
  "gensetBatteryVoltage": 12.6,
  "gensetFuelConsumptionRate": 2.4,
  "gensetNextServiceHours": 120,
  "fuelTankCapacity": 500,
  "fuelSensorStatus": 1,
  "fuelConsumptionRate": 2.4,
  "fuelRuntimeRemaining": 2250,
  "batterySoc": 99,
  "batteryCycleCount": 24,
  "batteryTotalDischargeTimes": 18,
  "batteryTotalDischargeEnergyWh": 125000,
  "batteryMaxCellVoltageMv": 3650,
  "batteryMinCellVoltageMv": 3625,
  "batteryMaxCellTemp": 30,
  "batteryStatusExtended": 0,
  "batteryContactorStatus": 2,
  "rectifierFaultCount": 0,
  "rectifierCapacityTotalW": 12000,
  "rectifierCapacityUsedPercent": 65.1,
  "rectifierEfficiency": 95,
  "rectifierRedundancyStatus": 1,
  "rectifierHighestLoadModulePercent": 21.7,
  "dcLvd1Status": 1,
  "dcLvd2Status": 1,
  "dcFuseAlarmBitmap": 0,
  "dcBranchAlarmBitmap": 0,
  "dcCriticalLoadCurrent": 58.7,
  "dcNoncriticalLoadCurrent": 71.9,
  "batteryLvdStatus": 1,
  "solarTotalEnergyLifetimeWh": 500000,
  "solarControllerFaultCount": 1,
  "solarBatteryChargeCurrent": 5,
  "solarMpptStatus": 1,
  "solarDailyPeakPowerW": 1100,
  "solarPanelStringAlarmBitmap": 0,
  "rectifier1OutputCurrent": 35.6,
  "rectifier2OutputCurrent": 35.6,
  "rectifier3OutputCurrent": 35.6,
  "rectifier4OutputCurrent": 35.6,
  "alarm4Code": 70,
  "alarm4Level": 3,
  "alarm5Code": 90,
  "alarm5Level": 3,
  "alarm6Code": 61,
  "alarm6Level": 3,
  "extMainL1Voltage": 221.3,
  "extMainL2Voltage": 220.8,
  "extMainL3Voltage": 222,
  "extMainL1Current": 37.8,
  "extMainL2Current": 36.5,
  "extMainL3Current": 35.9,
  "extMainFrequency": 50,
  "extMainTotalPowerW": 8225,
  "extMainTotalEnergyWh": 251602,
  "extGensetL1Voltage": 221,
  "extGensetL2Voltage": 220,
  "extGensetL3Voltage": 222,
  "extGensetL1Current": 12.6,
  "extGensetL2Current": 12.4,
  "extGensetL3Current": 12.7,
  "extGensetFrequency": 50,
  "extGensetTotalPowerW": 5000,
  "extGensetTotalEnergyWh": 15000,
  "futureReservedBuffer": "00 00 ...",
  "extensionCrc16": 39450,
  "isCrcValid": true,
  "isExtensionCrcValid": true,
  "receivedAtUtc": "2026-07-18T08:41:17.6140498Z",
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
- `networkType`
  - `0`: unknown
  - `1`: Ethernet
  - `2`: 2G
  - `3`: 3G
  - `4`: 4G
  - `5`: 5G
  - `6`: Wi-Fi
- `simStatus`
  - `0`: unknown
  - `1`: missing
  - `2`: registered
  - `3`: roaming
  - `4`: no service
  - `5`: PIN locked
- `activePowerSource`
  - `0`: unknown
  - `1`: mains
  - `2`: generator
  - `3`: solar
  - `4`: battery
  - `5`: hybrid
- `fuelSensorStatus`
  - `0`: unknown
  - `1`: normal
  - `2`: disconnected
  - `3`: invalid
  - `4`: stuck
- `batteryContactorStatus`
  - `0`: unknown
  - `1`: open/disconnected
  - `2`: closed/connected
  - `3`: fault
- `rectifierRedundancyStatus`
  - `0`: unknown
  - `1`: N+1 available
  - `2`: no redundancy
  - `3`: overloaded
  - `4`: fault
- `dcLvd1Status`, `dcLvd2Status`, `batteryLvdStatus`
  - `0`: unknown
  - `1`: connected
  - `2`: disconnected
  - `3`: fault
- `solarMpptStatus`
  - `0`: unknown
  - `1`: normal
  - `2`: fault
  - `3`: limited
  - `4`: offline
- `alarm1Level` through `alarm6Level`
  - `1`: critical
  - `2`: major
  - `3`: minor
  - `4`: warning
  - `null`: no alarm level
- `alarm1Code` through `alarm6Code` (alarm type/title map)
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
| packetVersion | Packet schema version. v1.2 uses `3`. |
| deviceType | Device type enum (see value maps). |
| manufacturer | Manufacturer enum (see value maps). |
| model | Model enum (see value maps). |
| siteIdHash | CRC32/hash of site code. |
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
| deviceUptime | Gateway/controller uptime in seconds. |
| signalStrength | Cellular signal strength in dBm. |
| networkType | Network type enum (see value maps). |
| simStatus | SIM status enum (see value maps). |
| dataValidityBitmap | Bitmask of valid telemetry sections (AC, DC, battery, fuel, solar, generator, etc.). |
| lastSuccessfulPollAge | Age in seconds of the last successful device poll. |
| gatewayCpuUsage | Gateway CPU usage percent. |
| gatewayRamUsage | Gateway RAM usage percent. |
| gatewayTemperature | Gateway/internal temperature. |
| activePowerSource | Active power source enum (see value maps). |
| powerSourcePriority | Encoded configured power-source priority. |
| hybridModeEnabled | Hybrid mode enabled flag. |
| gensetVoltageL1 | Generator L1 voltage. |
| gensetVoltageL2 | Generator L2 voltage. |
| gensetVoltageL3 | Generator L3 voltage. |
| gensetCurrentL1 | Generator L1 current. |
| gensetCurrentL2 | Generator L2 current. |
| gensetCurrentL3 | Generator L3 current. |
| gensetFrequency | Generator output frequency. |
| gensetBatteryVoltage | Generator starter battery voltage. |
| gensetFuelConsumptionRate | Generator fuel consumption rate in L/h. |
| gensetNextServiceHours | Remaining generator run hours until next service. |
| fuelTankCapacity | Fuel tank capacity in liters. |
| fuelSensorStatus | Fuel sensor status enum (see value maps). |
| fuelConsumptionRate | Fuel consumption rate in L/h. |
| fuelRuntimeRemaining | Estimated runtime remaining in minutes. |
| batterySoc | Battery state of charge percentage. |
| batteryCycleCount | Battery cycle count. |
| batteryTotalDischargeTimes | Total discharge event count. |
| batteryTotalDischargeEnergyWh | Total battery discharge energy. |
| batteryMaxCellVoltageMv | Maximum lithium cell voltage in mV. |
| batteryMinCellVoltageMv | Minimum lithium cell voltage in mV. |
| batteryMaxCellTemp | Maximum battery cell temperature. |
| batteryStatusExtended | Extended BMS status bitmask. |
| batteryContactorStatus | Battery contactor status enum (see value maps). |
| rectifierFaultCount | Number of faulty rectifier modules. |
| rectifierCapacityTotalW | Total installed rectifier capacity. |
| rectifierCapacityUsedPercent | Used rectifier capacity percentage. |
| rectifierEfficiency | Rectifier efficiency percentage. |
| rectifierRedundancyStatus | Rectifier redundancy enum (see value maps). |
| rectifierHighestLoadModulePercent | Highest loaded rectifier module percentage. |
| dcLvd1Status | DC LVD1 status enum (see value maps). |
| dcLvd2Status | DC LVD2 status enum (see value maps). |
| dcFuseAlarmBitmap | DC fuse/MCB alarm bitmask. |
| dcBranchAlarmBitmap | DC branch alarm bitmask. |
| dcCriticalLoadCurrent | Critical DC load branch current. |
| dcNoncriticalLoadCurrent | Non-critical DC load branch current. |
| batteryLvdStatus | Battery LVD status enum (see value maps). |
| solarTotalEnergyLifetimeWh | Lifetime solar energy generation. |
| solarControllerFaultCount | Number of faulty solar controllers. |
| solarBatteryChargeCurrent | Solar contribution to battery charge current. |
| solarMpptStatus | Solar MPPT status enum (see value maps). |
| solarDailyPeakPowerW | Daily peak solar power. |
| solarPanelStringAlarmBitmap | PV string alarm bitmask. |
| rectifier1OutputCurrent | Rectifier module 1 output current. |
| rectifier2OutputCurrent | Rectifier module 2 output current. |
| rectifier3OutputCurrent | Rectifier module 3 output current. |
| rectifier4OutputCurrent | Rectifier module 4 output current. |
| alarm4Code | Fourth active alarm code/index. |
| alarm4Level | Fourth active alarm severity level enum. |
| alarm5Code | Fifth active alarm code/index. |
| alarm5Level | Fifth active alarm severity level enum. |
| alarm6Code | Sixth active alarm code/index. |
| alarm6Level | Sixth active alarm severity level enum. |
| extMainL1Voltage | External main AC meter L1 voltage. |
| extMainL2Voltage | External main AC meter L2 voltage. |
| extMainL3Voltage | External main AC meter L3 voltage. |
| extMainL1Current | External main AC meter L1 current. |
| extMainL2Current | External main AC meter L2 current. |
| extMainL3Current | External main AC meter L3 current. |
| extMainFrequency | External main AC meter frequency. |
| extMainTotalPowerW | External main AC meter total power. |
| extMainTotalEnergyWh | External main AC meter cumulative energy. |
| extGensetL1Voltage | External generator AC meter L1 voltage. |
| extGensetL2Voltage | External generator AC meter L2 voltage. |
| extGensetL3Voltage | External generator AC meter L3 voltage. |
| extGensetL1Current | External generator AC meter L1 current. |
| extGensetL2Current | External generator AC meter L2 current. |
| extGensetL3Current | External generator AC meter L3 current. |
| extGensetFrequency | External generator AC meter frequency. |
| extGensetTotalPowerW | External generator AC meter total power. |
| extGensetTotalEnergyWh | External generator AC meter cumulative energy. |
| futureReservedBuffer | Reserved bytes for future fields. Fill/expect `0x00` until assigned. |
| extensionCrc16 | CRC16 for extension bytes `0xA0..0x1A6`. |
| isCrcValid | CRC validation result. |
| isExtensionCrcValid | Extension CRC validation result when backend exposes it. |
| receivedAtUtc | Backend receive/insert timestamp in UTC. |
| error | Parse/decode error text, null when no error. |
| regionId | Region identifier. |
| subRegionId | Sub-region identifier. |
| zoneId | Zone identifier. |

## Notes

- `siteIdHash` is CRC32/hash of site code, for example `ISB0167`.
- Base payload bytes `0x00` through `0xBB` remain compatible with v1.1. v1.2 fields are appended from `0xBC` onward.
- CRC at `0x9E` is still computed over base bytes `0x00` through `0x9D` for backward compatibility.
- Extension CRC at `0x1A7` is computed over extension bytes `0xA0` through `0x1A6`.
- Backend currently sends camelCase fields in `decodedPayload`, so Angular model uses camelCase naming.
- Where protocol docs mention `0/1`, backend may already normalize into boolean values for alarm/availability flags.
