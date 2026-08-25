import { Injectable, NgZone } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

interface CameraSignalPayload {
  type?: string;
  sdp?: string;
  candidate?: RTCIceCandidateInit;
}

interface CameraSignalMessage {
  deviceId?: number;
  cameraIndex?: number;
  sessionId?: string;
  payload?: CameraSignalPayload;
}

interface CameraStreamSession {
  deviceId: number;
  cameraIndex: number;
  sessionId: string;
  connection: signalR.HubConnection;
  peer: RTCPeerConnection;
  video: HTMLVideoElement;
}

@Injectable({ providedIn: 'root' })
export class CameraStreamService {
  private readonly iceServers: RTCIceServer[] = [{ urls: 'stun:stun.l.google.com:19302' }];
  private readonly sessions = new Map<string, CameraStreamSession>();

  constructor(
    private authService: AuthService,
    private zone: NgZone
  ) {}

  async start(
    deviceId: number,
    cameraIndex: number,
    video: HTMLVideoElement,
    onTrack?: () => void
  ): Promise<void> {
    await this.stop(deviceId, cameraIndex);

    const sessionId = crypto.randomUUID();
    const peer = new RTCPeerConnection({ iceServers: this.iceServers });
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(environment.cameraStreamHubUrl, {
        accessTokenFactory: () => this.authService.getAccessToken() ?? ''
      })
      .withAutomaticReconnect()
      .build();

    const session: CameraStreamSession = {
      deviceId,
      cameraIndex,
      sessionId,
      connection,
      peer,
      video
    };
    console.log('session', session);
    const key = this.sessionKey(deviceId, cameraIndex);
    this.sessions.set(key, session);

    peer.ontrack = (event) => {
      this.zone.run(() => {
        video.srcObject = event.streams[0] ?? new MediaStream([event.track]);
        void video.play().catch(() => undefined);
        onTrack?.();
      });
    };

    connection.on('CameraSignal', (message: CameraSignalMessage) => {
      void this.handleSignal(key, message);
    });

    peer.onicecandidate = (event) => {
      if (!event.candidate || connection.state !== signalR.HubConnectionState.Connected) {
        return;
      }

      void connection.invoke('Signal', deviceId, cameraIndex, sessionId, {
        type: 'ice',
        candidate: event.candidate.toJSON()
      });
    };

    try {
      await connection.start();
      await connection.invoke('StartStream', deviceId, cameraIndex);
    } catch (error) {
      this.sessions.delete(key);
      session.peer.close();
      await session.connection.stop().catch(() => undefined);
      throw error;
    }
  }

  async stop(deviceId: number, cameraIndex: number): Promise<void> {
    const key = this.sessionKey(deviceId, cameraIndex);
    const session = this.sessions.get(key);
    if (!session) {
      return;
    }

    this.sessions.delete(key);
    session.video.srcObject = null;
    session.peer.close();

    try {
      if (session.connection.state === signalR.HubConnectionState.Connected) {
        await session.connection.invoke('StopStream', deviceId);
      }
    } finally {
      await session.connection.stop();
    }
  }

  async stopAll(): Promise<void> {
    const sessions = [...this.sessions.values()];
    await Promise.all(sessions.map((session) => this.stop(session.deviceId, session.cameraIndex)));
  }

  private async handleSignal(key: string, message: CameraSignalMessage): Promise<void> {
    const session = this.sessions.get(key);
    if (!session || Number(message.cameraIndex) !== session.cameraIndex) {
      return;
    }

    const payload = message.payload;
    if (!payload) {
      return;
    }

    try {
      if (payload.type === 'offer' && payload.sdp) {
        await session.peer.setRemoteDescription({ type: 'offer', sdp: payload.sdp });
        const answer = await session.peer.createAnswer();
        await session.peer.setLocalDescription(answer);
        await session.connection.invoke('Signal', session.deviceId, session.cameraIndex, session.sessionId, {
          type: 'answer',
          sdp: answer.sdp
        });
        return;
      }

      if (payload.type === 'ice' && payload.candidate) {
        await session.peer.addIceCandidate(payload.candidate);
      }
    } catch (error) {
      console.error('[CameraStream] Failed to handle signal', error);
    }
  }

  private sessionKey(deviceId: number, cameraIndex: number): string {
    return `${deviceId}:${cameraIndex}`;
  }
}
