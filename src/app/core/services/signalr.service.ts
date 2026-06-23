import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DeviceDataEvent {
  deviceId: number;
  topic: string;
  payload: string;
  receivedAt: string;
}

@Injectable({ providedIn: 'root' })
export class SignalrService {
  private hubConnection?: signalR.HubConnection;
  private readonly subscribedDeviceIds = new Set<number>();
  private startPromise?: Promise<void>;
  private connected$ = new BehaviorSubject<boolean>(false);
  private deviceData$ = new BehaviorSubject<DeviceDataEvent | null>(null);

  isConnected$ = this.connected$.asObservable();
  onDeviceData$ = this.deviceData$.asObservable();

  constructor() {
    this.start().then(() => {
      console.log('[SignalR] Hub connection started');
    }).catch((error) => {
      console.error('[SignalR] Failed to start hub connection', error);
    });
  }

  async start(token?: string): Promise<void> {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      console.log('[SignalR] Hub already connected');
      return;
    }
    if (this.startPromise) return this.startPromise;

    console.log('[SignalR] Connecting to hub:', environment.signalrHubUrl);

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.signalrHubUrl, {
        accessTokenFactory: () => token ?? ''
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.hubConnection.onreconnecting((error) => {
      console.warn('[SignalR] Reconnecting to hub...', error);
      this.connected$.next(false);
    });
    this.hubConnection.onreconnected(async () => {
      console.log('[SignalR] Reconnected to hub');
      this.connected$.next(true);
      await this.resubscribeAll();
    });
    this.hubConnection.onclose((error) => {
      console.warn('[SignalR] Hub connection closed', error);
      this.connected$.next(false);
    });

    this.hubConnection.on('SubscribeConfirmed', (data) => {
      console.log('SubscribeConfirmed', data);
    });

    this.hubConnection.on('DeviceDataReceived', (data: DeviceDataEvent) => {
      console.log('DeviceDataReceived', data);
      this.deviceData$.next(data);
    });

    this.startPromise = this.hubConnection.start()
      .then(() => {
        console.log('[SignalR] Hub connected successfully');
        this.connected$.next(true);
      })
      .finally(() => {
        this.startPromise = undefined;
      });

    await this.startPromise;
  }

  async subscribeToDevice(deviceId: number): Promise<void> {
    if (!this.hubConnection || this.hubConnection.state !== signalR.HubConnectionState.Connected) {
      throw new Error('SignalR hub is not connected');
    }
    console.log(`[SignalR] Subscribing device ${deviceId}`);
    await this.hubConnection.invoke('SubscribeToDevice', deviceId);
    this.subscribedDeviceIds.add(deviceId);
    console.log(`[SignalR] Subscribed device ${deviceId}`);
  }

  async subscribeToDevices(deviceIds: number[]): Promise<void> {
    const uniqueIds = [...new Set(deviceIds)];
    for (const deviceId of uniqueIds) {
      await this.subscribeToDevice(deviceId);
    }
  }

  async unsubscribeFromDevice(deviceId: number): Promise<void> {
    if (!this.hubConnection || this.hubConnection.state !== signalR.HubConnectionState.Connected) return;
    console.log(`[SignalR] Unsubscribing device ${deviceId}`);
    await this.hubConnection.invoke('UnsubscribeFromDevice', deviceId);
    this.subscribedDeviceIds.delete(deviceId);
    console.log(`[SignalR] Unsubscribed device ${deviceId}`);
  }

  async unsubscribeFromDevices(deviceIds: number[]): Promise<void> {
    const uniqueIds = [...new Set(deviceIds)];
    for (const deviceId of uniqueIds) {
      await this.unsubscribeFromDevice(deviceId);
    }
  }

  async stop(): Promise<void> {
    if (!this.hubConnection) return;
    console.log('[SignalR] Stopping hub connection');
    await this.hubConnection.stop();
    this.connected$.next(false);
    this.subscribedDeviceIds.clear();
    console.log('[SignalR] Hub connection stopped');
  }

  private async resubscribeAll(): Promise<void> {
    if (!this.hubConnection || this.hubConnection.state !== signalR.HubConnectionState.Connected) return;
    for (const deviceId of this.subscribedDeviceIds) {
      console.log(`[SignalR] Resubscribing device ${deviceId}`);
      await this.hubConnection.invoke('SubscribeToDevice', deviceId);
      console.log(`[SignalR] Resubscribed device ${deviceId}`);
    }
  }
}