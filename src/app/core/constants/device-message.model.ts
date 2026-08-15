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
  siteIdHash?: number;
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
  deviceUptime?: number;
  signalStrength?: number;
  networkType?: number;
  simStatus?: number;
  dataValidityBitmap?: number;
  lastSuccessfulPollAge?: number;
  gatewayCpuUsage?: number;
  gatewayRamUsage?: number;
  gatewayTemperature?: number;
  activePowerSource?: number;
  powerSourcePriority?: number;
  hybridModeEnabled?: boolean;
  gensetVoltageL1?: number;
  gensetVoltageL2?: number;
  gensetVoltageL3?: number;
  gensetCurrentL1?: number;
  gensetCurrentL2?: number;
  gensetCurrentL3?: number;
  gensetFrequency?: number;
  gensetBatteryVoltage?: number;
  gensetFuelConsumptionRate?: number;
  gensetNextServiceHours?: number;
  fuelTankCapacity?: number;
  fuelSensorStatus?: number;
  fuelConsumptionRate?: number;
  fuelRuntimeRemaining?: number;
  batterySoc?: number;
  batteryCycleCount?: number;
  batteryTotalDischargeTimes?: number;
  batteryTotalDischargeEnergyWh?: number;
  batteryMaxCellVoltageMv?: number;
  batteryMinCellVoltageMv?: number;
  batteryMaxCellTemp?: number;
  batteryStatusExtended?: number;
  batteryContactorStatus?: number;
  rectifierFaultCount?: number;
  rectifierCapacityTotalW?: number;
  rectifierCapacityUsedPercent?: number;
  rectifierEfficiency?: number;
  rectifierRedundancyStatus?: number;
  rectifierHighestLoadModulePercent?: number;
  dcLvd1Status?: number;
  dcLvd2Status?: number;
  dcFuseAlarmBitmap?: number;
  dcBranchAlarmBitmap?: number;
  dcCriticalLoadCurrent?: number;
  dcNoncriticalLoadCurrent?: number;
  batteryLvdStatus?: number;
  solarTotalEnergyLifetimeWh?: number;
  solarControllerFaultCount?: number;
  solarBatteryChargeCurrent?: number;
  solarMpptStatus?: number;
  solarDailyPeakPowerW?: number;
  solarPanelStringAlarmBitmap?: number;
  rectifier1OutputCurrent?: number;
  rectifier2OutputCurrent?: number;
  rectifier3OutputCurrent?: number;
  rectifier4OutputCurrent?: number;
  alarm4Code?: number;
  alarm4Level?: number | null;
  alarm5Code?: number;
  alarm5Level?: number | null;
  alarm6Code?: number;
  alarm6Level?: number | null;
  extMainL1Voltage?: number;
  extMainL2Voltage?: number;
  extMainL3Voltage?: number;
  extMainL1Current?: number;
  extMainL2Current?: number;
  extMainL3Current?: number;
  extMainFrequency?: number;
  extMainTotalPowerW?: number;
  extMainTotalEnergyWh?: number;
  extGensetL1Voltage?: number;
  extGensetL2Voltage?: number;
  extGensetL3Voltage?: number;
  extGensetL1Current?: number;
  extGensetL2Current?: number;
  extGensetL3Current?: number;
  extGensetFrequency?: number;
  extGensetTotalPowerW?: number;
  extGensetTotalEnergyWh?: number;
  futureReservedBuffer?: string;
  extensionCrc16?: number;
  isCrcValid: boolean;
  isExtensionCrcValid?: boolean;
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
  siteIdHash?: number;
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
  deviceUptime?: number;
  signalStrength?: number;
  networkType?: string;
  simStatus?: string;
  dataValidityBitmap?: number;
  lastSuccessfulPollAge?: number;
  gatewayCpuUsage?: number;
  gatewayRamUsage?: number;
  gatewayTemperature?: number;
  activePowerSource?: string;
  powerSourcePriority?: number;
  hybridModeEnabled?: boolean;
  gensetVoltageL1?: number;
  gensetVoltageL2?: number;
  gensetVoltageL3?: number;
  gensetCurrentL1?: number;
  gensetCurrentL2?: number;
  gensetCurrentL3?: number;
  gensetFrequency?: number;
  gensetBatteryVoltage?: number;
  gensetFuelConsumptionRate?: number;
  gensetNextServiceHours?: number;
  fuelTankCapacity?: number;
  fuelSensorStatus?: string;
  fuelConsumptionRate?: number;
  fuelRuntimeRemaining?: number;
  batterySoc?: number;
  batteryCycleCount?: number;
  batteryTotalDischargeTimes?: number;
  batteryTotalDischargeEnergyWh?: number;
  batteryMaxCellVoltageMv?: number;
  batteryMinCellVoltageMv?: number;
  batteryMaxCellTemp?: number;
  batteryStatusExtended?: number;
  batteryContactorStatus?: string;
  rectifierFaultCount?: number;
  rectifierCapacityTotalW?: number;
  rectifierCapacityUsedPercent?: number;
  rectifierEfficiency?: number;
  rectifierRedundancyStatus?: string;
  rectifierHighestLoadModulePercent?: number;
  dcLvd1Status?: string;
  dcLvd2Status?: string;
  dcFuseAlarmBitmap?: number;
  dcBranchAlarmBitmap?: number;
  dcCriticalLoadCurrent?: number;
  dcNoncriticalLoadCurrent?: number;
  batteryLvdStatus?: string;
  solarTotalEnergyLifetimeWh?: number;
  solarControllerFaultCount?: number;
  solarBatteryChargeCurrent?: number;
  solarMpptStatus?: string;
  solarDailyPeakPowerW?: number;
  solarPanelStringAlarmBitmap?: number;
  rectifier1OutputCurrent?: number;
  rectifier2OutputCurrent?: number;
  rectifier3OutputCurrent?: number;
  rectifier4OutputCurrent?: number;
  alarm4Code?: string;
  alarm4Level?: string;
  alarm5Code?: string;
  alarm5Level?: string;
  alarm6Code?: string;
  alarm6Level?: string;
  extMainL1Voltage?: number;
  extMainL2Voltage?: number;
  extMainL3Voltage?: number;
  extMainL1Current?: number;
  extMainL2Current?: number;
  extMainL3Current?: number;
  extMainFrequency?: number;
  extMainTotalPowerW?: number;
  extMainTotalEnergyWh?: number;
  extGensetL1Voltage?: number;
  extGensetL2Voltage?: number;
  extGensetL3Voltage?: number;
  extGensetL1Current?: number;
  extGensetL2Current?: number;
  extGensetL3Current?: number;
  extGensetFrequency?: number;
  extGensetTotalPowerW?: number;
  extGensetTotalEnergyWh?: number;
  futureReservedBuffer?: string;
  extensionCrc16?: number;
  isCrcValid: boolean;
  isExtensionCrcValid?: boolean;
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

