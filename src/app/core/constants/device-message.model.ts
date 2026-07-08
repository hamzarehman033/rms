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
  gensetPowerW: number;
  tenant1LoadW: number;
  tenant1Current: number;
  tenant2LoadW: number;
  tenant2Current: number;
  tenant3LoadW: number;
  tenant3Current: number;
  tenant4LoadW: number;
  tenant4Current: number;
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
  alarm1Code: string;
  alarm1Level: string;
  alarm2Code: string;
  alarm2Level: string;
  alarm3Code: string;
  alarm3Level: string;
  alarmBitmap1: number;
  crc16: number;
  gensetPowerW: number;
  tenant1LoadW: number;
  tenant1Current: number;
  tenant2LoadW: number;
  tenant2Current: number;
  tenant3LoadW: number;
  tenant3Current: number;
  tenant4LoadW: number;
  tenant4Current: number;
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
  decodedPayload: DecodedPayload;
  decodingError: string | null;
  isHexPayload?: boolean;
  normalizedHexPayload?: string;
}

export interface RawDeviceDataEvent {
  deviceId: number;
  topic: string;
  payload: string;
  receivedAt: string;
  decodedPayload: RawDecodedPayload;
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

export const ALARM_CODE_LABELS: Record<number, string> = {
  0: 'Mains failure / utility power not available',
  1: 'AC phase failure / one input phase missing',
  2: 'AC input under-voltage',
  3: 'AC input over-voltage',
  4: 'AC frequency abnormal',
  5: 'AC energy meter or AC sensor communication failure',
  10: 'Rectifier AC fail',
  11: 'Rectifier missing / removed / not detected',
  12: 'Rectifier module fault',
  13: 'Rectifier communication failure',
  14: 'Rectifier high temperature',
  15: 'Rectifier overload / capacity exceeded',
  20: 'DC bus under-voltage',
  21: 'DC bus over-voltage',
  22: 'DC load overload',
  23: 'DC fuse/MCB trip or load branch fault',
  24: 'LVD1 disconnected',
  25: 'LVD2 disconnected',
  26: 'DC output power abnormal',
  30: 'Battery low',
  31: 'Battery critical low',
  32: 'Battery discharging',
  33: 'Battery high temperature',
  34: 'Battery low temperature',
  35: 'BMU / lithium battery communication failure',
  36: 'Battery SOH low',
  37: 'Battery current abnormal',
  38: 'Battery backup time low',
  40: 'Generator running event',
  41: 'Generator start failure',
  42: 'Generator stop failure',
  43: 'Generator fault / controller alarm',
  44: 'Generator battery low',
  45: 'Generator controller communication failure',
  46: 'Generator output power abnormal',
  50: 'Fuel low',
  51: 'Fuel critical low',
  52: 'Fuel theft / sudden fuel drop',
  53: 'Fuel sensor communication failure',
  54: 'Fuel sensor invalid / out of range',
  60: 'Solar charging event',
  61: 'Solar controller communication failure',
  62: 'Solar low output / abnormal generation',
  63: 'Solar input over-voltage',
  64: 'Solar controller fault',
  70: 'Environment high temperature',
  71: 'Environment low temperature',
  72: 'High humidity',
  73: 'Door open',
  74: 'Smoke alarm',
  75: 'Water leak alarm',
  76: 'Motion/intrusion alarm',
  80: 'Gateway/device communication failure',
  81: 'SNMP device unavailable',
  82: 'Modbus device unavailable',
  83: 'Sensor data invalid',
  84: 'Data stale / telemetry timeout',
  90: 'Tenant 1 load overload',
  91: 'Tenant 2 load overload',
  92: 'Tenant 3 load overload',
  93: 'Tenant 4 load overload',
  94: 'Tenant current sensor failure',
  95: 'Site outage / load down',
  65535: 'No alarm in this slot',
};


export const SYSTEM_STATUS_ENUM: Record<number, string> = {
  1: 'Normal',
  2: 'Major Alarm',
  3: 'Critical Alarm',
  4: 'Warning',
  5: 'Comms Issue'
};



export function mapDecodedPayload(raw:RawDecodedPayload): DecodedPayload {
  return {
    ...raw,
    deviceType: DEVICE_TYPE_LABELS[raw.deviceType] ?? `Unknown (${raw.deviceType})`,
    manufacturer: MANUFACTURER_LABELS[raw.manufacturer] ?? `Unknown (${raw.manufacturer})`,
    model: MODEL_LABELS[raw.model] ?? `Unknown (${raw.model})`,
    systemStatus: raw.systemStatus,
    batteryStatus: BATTERY_STATUS_LABELS[raw.batteryStatus] ?? `Unknown (${raw.batteryStatus})`,
    gensetControlMode: GENSET_CONTROL_MODE_LABELS[raw.gensetControlMode] ?? `Unknown (${raw.gensetControlMode})`,
    alarm1Code: ALARM_CODE_LABELS[raw.alarm1Code] ?? `Unknown (${raw.alarm1Code})`,
    alarm2Code: ALARM_CODE_LABELS[raw.alarm2Code] ?? `Unknown (${raw.alarm2Code})`,
    alarm3Code: ALARM_CODE_LABELS[raw.alarm3Code] ?? `Unknown (${raw.alarm3Code})`,
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
