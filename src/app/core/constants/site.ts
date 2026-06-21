export interface Site {
  id: string | number;
  locationId?: string | number;
  deviceId?: string | number;
  siteCode?: string;
  regionId?: number;
  regionName?: string;
  subRegionId?: number;
  subRegionName?: string;
  zoneId?: number;
  zoneName?: string;
  name: string;
  status: 'online' | 'offline' | 'warning' | 'active' | string;
  code?: string;
  address?: string;
  coordinates?: string;
  type: string;
  location: string;
  battery: string;
  lastSeen: string;
}
