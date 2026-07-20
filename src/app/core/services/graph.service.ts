import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GraphFetchOptions, GraphRequestPayload, GraphResponse } from '../constants/graph.types';

interface CacheEntry {
  expiry: number;
  stream$: Observable<GraphResponse>;
}

@Injectable({
  providedIn: 'root'
})
export class GraphService {
  private readonly cache = new Map<string, CacheEntry>();
  private readonly cacheTtlMs = 60_000;
  private readonly baseUrl = environment.baseUrl;
  private readonly graphsBasePath = '/statistic/graphs';

  constructor(private readonly http: HttpClient) {}

  clearCache(): void {
    this.cache.clear();
  }

  getSiteTotalLoad(payload: GraphRequestPayload, options?: GraphFetchOptions): Observable<GraphResponse> {
    return this.postGraph('/site-total-load', payload, options);
  }

  getGridVoltage(payload: GraphRequestPayload, options?: GraphFetchOptions): Observable<GraphResponse> {
    return this.postGraph('/grid-voltage', payload, options);
  }

  getTenantLoadTrends(payload: GraphRequestPayload, options?: GraphFetchOptions): Observable<GraphResponse> {
    return this.postGraph('/tenant-load-trends', payload, options);
  }

  getBatterySoc(payload: GraphRequestPayload, options?: GraphFetchOptions): Observable<GraphResponse> {
    return this.postGraph('/battery-soc', payload, options);
  }

  getSolarYield(payload: GraphRequestPayload, options?: GraphFetchOptions): Observable<GraphResponse> {
    return this.postGraph('/solar-yield', payload, options);
  }

  private postGraph(
    endpoint: '/site-total-load' | '/grid-voltage' | '/tenant-load-trends' | '/battery-soc' | '/solar-yield',
    payload: GraphRequestPayload,
    options?: GraphFetchOptions,
  ): Observable<GraphResponse> {
    const normalizedPayload = this.normalizePayload(payload, endpoint);
    const cacheKey = `${endpoint}:${JSON.stringify(normalizedPayload)}`;
    const now = Date.now();
    const cached = this.cache.get(cacheKey);
    const shouldBypassCache = options?.forceRefresh === true;

    if (!shouldBypassCache && cached && cached.expiry > now) {
      return cached.stream$;
    }

    const request$ = this.http
      .post<GraphResponse>(`${this.baseUrl}${this.graphsBasePath}${endpoint}`, normalizedPayload)
      .pipe(shareReplay({ bufferSize: 1, refCount: false }));

    this.cache.set(cacheKey, {
      expiry: now + this.cacheTtlMs,
      stream$: request$,
    });

    return request$;
  }

  private normalizePayload(
    payload: GraphRequestPayload,
    endpoint: '/site-total-load' | '/grid-voltage' | '/tenant-load-trends' | '/battery-soc' | '/solar-yield',
  ): GraphRequestPayload {
    const normalized: GraphRequestPayload = {
      timeframe: payload.timeframe,
    };

    if (payload.toUtc) {
      normalized.toUtc = payload.toUtc;
    }

    if (typeof payload.deviceId === 'number') {
      normalized.deviceId = payload.deviceId;
    }

    if (typeof payload.tenantId === 'number') {
      if (endpoint === '/tenant-load-trends') {
        if (payload.tenantId >= 1 && payload.tenantId <= 4) {
          normalized.tenantId = payload.tenantId;
        }
      } else {
        normalized.tenantId = payload.tenantId;
      }
    }

    return normalized;
  }
}