export interface RawVisionDecodedPayload {
  deviceId: number;
  topic: string;
  receivedAt: string;
  packetSignature: number;
  protocolVersion: number;
  messageType: number;
  headerLength: number;
  flags: number;
  packetSequence: number;
  timestampUtc: number;
  siteIdHash: number;
  edgeDeviceIdHash: number;
  messageIdHash: number;
  eventIdHash: number;
  cameraId: number;
  eventType: number;
  severity: number;
  confidenceRaw: number;
  activityZone: number;
  objectCount: number;
  ehsCodeCount: number;
  ehsCodes: number[];
  snapshotReasonCode: number;
  activeCameraCount: number;
  configuredCameraCount: number;
  detectionEnabled: number;
  systemStatus: number;
  heartbeatIntervalSec: number;
  edgeUptimeSec: number;
  cpuUsagePercent: number;
  ramUsagePercent: number;
  diskFreePercent: number;
  cameraStatusBitmap: number;
  modelId: number;
  imageFormat: number;
  imageEncoding: number;
  imageWidth: number;
  imageHeight: number;
  imageSizeBytes: number;
  imageCrc32: number;
  headerCrc16: number;
  isHeaderCrcValid: boolean;
  isImageCrcValid: boolean;
  image: string | null;
  [key: string]: unknown;
}

