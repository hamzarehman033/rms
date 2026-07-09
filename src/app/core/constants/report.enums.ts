export enum ReportType {
  BatteryStatus = 0,
  SolarStatus = 1,
  GridStatus = 2,
  AlarmStatus = 3,
  EnergyConsumption = 4,
}

export enum ReportFileFormat {
  Excel = 0,
  Json = 1,
  Csv = 2,
  Pdf = 3,
}

export interface ReportFormatOption {
  label: string;
  value: ReportFileFormat;
}

export const REPORT_FORMAT_OPTIONS: ReportFormatOption[] = [
  { label: 'Excel', value: ReportFileFormat.Excel },
  { label: 'JSON', value: ReportFileFormat.Json },
  { label: 'CSV', value: ReportFileFormat.Csv },
  { label: 'PDF', value: ReportFileFormat.Pdf },
];

export interface ReportFiltersPayload {
  deviceId?: number;
  fromUtc?: string;
  toUtc?: string;
  timeRange?: number;
  reportType?: ReportType;
  format?: ReportFileFormat;
}
