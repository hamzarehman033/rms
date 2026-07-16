export enum AppRole {
  SysAdmin = 'SysAdmin',
  Admin = 'Admin',
  Manager = 'Manager',
  User = 'User',
  Technician = 'Technician',
  Viewer = 'Viewer',
}

export const ROLE_OPTIONS: Array<{ label: string; value: AppRole }> = [
  // { label: AppRole.SysAdmin, value: AppRole.SysAdmin },
  { label: AppRole.Admin, value: AppRole.Admin },
  { label: AppRole.Manager, value: AppRole.Manager },
  { label: AppRole.User, value: AppRole.User },
  { label: AppRole.Technician, value: AppRole.Technician },
  { label: AppRole.Viewer, value: AppRole.Viewer },
];

