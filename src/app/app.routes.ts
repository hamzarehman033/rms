import { Routes } from "@angular/router";
import { AdminLayoutComponent, PublicLayoutComponent } from "@app/layouts";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full",
  },
  {
    path: "",
    component: AdminLayoutComponent,
    children: [
      {
        path: "dashboard",
        loadChildren: () =>
          import("./features/dashboard/dashboard.module").then(
            (m) => m.DashboardModule,
          ),
      },
      {
        path: "alarm",
        loadChildren: () =>
          import("./features/alarm/alarm.module").then((m) => m.AlarmModule),
      },
      {
        path: "devices",
        loadChildren: () =>
          import("./features/devices/devices.module").then((m) => m.DevicesModule),
      },
      {
        path: "telemetry",
        loadChildren: () =>
          import("./features/telemetry/telemetry.module").then(
            (m) => m.TelemetryModule,
          ),
      },
      {
        path: "locations",
        loadChildren: () =>
          import("./features/locations/locations.module").then(
            (m) => m.LocationsModule,
          ),
      },
      {
        path: "site-dashboard",
        loadChildren: () =>
          import("./features/site-dashboard/site-dashboard.module").then(
            (m) => m.SiteDashboardModule,
          ),
      },
      {
        path: "rules",
        loadChildren: () =>
          import("./features/rules/rules.module").then((m) => m.RulesModule),
      },
      {
        path: "data-sources",
        loadChildren: () =>
          import("./features/data-sources/data-sources.module").then(
            (m) => m.DataSourcesModule,
          ),
      },
      {
        path: "users",
        loadChildren: () =>
          import("./features/users/users.module").then((m) => m.UsersModule),
      },
      {
        path: "tenant",
        loadChildren: () =>
          import("./features/tenant/tenant.module").then((m) => m.TenantModule),
      },
      {
        path: "customer",
        loadChildren: () =>
          import("./features/customer/customer.module").then((m) => m.CustomerModule),
      },
      {
        path: "settings",
        loadChildren: () =>
          import("./features/settings/settings.module").then(
            (m) => m.SettingsModule,
          ),
      },
      {
        path: "profile",
        loadChildren: () =>
          import("./features/profile/profile.module").then(
            (m) => m.ProfileModule,
          ),
      },
    ],
  },
  {
    path: "auth",
    component: PublicLayoutComponent,
    children: [
      {
        path: "login",
        loadChildren: () =>
          import("./features/login/login.module").then((m) => m.LoginModule),
      },
    ],
  },
  {
    path: "**",
    redirectTo: "dashboard",
  },
];
