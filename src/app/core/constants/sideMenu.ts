export enum Menu {
  Overview = 1,
  Sites = 2,
  Telemetry = 3,
  Alarms = 4,
  Reports = 5,
  Locations = 6,
  Tenants = 7,
  Customers = 8,
  Users = 9,
  Settings = 10,
}


export const MenuOptions = [
  { id: Menu.Overview, label: 'Overview', icon: 'pi pi-home' },
  { id: Menu.Sites, label: 'Sites', icon: 'pi pi-building' },
  { id: Menu.Telemetry, label: 'Telemetry', icon: 'pi pi-chart-line' },
  { id: Menu.Alarms, label: 'Alarms', icon: 'pi pi-bell' },
  { id: Menu.Reports, label: 'Reports', icon: 'pi pi-file' },
  { id: Menu.Locations, label: 'Locations', icon: 'pi pi-map-marker' },
  { id: Menu.Tenants, label: 'Tenants', icon: 'pi pi-building' },
  { id: Menu.Customers, label: 'Customers', icon: 'pi pi-user' },
  { id: Menu.Users, label: 'Users', icon: 'pi pi-users' },
  { id: Menu.Settings, label: 'Settings', icon: 'pi pi-cog' },
]


export const MenuMapper = {
  [Menu.Overview]: 'Overview',
  [Menu.Sites]: 'Sites',
  [Menu.Telemetry]: 'Telemetry',
  [Menu.Alarms]: 'Alarms',
  [Menu.Reports]: 'Reports',
  [Menu.Locations]: 'Locations',
  [Menu.Tenants]: 'Tenants',
  [Menu.Customers]: 'Customers',
  [Menu.Users]: 'Users',
  [Menu.Settings]: 'Settings',
};