export interface VisionDecodedPayload extends RawVisionDecodedPayload {
  packetSignatureHex: string;
  timestampUtcIso: string;
  topicTenantId?: string;
  topicSiteId?: string;
  topicEdgeDeviceId?: string;
  messageTypeLabel: string;
  eventTypeLabel: string;
  severityLabel: string;
  confidence: number;
  activityZoneLabel: string;
  ehsCodeLabels: string[];
  snapshotReasonLabel: string;
  detectionEnabledLabel: string;
  systemStatusLabel: string;
  cameraStatusBitmapHex: string;
  onlineCameras: number[];
  imageFormatLabel: string;
  imageEncodingLabel: string;
  hasImage: boolean;
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

export const NETWORK_TYPE_LABELS: Record<number, string> = {
  0: 'Unknown',
  1: 'Ethernet',
  2: '2G',
  3: '3G',
  4: '4G',
  5: '5G',
  6: 'Wi-Fi'
};

export const SIM_STATUS_LABELS: Record<number, string> = {
  0: 'Unknown',
  1: 'Missing',
  2: 'Registered',
  3: 'Roaming',
  4: 'No Service',
  5: 'PIN Locked'
};

export const ACTIVE_POWER_SOURCE_LABELS: Record<number, string> = {
  0: 'Unknown',
  1: 'Mains',
  2: 'Generator',
  3: 'Solar',
  4: 'Battery',
  5: 'Hybrid'
};

export const FUEL_SENSOR_STATUS_LABELS: Record<number, string> = {
  0: 'Unknown',
  1: 'Normal',
  2: 'Disconnected',
  3: 'Invalid',
  4: 'Stuck'
};

export const BATTERY_CONTACTOR_STATUS_LABELS: Record<number, string> = {
  0: 'Unknown',
  1: 'Open/Disconnected',
  2: 'Closed/Connected',
  3: 'Fault'
};

export const RECTIFIER_REDUNDANCY_STATUS_LABELS: Record<number, string> = {
  0: 'Unknown',
  1: 'N+1 Available',
  2: 'No Redundancy',
  3: 'Overloaded',
  4: 'Fault'
};

export const DISCONNECT_STATUS_LABELS: Record<number, string> = {
  0: 'Unknown',
  1: 'Connected',
  2: 'Disconnected',
  3: 'Fault'
};

export const SOLAR_MPPT_STATUS_LABELS: Record<number, string> = {
  0: 'Unknown',
  1: 'Normal',
  2: 'Fault',
  3: 'Limited',
  4: 'Offline'
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

export const VISION_MESSAGE_TYPE_LABELS: Record<number, string> = {
  1: 'Alert Snapshot',
  2: 'Heartbeat'
};

export const VISION_EVENT_TYPE_LABELS: Record<number, string> = {
  0: 'Helmet Violation',
  1: 'Vest Violation',
  2: 'Restricted Zone Violation',
  3: 'Team Activity',
  4: 'Intruder Detection',
  5: 'Crowd On Site',
  6: 'EHS Compliant',
  7: 'EHS Violation',
  8: 'Other Alert',
  255: 'None'
};

export const VISION_SEVERITY_LABELS: Record<number, string> = {
  0: 'Info',
  1: 'Warning',
  2: 'Major',
  3: 'Critical'
};

export const VISION_ACTIVITY_ZONE_LABELS: Record<number, string> = {
  0: 'Unknown',
  1: 'Generator Zone',
  2: 'Rectifier Zone',
  3: 'CP Zone',
  4: 'Tower Zone',
  5: 'Main Gate',
  6: 'Fuel Zone'
};

export const VISION_EHS_CODE_LABELS: Record<number, string> = {
  0: 'Helmet Missing / Incorrect Helmet',
  1: 'Vest Missing',
  2: 'Harness Missing / Incorrect Harness',
  3: 'Chin Strap Missing / Open',
  4: 'Safety Shoes Missing',
  5: 'Gloves Missing',
  6: 'Y-Lanyard Missing / Not Connected',
  7: 'Positioning Lanyard Missing / Not Connected',
  8: 'Unsafe Height / Tower Position',
  9: 'Inside Restricted Zone',
  10: 'Other EHS Violation',
  255: 'Unused'
};

export const VISION_SNAPSHOT_REASON_LABELS: Record<number, string> = {
  0: 'None',
  1: 'Helmet',
  2: 'Vest',
  3: 'Multiple EHS',
  4: 'Restricted Zone',
  5: 'Intruder',
  6: 'Crowd',
  7: 'Team Activity',
  8: 'Compliant'
};

export const VISION_SYSTEM_STATUS_LABELS: Record<number, string> = {
  0: 'Normal',
  1: 'Degraded',
  2: 'Camera Issue',
  3: 'Detection Off',
  4: 'Communication Issue'
};

export const VISION_IMAGE_FORMAT_LABELS: Record<number, string> = {
  0: 'None',
  1: 'JPEG'
};

export const VISION_IMAGE_ENCODING_LABELS: Record<number, string> = {
  0: 'Raw Binary',
  1: 'ASCII HEX Debug'
};


function enumLabel(labels: Record<number, string>, value: number | null | undefined): string | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  return labels[value] ?? `Unknown (${value})`;
}

function alarmCodeLabel(value: number | null | undefined): string | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  return ALARM_CODE_LABELS[value] ?? `Unknown (${value})`;
}

