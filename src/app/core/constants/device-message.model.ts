// Field semantics and enum/value mappings:
// docs/browser/mqtt-decoded-payload-reference.md
export interface RawDecodedPayload {
  id: number;
  tenantId: string;
  deviceId: string;
  tenantNumber: number;
  siteNumber: number;
  deviceNumber: number;
  epochTime: string;
  portalReceiveTime: string;
  packetVersion: number;
  deviceType: number;
  manufacturer: number;
  model: number;
  deviceIdHash: number;
  packetSequence: number;
  systemStatus: number;
  activeAlarmCount: number;
  lineAVoltage: number;
  lineBVoltage: number;
  lineCVoltage: number;
  lineACurrent: number;
  lineBCurrent: number;
  lineCCurrent: number;
  acFrequency: number;
  totalAcInputPowerW: number;
  totalAcEnergyWh: number;
  mainsAvailable: boolean;
  mainsFailure: boolean;
  dcBusVoltage: number;
  dcLoadCurrent: number;
  dcLoadPowerW: number;
  dcLoadPercent: number;
  totalDcEnergyWh: number;
  rectifierInstalledCount: number;
  rectifierCommCount: number;
  rectifierTotalCurrent: number;
  rectifierTotalDcPowerW: number;
  rectifierAcFail: boolean;
  rectifierMissing: boolean;
  rectifierMaxTemperature: number;
  batteryStatus: number;
  batteryVoltage: number;
  batteryCurrent: number;
  batteryRemainingPercent: number;
  batteryTotalCapacityAh: number;
  batteryRemainingCapacityAh: number;
  batteryBackupTimeMin: number;
  batteryTemperature: number;
  batterySoh: number;
  bmuOnlineCount: number;
  batteryChargeDischargeKw: number;
  solarAvailable: boolean;
  solarVoltage: number;
  solarCurrent: number;
  solarPowerW: number;
  solarEnergyTodayWh: number;
  solarControllerCount: number;
  solarControllerCommFail: number;
  solarChargingHours: number;
  gensetAvailable: boolean;
  gensetRunning: boolean;
  gensetStartFailure: boolean;
  gensetControlMode: number;
  gensetRunHours: number;
  gensetStartCount: number;
  fuelLevelPercent: number;
  fuelVolumeL: number;
  fuelTheftAlarm: boolean;
  fuelLowAlarm: boolean;
  ambientTemperature1: number;
  ambientTemperature2: number;
  humidity: number;
  doorOpenAlarm: boolean;
  smokeAlarm: boolean;
  waterLeakAlarm: boolean;
  motionAlarm: boolean;
  digitalInputBitmap: number;
  relayOutputBitmap: number;
  alarm1Code: number;
  alarm1Level: number | null;
  alarm2Code: number;
  alarm2Level: number | null;
  alarm3Code: number;
  alarm3Level: number | null;
  alarmBitmap1: number;
  crc16: number;
  isCrcValid: boolean;
  receivedAtUtc: string;
  error: string | null;
  regionId: number;
  subRegionId: number;
  zoneId: number;
  [key: string]: unknown;
}

export interface DecodedPayload {
  id: number;
  tenantId: string;
  deviceId: string;
  tenantNumber: number;
  siteNumber: number;
  deviceNumber: number;
  epochTime: string;
  portalReceiveTime: string;
  packetVersion: number;
  deviceType: string;
  manufacturer: string;
  model: string;
  deviceIdHash: number;
  packetSequence: number;
  systemStatus: string;
  activeAlarmCount: number;
  lineAVoltage: number;
  lineBVoltage: number;
  lineCVoltage: number;
  lineACurrent: number;
  lineBCurrent: number;
  lineCCurrent: number;
  acFrequency: number;
  totalAcInputPowerW: number;
  totalAcEnergyWh: number;
  mainsAvailable: string;
  mainsFailure: string;
  dcBusVoltage: number;
  dcLoadCurrent: number;
  dcLoadPowerW: number;
  dcLoadPercent: number;
  totalDcEnergyWh: number;
  rectifierInstalledCount: number;
  rectifierCommCount: number;
  rectifierTotalCurrent: number;
  rectifierTotalDcPowerW: number;
  rectifierAcFail: string;
  rectifierMissing: string;
  rectifierMaxTemperature: number;
  batteryStatus: string;
  batteryVoltage: number;
  batteryCurrent: number;
  batteryRemainingPercent: number;
  batteryTotalCapacityAh: number;
  batteryRemainingCapacityAh: number;
  batteryBackupTimeMin: number;
  batteryTemperature: number;
  batterySoh: number;
  bmuOnlineCount: number;
  batteryChargeDischargeKw: number;
  solarAvailable: string;
  solarVoltage: number;
  solarCurrent: number;
  solarPowerW: number;
  solarEnergyTodayWh: number;
  solarControllerCount: number;
  solarControllerCommFail: string;
  solarChargingHours: number;
  gensetAvailable: string;
  gensetRunning: string;
  gensetStartFailure: string;
  gensetControlMode: string;
  gensetRunHours: number;
  gensetStartCount: number;
  fuelLevelPercent: number;
  fuelVolumeL: number;
  fuelTheftAlarm: string;
  fuelLowAlarm: string;
  ambientTemperature1: number;
  ambientTemperature2: number;
  humidity: number;
  doorOpenAlarm: string;
  smokeAlarm: string;
  waterLeakAlarm: string;
  motionAlarm: string;
  digitalInputBitmap: number;
  relayOutputBitmap: number;
  alarm1Code: number;
  alarm1Level: string;
  alarm2Code: number;
  alarm2Level: string;
  alarm3Code: number;
  alarm3Level: string;
  alarmBitmap1: number;
  crc16: number;
  isCrcValid: boolean;
  receivedAtUtc: string;
  error: string | null;
  regionId: number;
  subRegionId: number;
  zoneId: number;
  [key: string]: unknown;
}

