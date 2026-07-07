import { Component } from '@angular/core';

type SiteDashboardTab =
  | 'site-pulse'
  | 'equipment-view'
  | 'event-log'
  | 'analysis'
  | 'site-details';

@Component({
  selector: 'app-site-dashboard-tabs',
  standalone: false,
  templateUrl: './site-dashboard-tabs.component.html',
  styleUrl: './site-dashboard-tabs.component.css'
})
export class SiteDashboardTabsComponent {
  activeTab: SiteDashboardTab = 'site-pulse';
}