function alarmLevelLabel(value: number | null | undefined): string | undefined {
  if (value === null || value === undefined) {
    return 'None';
  }

  return ALARM_LEVEL_LABELS[value] ?? `Unknown (${value})`;
}

function hexLabel(value: number, bytes: number): string {
  return `0x${value.toString(16).toUpperCase().padStart(bytes * 2, '0')}`;
}

function parseVisionTopic(topic: string): Pick<VisionDecodedPayload, 'topicTenantId' | 'topicSiteId' | 'topicEdgeDeviceId'> {
  const [, topicTenantId, topicSiteId, topicEdgeDeviceId] = topic.split('/');

  return {
    topicTenantId,
    topicSiteId,
    topicEdgeDeviceId
  };
}

function onlineCamerasFromBitmap(bitmap: number): number[] {
  const cameras: number[] = [];

  for (let bit = 0; bit < 16; bit++) {
    if ((bitmap & (1 << bit)) !== 0) {
      cameras.push(bit + 1);
    }
  }

  return cameras;
}

export function mapVisionDecodedPayload(raw: RawVisionDecodedPayload): VisionDecodedPayload {
  const ehsCodes = (raw.ehsCodes ?? [])
    .slice(0, raw.ehsCodeCount)
    .filter((code) => code !== 255);

  return {
    ...raw,
    ...parseVisionTopic(raw.topic),
    packetSignatureHex: hexLabel(raw.packetSignature, 2),
    timestampUtcIso: new Date(raw.timestampUtc * 1000).toISOString(),
    messageTypeLabel: enumLabel(VISION_MESSAGE_TYPE_LABELS, raw.messageType) ?? `Unknown (${raw.messageType})`,
    eventTypeLabel: enumLabel(VISION_EVENT_TYPE_LABELS, raw.eventType) ?? `Unknown (${raw.eventType})`,
    severityLabel: enumLabel(VISION_SEVERITY_LABELS, raw.severity) ?? `Unknown (${raw.severity})`,
    confidence: raw.confidenceRaw / 1000,
    activityZoneLabel: enumLabel(VISION_ACTIVITY_ZONE_LABELS, raw.activityZone) ?? `Unknown (${raw.activityZone})`,
    ehsCodeLabels: ehsCodes.map((code) => enumLabel(VISION_EHS_CODE_LABELS, code) ?? `Unknown (${code})`),
    snapshotReasonLabel: enumLabel(VISION_SNAPSHOT_REASON_LABELS, raw.snapshotReasonCode) ?? `Unknown (${raw.snapshotReasonCode})`,
    detectionEnabledLabel: raw.detectionEnabled === 1 ? 'On' : 'Off',
    systemStatusLabel: enumLabel(VISION_SYSTEM_STATUS_LABELS, raw.systemStatus) ?? `Unknown (${raw.systemStatus})`,
    cameraStatusBitmapHex: hexLabel(raw.cameraStatusBitmap, 2),
    onlineCameras: onlineCamerasFromBitmap(raw.cameraStatusBitmap),
    imageFormatLabel: enumLabel(VISION_IMAGE_FORMAT_LABELS, raw.imageFormat) ?? `Unknown (${raw.imageFormat})`,
    imageEncodingLabel: enumLabel(VISION_IMAGE_ENCODING_LABELS, raw.imageEncoding) ?? `Unknown (${raw.imageEncoding})`,
    hasImage: (raw.flags & 1) === 1 || raw.imageSizeBytes > 0 || raw.image !== null
  };
}

