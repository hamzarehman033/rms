export enum DeviceType {
  Normal = 'Normal',
  VIP = 'VIP',
  Platinum = 'Platinum',
  Guarded = 'Guarded',
  Unguarded = 'Unguarded',
  Supervised = 'Supervised',
  ClusterSite = 'Cluster Site',
}

export interface DeviceTypeOption {
  label: string;
  value: DeviceType;
}

export const DEVICE_TYPE_OPTIONS: DeviceTypeOption[] = [
  { label: 'Normal', value: DeviceType.Normal },
  { label: 'VIP', value: DeviceType.VIP },
  { label: 'Platinum', value: DeviceType.Platinum },
  { label: 'Guarded', value: DeviceType.Guarded },
  { label: 'Unguarded', value: DeviceType.Unguarded },
  { label: 'Supervised', value: DeviceType.Supervised },
  { label: 'Cluster Site', value: DeviceType.ClusterSite },
];
