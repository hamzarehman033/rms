import { Injectable, NgZone } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

interface CameraSignalPayload {
  type?: string;
  sdp?: string;
  candidate?: RTCIceCandidateInit;
  message?: string;
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
  onAudioStateChanged?: (enabled: boolean) => void;
  onAudioError?: (message: string) => void;
}

interface AudioRequest {
  resolve: () => void;
  reject: (error: Error) => void;
  timeout: ReturnType<typeof setTimeout>;
}

interface CameraStreamSession {
  deviceId: number;
  cameraIndex: number;
  connection: signalR.HubConnection;
  peer: RTCPeerConnection | null;
  video: HTMLVideoElement;
  audio: HTMLAudioElement;
  audioSender: RTCRtpSender | null;
  localAudioStream: MediaStream | null;
  audioRequest: AudioRequest | null;
  signalQueue: Promise<void>;
  pendingIce: RTCIceCandidateInit[];
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
    audio: HTMLAudioElement,
    onTrack?: () => void,
    onWaiting?: () => void,
    onAudioStateChanged?: (enabled: boolean) => void,
    onAudioError?: (message: string) => void
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
      audio,
      audioSender: null,
      localAudioStream: null,
      audioRequest: null,
      signalQueue: Promise.resolve(),
      pendingIce: [],
      callbacks: { onTrack, onWaiting, onAudioStateChanged, onAudioError }
    };
    this.sessions.set(key, session);
    this.createPeer(session);

    connection.on('PublisherJoined', () => {
      this.closePeer(session, true);
      this.createPeer(session);
      void this.requestOffer(session).catch((error) => {
        console.error('[CameraStream] Failed to request offer', error);
      });
    });
    connection.on('PublisherLeft', () => {
      this.closePeer(session, true);
      this.createPeer(session);
    });
    connection.on('CameraSignal', (message: CameraSignalMessage) => {
      void this.handleSignal(session, message);
    });
    connection.onreconnected(() => {
      this.closePeer(session, true);
      this.createPeer(session);
      void this.joinViewer(session).catch((error) => {
        console.error('[CameraStream] Failed to rejoin viewer', error);
      });
    });

    try {
      await connection.start();
      await this.joinViewer(session);
      console.log('[CameraStream] Started', {
        deviceId,
        cameraIndex,
        viewerConnectionId: connection.connectionId,
        hubUrl: environment.cameraStreamHubUrl,
        connectionState: connection.state
      });
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
    await this.disconnectAudio(session).catch(() => undefined);
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

  async setAudioEnabled(deviceId: number, cameraIndex: number, enabled: boolean): Promise<void> {
    const key = this.sessionKey(deviceId, cameraIndex);
    const session = this.sessions.get(key);
    if (!session) {
      throw new Error('Start the camera stream before connecting audio');
    }

    if (!enabled) {
      await this.disconnectAudio(session);
      return;
    }

    if (session.localAudioStream) {
      return;
    }

    const peer = session.peer;
    const sender = session.audioSender;
    if (!peer || !sender) {
      throw new Error('Audio channel is not ready. Wait for the stream, then try again.');
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Microphone access requires HTTPS or localhost and a supported browser');
    }

    session.audio.muted = false;
    this.playAudio(session);
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    } catch (error) {
      if (session.peer === peer) {
        session.audio.muted = true;
      }
      throw error;
    }
    const track = stream.getAudioTracks()[0];
    if (!track) {
      stream.getTracks().forEach((localTrack) => localTrack.stop());
      session.audio.muted = true;
      throw new Error('No microphone track is available');
    }

    if (this.sessions.get(key) !== session || session.peer !== peer) {
      stream.getTracks().forEach((localTrack) => localTrack.stop());
      throw new Error('Camera stream is no longer active');
    }

    session.localAudioStream = stream;
    try {
      await sender.replaceTrack(track);
      if (this.sessions.get(key) !== session || session.peer !== peer) {
        throw new Error('Camera stream is no longer active');
      }
      const ready = new Promise<void>((resolve, reject) => {
        session.audioRequest = {
          resolve,
          reject,
          timeout: setTimeout(() => {
            this.finishAudioRequest(session, new Error('Publisher did not start audio. Check its microphone permissions and retry.'));
          }, 60000)
        };
      });
      await Promise.all([ready, this.sendSignal(session, { type: 'audio-start' })]);
      if (this.sessions.get(key) !== session || session.peer !== peer || session.localAudioStream !== stream) {
        throw new Error('Camera stream is no longer active');
      }
      this.zone.run(() => session.callbacks.onAudioStateChanged?.(true));
    } catch (error) {
      if (session.peer === peer) {
        this.finishAudioRequest(session, error instanceof Error ? error : new Error('Failed to start camera audio'));
      }
      await sender.replaceTrack(null).catch((cleanupError) => {
        console.error('[CameraStream] Failed to detach microphone', cleanupError);
      });
      stream.getTracks().forEach((localTrack) => localTrack.stop());
      if (session.localAudioStream === stream) {
        session.localAudioStream = null;
        session.audio.muted = true;
      }
      throw error;
    }
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
    session.audioSender = null;
    session.signalQueue = Promise.resolve();
    session.pendingIce = [];
    session.audio.muted = true;

    peer.ontrack = (event) => {
      this.zone.run(() => {
        if (event.track.kind === 'audio') {
          session.audio.srcObject = new MediaStream([event.track]);
          if (session.localAudioStream) {
            this.playAudio(session);
          }
          return;
        }

        session.video.srcObject = new MediaStream([event.track]);
        void session.video.play().catch((error) => {
          console.error('[CameraStream] Video playback failed', error);
        });
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
      }).catch((error) => {
        console.error('[CameraStream] Failed to send ICE candidate', error);
      });
    };
  }

  private closePeer(session: CameraStreamSession, notifyWaiting: boolean): void {
    this.finishAudioRequest(session, new Error('Camera stream is no longer active'));
    const hadLocalAudio = !!session.localAudioStream;
    session.localAudioStream?.getTracks().forEach((track) => track.stop());
    session.localAudioStream = null;
    session.peer?.close();
    session.peer = null;
    session.audioSender = null;
    session.video.srcObject = null;
    session.audio.srcObject = null;
    session.audio.muted = true;

    if (hadLocalAudio) {
      this.zone.run(() => session.callbacks.onAudioStateChanged?.(false));
    }

    if (notifyWaiting) {
      this.zone.run(() => session.callbacks.onWaiting?.());
    }
  }

  private async disconnectAudio(session: CameraStreamSession): Promise<void> {
    this.finishAudioRequest(session, new Error('Audio was disconnected'));
    const stream = session.localAudioStream;
    session.localAudioStream = null;
    session.audio.muted = true;
    session.audio.pause();

    try {
      await session.audioSender?.replaceTrack(null);
    } finally {
      stream?.getTracks().forEach((track) => track.stop());
      if (stream) {
        session.callbacks.onAudioStateChanged?.(false);
      }
    }
  }

  private async handleSignal(session: CameraStreamSession, message: CameraSignalMessage): Promise<void> {
    if (Number(message.cameraIndex) !== session.cameraIndex ||
        (message.deviceId !== undefined && Number(message.deviceId) !== session.deviceId)) {
      return;
    }

    const peer = session.peer;
    const payload = message.payload;
    if (!peer || !payload) {
      return;
    }

    session.signalQueue = session.signalQueue.then(async () => {
      if (session.peer !== peer || peer.signalingState === 'closed') {
        return;
      }
      if (payload.type === 'audio-ready') {
        this.finishAudioRequest(session);
        return;
      }
      if (payload.type === 'audio-error') {
        this.finishAudioRequest(session, new Error(payload.message || 'Publisher could not start its microphone. Check permissions and retry.'));
        return;
      }
      if (payload.type === 'offer' && payload.sdp) {
        await peer.setRemoteDescription({ type: 'offer', sdp: payload.sdp });
        if (session.peer !== peer) {
          return;
        }
        const audio = peer.getTransceivers().find((transceiver) =>
          transceiver.receiver.track.kind === 'audio');
        if (audio) {
          audio.direction = 'sendrecv';
        }
        for (const candidate of session.pendingIce.splice(0)) {
          await peer.addIceCandidate(candidate);
        }
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        if (session.peer !== peer) {
          return;
        }
        session.audioSender = audio?.currentDirection === 'sendrecv' ? audio.sender : null;
        await this.sendSignal(session, { type: 'answer', sdp: answer.sdp });
        return;
      }

      if (payload.type === 'ice' && payload.candidate) {
        if (peer.remoteDescription) {
          await peer.addIceCandidate(payload.candidate);
        } else {
          session.pendingIce.push(payload.candidate);
        }
      }
    }).catch((error) => {
      console.error('[CameraStream] Failed to handle signal', error);
      if (session.peer === peer) {
        this.finishAudioRequest(session, new Error('Camera audio signaling failed. Reconnect the stream and retry.'));
      }
    });
    await session.signalQueue;
  }

  private finishAudioRequest(session: CameraStreamSession, error?: Error): void {
    const request = session.audioRequest;
    if (!request) {
      return;
    }
    session.audioRequest = null;
    clearTimeout(request.timeout);
    if (error) {
      request.reject(error);
    } else {
      request.resolve();
    }
  }

  private playAudio(session: CameraStreamSession): void {
    void session.audio.play().catch((error) => {
      console.error('[CameraStream] Audio playback failed', error);
      this.zone.run(() => session.callbacks.onAudioError?.(
        'Audio playback was blocked. Use the camera audio play control to hear the publisher.'
      ));
    });
  }

  private async sendSignal(session: CameraStreamSession, payload: CameraSignalPayload): Promise<void> {
    const connectionId = session.connection.connectionId;
    if (!connectionId || session.connection.state !== signalR.HubConnectionState.Connected) {
      throw new Error('Camera signaling is disconnected. Reconnect the stream and retry.');
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