export function mapDecodedPayload(raw:RawDecodedPayload): DecodedPayload {
  return {
    ...raw,
    deviceType: DEVICE_TYPE_LABELS[raw.deviceType] ?? `Unknown (${raw.deviceType})`,
    manufacturer: MANUFACTURER_LABELS[raw.manufacturer] ?? `Unknown (${raw.manufacturer})`,
    model: MODEL_LABELS[raw.model] ?? `Unknown (${raw.model})`,
    systemStatus: raw.systemStatus,
    batteryStatus: BATTERY_STATUS_LABELS[raw.batteryStatus] ?? `Unknown (${raw.batteryStatus})`,
    gensetControlMode: GENSET_CONTROL_MODE_LABELS[raw.gensetControlMode] ?? `Unknown (${raw.gensetControlMode})`,
    networkType: enumLabel(NETWORK_TYPE_LABELS, raw.networkType),
    simStatus: enumLabel(SIM_STATUS_LABELS, raw.simStatus),
    activePowerSource: enumLabel(ACTIVE_POWER_SOURCE_LABELS, raw.activePowerSource),
    fuelSensorStatus: enumLabel(FUEL_SENSOR_STATUS_LABELS, raw.fuelSensorStatus),
    batteryContactorStatus: enumLabel(BATTERY_CONTACTOR_STATUS_LABELS, raw.batteryContactorStatus),
    rectifierRedundancyStatus: enumLabel(RECTIFIER_REDUNDANCY_STATUS_LABELS, raw.rectifierRedundancyStatus),
    dcLvd1Status: enumLabel(DISCONNECT_STATUS_LABELS, raw.dcLvd1Status),
    dcLvd2Status: enumLabel(DISCONNECT_STATUS_LABELS, raw.dcLvd2Status),
    batteryLvdStatus: enumLabel(DISCONNECT_STATUS_LABELS, raw.batteryLvdStatus),
    solarMpptStatus: enumLabel(SOLAR_MPPT_STATUS_LABELS, raw.solarMpptStatus),
    alarm1Code: alarmCodeLabel(raw.alarm1Code) ?? 'No alarm in this slot',
    alarm2Code: alarmCodeLabel(raw.alarm2Code) ?? 'No alarm in this slot',
    alarm3Code: alarmCodeLabel(raw.alarm3Code) ?? 'No alarm in this slot',
    alarm4Code: alarmCodeLabel(raw.alarm4Code),
    alarm5Code: alarmCodeLabel(raw.alarm5Code),
    alarm6Code: alarmCodeLabel(raw.alarm6Code),
    alarm1Level: alarmLevelLabel(raw.alarm1Level) ?? 'None',
    alarm2Level: alarmLevelLabel(raw.alarm2Level) ?? 'None',
    alarm3Level: alarmLevelLabel(raw.alarm3Level) ?? 'None',
    alarm4Level: alarmLevelLabel(raw.alarm4Level),
    alarm5Level: alarmLevelLabel(raw.alarm5Level),
    alarm6Level: alarmLevelLabel(raw.alarm6Level),
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
