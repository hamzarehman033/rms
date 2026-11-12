import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceCameraPayload } from '../../../core/services/devices.service';
import { CameraStreamService } from '../../../core/services/camera-stream.service';
import { toast } from '../../../utils/global-toast';

interface LiveCamera {
  cameraIndex: number;
  name: string;
  isEnabled: boolean;
  isStreaming: boolean;
  isBusy: boolean;
  hasVideo: boolean;
  isAudioConnected: boolean;
  isAudioBusy: boolean;
}

/** Live camera grid for one device (play/stop, audio, full screen). */
@Component({
  selector: 'app-device-camera-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './device-camera-grid.component.html',
  styleUrl: './device-camera-grid.component.css'
})
export class DeviceCameraGridComponent implements OnDestroy {
  @Input() deviceId = 0;
  /** Live/Stopped badge per camera (Security). */
  @Input() showStatusBadge = false;
  /** Fill parent height (Security). */
  @Input() @HostBinding('class.fill-height') fillHeight = false;

  /** A new list (e.g. device change) stops running streams. */
  @Input() set cameras(value: DeviceCameraPayload[] | null | undefined) {
    void this.exitCameraFullscreen();
    void this.cameraStreamService.stopAll();
    this.liveCameras = this.mapLiveCameras(value);
  }

  /** Count of streaming cameras. */
  @Output() streamingCountChange = new EventEmitter<number>();

  liveCameras: LiveCamera[] = [];

  @ViewChildren('cameraVideo') private cameraVideos?: QueryList<ElementRef<HTMLVideoElement>>;
  @ViewChildren('cameraAudio') private cameraAudios?: QueryList<ElementRef<HTMLAudioElement>>;

  private fullscreenCameraIndex: number | null = null;

  constructor(private cameraStreamService: CameraStreamService) {}

  ngOnDestroy(): void {
    void this.exitCameraFullscreen();
    void this.cameraStreamService.stopAll();
  }

  @HostListener('document:fullscreenchange')
  @HostListener('document:webkitfullscreenchange')
  onFullscreenChange(): void {
    const element = this.getFullscreenElement();
    if (!element) {
      this.fullscreenCameraIndex = null;
      return;
    }

    const index = Number(element.getAttribute('data-camera-index'));
    this.fullscreenCameraIndex = Number.isFinite(index) ? index : null;
  }

  isCameraFullscreen(camera: LiveCamera): boolean {
    return this.fullscreenCameraIndex === camera.cameraIndex;
  }

  async toggleCameraFullscreen(camera: LiveCamera): Promise<void> {
    if (this.isCameraFullscreen(camera)) {
      await this.exitCameraFullscreen();
      return;
    }

    const card = this.getCameraCard(camera.cameraIndex);
    if (!card) {
      toast.error('Camera viewport is not ready');
      return;
    }

    try {
      await this.requestFullscreen(card);
      this.fullscreenCameraIndex = camera.cameraIndex;
    } catch {
      toast.error('Unable to open full screen');
    }
  }

  cameraStatusLabel(camera: LiveCamera): string {
    if (!camera.isEnabled) {
      return 'Disabled';
    }

    if (camera.isBusy) {
      return camera.isStreaming ? 'Stopping' : 'Starting';
    }

    if (camera.isStreaming) {
      return camera.hasVideo ? 'Live' : 'Waiting';
    }

    return 'Stopped';
  }

  cameraViewportLabel(camera: LiveCamera): string {
    if (!camera.isEnabled) {
      return 'Camera disabled';
    }

    if (camera.isBusy) {
      return camera.isStreaming ? 'Stopping…' : 'Starting…';
    }

    if (camera.isStreaming) {
      return camera.hasVideo ? 'Live' : 'Waiting for remote stream';
    }

    return 'Stream stopped';
  }

