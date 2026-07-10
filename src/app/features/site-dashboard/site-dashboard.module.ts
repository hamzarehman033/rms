import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BarChartComponent, LineChartComponent, PieChartComponent } from '../../shared/components/chart-components';
import { SiteDashboardComponent } from './site-dashboard/site-dashboard.component';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { SiteDashboardTabsComponent } from './site-dashboard-tabs.component';
import { EquipmentViewComponent } from './equipment-view/equipment-view.component';
import { EventLogComponent } from './event-log/event-log.component';
import { AnalysisViewComponent } from './analysis-view/analysis-view.component';
import { DeviceViewComponent } from "@app/shared";
import { DeviceDetailModule } from './device-detail/device-detail.module';
import { DeviceDetailComponent } from './device-detail/device-detail.component';

const routes: Routes = [
  {
    path: '',
    component: SiteDashboardTabsComponent,
  },
  {
    path: ':id',
    component: SiteDashboardTabsComponent,
  },
];

@NgModule({
  declarations: [
    SiteDashboardTabsComponent,
    SiteDashboardComponent,
    EquipmentViewComponent,
    EventLogComponent,
    AnalysisViewComponent,
    DeviceDetailComponent
  ],
  imports: [
    CommonModule, 
    FormsModule,
    RouterModule.forChild(routes), 
    LineChartComponent,
    BarChartComponent,
    PieChartComponent,
    SelectModule,
    TabsModule,
    DeviceViewComponent,
  ],
})
export class SiteDashboardModule {}
