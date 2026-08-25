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
  viewerConnectionId?: string;
  payload?: CameraSignalPayload;
}

interface CameraStreamCallbacks {
  onTrack?: () => void;
  onWaiting?: () => void;
}

interface CameraStreamSession {
  deviceId: number;
  cameraIndex: number;
  connection: signalR.HubConnection;
  peer: RTCPeerConnection | null;
  video: HTMLVideoElement;
  callbacks: CameraStreamCallbacks;
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
    onTrack?: () => void,
    onWaiting?: () => void
  ): Promise<void> {
    await this.stop(deviceId, cameraIndex);

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(environment.cameraStreamHubUrl, {
        accessTokenFactory: () => this.authService.getAccessToken() ?? ''
      })
      .withAutomaticReconnect()
      .build();

    const key = this.sessionKey(deviceId, cameraIndex);
    const session: CameraStreamSession = {
      deviceId,
      cameraIndex,
      connection,
      peer: null,
      video,
      callbacks: { onTrack, onWaiting }
    };
    this.sessions.set(key, session);
    this.createPeer(session);

    connection.on('PublisherJoined', () => {
      void this.requestOffer(session);
    });
    connection.on('PublisherLeft', () => {
      this.closePeer(session, true);
      this.createPeer(session);
    });
    connection.on('CameraSignal', (message: CameraSignalMessage) => {
      void this.handleSignal(session, message);
    });
    connection.onreconnected(() => {
      void this.joinViewer(session);
    });

    try {
      await connection.start();
      await this.joinViewer(session);
    } catch (error) {
      this.sessions.delete(key);
      this.closePeer(session, false);
      await connection.stop().catch(() => undefined);
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
    this.closePeer(session, false);

    try {
      if (session.connection.state === signalR.HubConnectionState.Connected) {
        await session.connection.invoke('StopStream', deviceId);
      }
    } catch {
      // Hub may already have dropped the connection.
    } finally {
      await session.connection.stop();
    }
  }

  async stopAll(): Promise<void> {
    const sessions = [...this.sessions.values()];
    await Promise.all(sessions.map((session) => this.stop(session.deviceId, session.cameraIndex)));
  }

  private async joinViewer(session: CameraStreamSession): Promise<void> {
    await session.connection.invoke('StartViewer', session.deviceId, session.cameraIndex);
  }

  private async requestOffer(session: CameraStreamSession): Promise<void> {
    if (session.connection.state !== signalR.HubConnectionState.Connected) {
      return;
    }

    await session.connection.invoke('RequestOffer', session.deviceId, session.cameraIndex);
  }

  private createPeer(session: CameraStreamSession): void {
    const peer = new RTCPeerConnection({ iceServers: this.iceServers });
    session.peer = peer;

    peer.ontrack = (event) => {
      this.zone.run(() => {
        session.video.srcObject = event.streams[0] ?? new MediaStream([event.track]);
        void session.video.play().catch(() => undefined);
        session.callbacks.onTrack?.();
      });
    };

    peer.onicecandidate = (event) => {
      if (!event.candidate) {
        return;
      }

      void this.sendSignal(session, {
        type: 'ice',
        candidate: event.candidate.toJSON()
      });
    };
  }

  private closePeer(session: CameraStreamSession, notifyWaiting: boolean): void {
    session.peer?.close();
    session.peer = null;
    session.video.srcObject = null;

    if (notifyWaiting) {
      this.zone.run(() => session.callbacks.onWaiting?.());
    }
  }

  private async handleSignal(session: CameraStreamSession, message: CameraSignalMessage): Promise<void> {
    if (Number(message.cameraIndex) !== session.cameraIndex) {
      return;
    }

    const peer = session.peer;
    const payload = message.payload;
    if (!peer || !payload) {
      return;
    }

    try {
      if (payload.type === 'offer' && payload.sdp) {
        await peer.setRemoteDescription({ type: 'offer', sdp: payload.sdp });
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        await this.sendSignal(session, { type: 'answer', sdp: answer.sdp });
        return;
      }

      if (payload.type === 'ice' && payload.candidate) {
        await peer.addIceCandidate(payload.candidate);
      }
    } catch (error) {
      console.error('[CameraStream] Failed to handle signal', error);
    }
  }

  private async sendSignal(session: CameraStreamSession, payload: CameraSignalPayload): Promise<void> {
    const connectionId = session.connection.connectionId;
    if (!connectionId || session.connection.state !== signalR.HubConnectionState.Connected) {
      return;
    }

    await session.connection.invoke(
      'Signal',
      session.deviceId,
      session.cameraIndex,
      connectionId,
      payload
    );
  }

  private sessionKey(deviceId: number, cameraIndex: number): string {
    return `${deviceId}:${cameraIndex}`;
  }
}