  async toggleCameraStream(camera: LiveCamera): Promise<void> {
    if (!this.deviceId || !camera.isEnabled || camera.isBusy) {
      return;
    }

    camera.isBusy = true;

    try {
      if (camera.isStreaming) {
        if (this.isCameraFullscreen(camera)) {
          await this.exitCameraFullscreen();
        }
        await this.cameraStreamService.stop(this.deviceId, camera.cameraIndex);
        camera.isStreaming = false;
        camera.hasVideo = false;
      } else {
        const video = this.getCameraVideo(camera.cameraIndex);
        const audio = this.getCameraAudio(camera.cameraIndex);
        if (!video || !audio) {
          throw new Error('Camera viewport is not ready');
        }

        console.log('[CameraStream] Camera', {
          deviceId: this.deviceId,
          cameraIndex: camera.cameraIndex,
          name: camera.name,
          isEnabled: camera.isEnabled
        });
        await this.cameraStreamService.start(
          this.deviceId,
          camera.cameraIndex,
          video,
          audio,
          () => { camera.hasVideo = true; },
          () => { camera.hasVideo = false; },
          (enabled) => { camera.isAudioConnected = enabled; },
          (message) => { toast.error(message); }
        );
        camera.isStreaming = true;
      }
    } catch (error: unknown) {
      camera.isStreaming = false;
      camera.hasVideo = false;
      const message = error instanceof Error ? error.message : 'Failed to update camera stream';
      toast.error(message);
    } finally {
      camera.isBusy = false;
      this.emitStreamingCount();
    }
  }

  async toggleCameraAudio(camera: LiveCamera): Promise<void> {
    if (!this.deviceId || !camera.isStreaming || camera.isBusy || camera.isAudioBusy) {
      return;
    }

    const enabled = !camera.isAudioConnected;
    camera.isAudioBusy = true;
    try {
      await this.cameraStreamService.setAudioEnabled(this.deviceId, camera.cameraIndex, enabled);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update camera audio';
      toast.error(message);
    } finally {
      camera.isAudioBusy = false;
    }
  }

  private emitStreamingCount(): void {
    this.streamingCountChange.emit(this.liveCameras.filter(camera => camera.isStreaming).length);
  }

  private mapLiveCameras(cameras: DeviceCameraPayload[] | null | undefined): LiveCamera[] {
    if (!Array.isArray(cameras)) {
      return [];
    }

    return cameras
      .slice()
      .sort((left, right) => Number(left.cameraIndex) - Number(right.cameraIndex))
      .map((camera) => ({
        cameraIndex: Number(camera.cameraIndex),
        name: camera.name?.trim() || `Camera ${camera.cameraIndex}`,
        isEnabled: camera.isEnabled !== false,
        isStreaming: false,
        isBusy: false,
        hasVideo: false,
        isAudioConnected: false,
        isAudioBusy: false,
      }));
  }

  private getCameraVideo(cameraIndex: number): HTMLVideoElement | null {
    return this.cameraVideos?.find(
      (ref) => Number(ref.nativeElement.getAttribute('data-camera-index')) === cameraIndex
    )?.nativeElement ?? null;
  }

  private getCameraAudio(cameraIndex: number): HTMLAudioElement | null {
    return this.cameraAudios?.find(
      (ref) => Number(ref.nativeElement.getAttribute('data-camera-index')) === cameraIndex
    )?.nativeElement ?? null;
  }

  private getCameraCard(cameraIndex: number): HTMLElement | null {
    return this.getCameraVideo(cameraIndex)?.closest('.camera-card') as HTMLElement | null;
  }

  private getFullscreenElement(): HTMLElement | null {
    const doc = document as Document & { webkitFullscreenElement?: Element | null };
    return (document.fullscreenElement ?? doc.webkitFullscreenElement ?? null) as HTMLElement | null;
  }

  private requestFullscreen(element: HTMLElement): Promise<void> {
    const target = element as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void> | void;
    };
    const request = element.requestFullscreen?.bind(element) ?? target.webkitRequestFullscreen?.bind(element);
    if (!request) {
      return Promise.reject(new Error('Fullscreen is not supported'));
    }
    return Promise.resolve(request());
  }

  private exitCameraFullscreen(): Promise<void> {
    const doc = document as Document & { webkitExitFullscreen?: () => Promise<void> | void };
    if (!this.getFullscreenElement()) {
      this.fullscreenCameraIndex = null;
      return Promise.resolve();
    }
    const exit = document.exitFullscreen?.bind(document) ?? doc.webkitExitFullscreen?.bind(document);
    if (!exit) {
      this.fullscreenCameraIndex = null;
      return Promise.resolve();
    }
    return Promise.resolve(exit()).then(() => {
      this.fullscreenCameraIndex = null;
    });
  }
}
