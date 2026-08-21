import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GraphFetchOptions, GraphRequestPayload, GraphResponse } from '../constants/graph.types';

interface CacheEntry {
  expiry: number;
  stream$: Observable<GraphResponse>;
}

export interface AiVisionPacketApiModel {
  id: number;
  deviceNumber?: number;
  topic: string;
  receivedAtUtc?: string;
  packetSignature: number;
  protocolVersion?: number;
  packetVersion?: number;
  messageType: number;
  headerLength?: number;
  flags?: number;
  packetSequence?: number;
  timestampUtc: number;
  siteIdHash?: number;
  edgeDeviceIdHash?: number;
  messageIdHash: number;
  eventIdHash: number;
  cameraId: number;
  eventType: number;
  severity: number;
  confidence?: number;
  confidenceRaw?: number;
  activityZone: number;
  objectCount: number;
  ehsCodeCount: number;
  ehsCodes: number[] | string;
  snapshotReasonCode: number;
  activeCameraCount?: number;
  configuredCameraCount?: number;
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
  imageWidth?: number;
  imageHeight?: number;
  imageSizeBytes?: number;
  imageCrc32: number;
  headerCrc16?: number;
  isHeaderCrcValid?: boolean;
  isImageCrcValid: boolean;
  hasImage?: boolean;
  imageBase64?: string | null;
  image?: unknown;
  [key: string]: unknown;
}

type ApiEnvelope<T> = T | { data?: T } | { items?: T };

@Injectable({
  providedIn: 'root'
})
export class VisionService {
  private readonly baseUrl = environment.baseUrl;
  private readonly url = '/AiVision';

  constructor(private http: HttpClient) {}

  getAiVisionData(id: number, timeSpan: '1d' | '1w' | '1m' = '1d'): Observable<AiVisionPacketApiModel[]> {
    return this.http
      .get<ApiEnvelope<AiVisionPacketApiModel[]>>(`${this.baseUrl}${this.url}/device/${id}/history`, {
        params: {
          messageType: 1,
          timeSpan,
        }
      })
      .pipe(
        map((response) => this.unwrapArray(response)),
        shareReplay(1)
      );
  }

  getVisionPacketDetails(id: number): Observable<string | null> {
    return this.http
      .get<{ data?: unknown }>(`${this.baseUrl}${this.url}/packet/${id}/vision-packet-details`)
      .pipe(map((response) => this.unwrapImage(response)));
  }

  private unwrapImage(payload: { data?: unknown } | string | null | undefined): string | null {
    if (typeof payload === 'string') {
      const value = payload.trim();
      return value || null;
    }

    if (!payload || typeof payload !== 'object') {
      return null;
    }

    const data = payload.data;
    return typeof data === 'string' && data.trim() ? data.trim() : null;
  }

  private unwrapArray(payload: ApiEnvelope<AiVisionPacketApiModel[]>): AiVisionPacketApiModel[] {
    if (Array.isArray(payload)) {
      return payload;
    }

    if (payload && typeof payload === 'object') {
      const response = payload as { data?: unknown; items?: unknown };

      if (Array.isArray(response.data)) {
        return response.data as AiVisionPacketApiModel[];
      }

      if (Array.isArray(response.items)) {
        return response.items as AiVisionPacketApiModel[];
      }
    }

    return [];
  }
}
