export interface DeviceMessage {
  deviceId: number;
  topic: string;
  payload: string;
  receivedAt: Date;
}
