export type GraphTimeframe = '24h' | '7days' | '30days';

export interface GraphRequestPayload {
  timeframe: GraphTimeframe;
  toUtc?: string;
  deviceId?: number;
  tenantId?: number;
}

export interface GraphPoint {
  timestamp: string;
  value: number | null;
}

export interface GraphSeries {
  name: string;
  points: GraphPoint[];
}

export interface GraphResponseMeta {
  timeframe: GraphTimeframe;
  fromUtc: string;
  toUtc: string;
  bucket: string;
  filtersApplied: Record<string, string | number | boolean | null>;
}

export interface GraphResponse {
  meta: GraphResponseMeta;
  series: GraphSeries[];
}

export interface GraphFetchOptions {
  forceRefresh?: boolean;
}
