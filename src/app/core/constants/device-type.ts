export enum DeviceType {
  Normal = 'Normal',
  VIP = 'VIP',
  Platinum = 'Platinum',
}

export interface DeviceTypeOption {
  label: string;
  value: DeviceType;
}

export const DEVICE_TYPE_OPTIONS: DeviceTypeOption[] = [
  { label: 'Normal', value: DeviceType.Normal },
  { label: 'VIP', value: DeviceType.VIP },
  { label: 'Platinum', value: DeviceType.Platinum },
];