export interface DeviceDataEvent {
  deviceId: number;
  topic: string;
  payload: string;
  receivedAt: string;
  decodedPayload: RawDecodedPayload | DecodedPayload |null;
  decodingError: string | null;
  isHexPayload?: boolean;
  normalizedHexPayload?: string;
}

export const DEVICE_TYPE_LABELS: Record<number, string> = {
  1: 'Telecom RMS Controller/Gateway'
};

export const MANUFACTURER_LABELS: Record<number, string> = {
  1: 'Huawei',
  2: 'Vertiv',
  3: 'ZTE',
  4: 'Delta',
  5: 'Generic'
};

export const MODEL_LABELS: Record<number, string> = {
  1: 'SMU03A',
  2: 'SMU02C',
  16: 'Generic SNMP Rectifier',
  32: 'Generic Modbus Gateway'
};

export const BATTERY_STATUS_LABELS: Record<number, string> = {
  0: 'Unknown',
  1: 'Float Charge',
  2: 'Boost Charge',
  3: 'Discharge',
  4: 'Idle/Offline'
};

export const GENSET_CONTROL_MODE_LABELS: Record<number, string> = {
  0: 'Unknown',
  1: 'Auto',
  2: 'Manual',
  3: 'Disabled'
};

export const ALARM_LEVEL_LABELS: Record<number, string> = {
  1: 'Critical',
  2: 'Major',
  3: 'Minor',
  4: 'Warning'
};

export const SYSTEM_STATUS_FLAGS: string[] = [
  'Normal',
  'Major Alarm',
  'Critical Alarm',
  'Warning',
  'Comms Issue'
];



export function mapDecodedPayload(raw:RawDecodedPayload): DecodedPayload {
  return {
    ...raw,
    deviceType: DEVICE_TYPE_LABELS[raw.deviceType] ?? `Unknown (${raw.deviceType})`,
    manufacturer: MANUFACTURER_LABELS[raw.manufacturer] ?? `Unknown (${raw.manufacturer})`,
    model: MODEL_LABELS[raw.model] ?? `Unknown (${raw.model})`,
    systemStatus: SYSTEM_STATUS_FLAGS[raw.systemStatus] ?? `Unknown (${raw.systemStatus})`,
    batteryStatus: BATTERY_STATUS_LABELS[raw.batteryStatus] ?? `Unknown (${raw.batteryStatus})`,
    gensetControlMode: GENSET_CONTROL_MODE_LABELS[raw.gensetControlMode] ?? `Unknown (${raw.gensetControlMode})`,
    alarm1Level: raw.alarm1Level == null ? 'None' : ALARM_LEVEL_LABELS[raw.alarm1Level] ?? `Unknown (${raw.alarm1Level})`,
    alarm2Level: raw.alarm2Level == null ? 'None' : ALARM_LEVEL_LABELS[raw.alarm2Level] ?? `Unknown (${raw.alarm2Level})`,
    alarm3Level: raw.alarm3Level == null ? 'None' : ALARM_LEVEL_LABELS[raw.alarm3Level] ?? `Unknown (${raw.alarm3Level})`,
    mainsAvailable: raw.mainsAvailable ? 'Available' : 'Not Available',
    mainsFailure: raw.mainsFailure ? 'Failure' : 'Normal',
    rectifierAcFail: raw.rectifierAcFail ? 'AC Fail' : 'Normal',
    rectifierMissing: raw.rectifierMissing ? 'Missing Alarm' : 'Normal',
    solarAvailable: raw.solarAvailable ? 'Available' : 'Not Available',
    gensetAvailable: raw.gensetAvailable ? 'Configured' : 'Not Configured',
    gensetRunning: raw.gensetRunning ? 'Running' : 'Stopped',
    gensetStartFailure: raw.gensetStartFailure ? 'Start Failure' : 'Normal',
    fuelTheftAlarm: raw.fuelTheftAlarm ? 'Alarm' : 'Normal',
    fuelLowAlarm: raw.fuelLowAlarm ? 'Alarm' : 'Normal',
    doorOpenAlarm: raw.doorOpenAlarm ? 'Open' : 'Closed',
    smokeAlarm: raw.smokeAlarm ? 'Alarm' : 'Normal',
    waterLeakAlarm: raw.waterLeakAlarm ? 'Alarm' : 'Normal',
    motionAlarm: raw.motionAlarm ? 'Alarm' : 'Normal',
    solarControllerCommFail: raw.solarControllerCommFail ? 'Comm Fail' : 'Normal'
  };
}

// Backward-compatible alias for existing imports.
export type DeviceMessage = DeviceDataEvent;
