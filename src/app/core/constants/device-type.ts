export enum DeviceType {
  Normal = 'Normal',
  VIP = 'VIP',
  Platinium = 'Platinium',
}

export interface DeviceTypeOption {
  label: string;
  value: DeviceType;
}

export const DEVICE_TYPE_OPTIONS: DeviceTypeOption[] = [
  { label: 'Normal', value: DeviceType.Normal },
  { label: 'VIP', value: DeviceType.VIP },
  { label: 'Platinium', value: DeviceType.Platinium },
];
