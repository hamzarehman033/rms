import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LineChartComponent } from '../../shared/components/chart-components';
import { TabsModule } from 'primeng/tabs';
import { DockModule } from 'primeng/dock';
import { EhsDetailsTabsComponent } from './ehs-details-tabs.component';
import { EhsDeviceDetailComponent } from './device-detail/ehs-device-detail.component';
import { ScheduledActivitiesComponent } from '../../shared/components/scheduled-activities/scheduled-activities.component';

const routes: Routes = [
  { path: '', component: EhsDetailsTabsComponent },
  { path: ':id', component: EhsDetailsTabsComponent },
];

@NgModule({
  declarations: [EhsDetailsTabsComponent, EhsDeviceDetailComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    LineChartComponent,
    TabsModule,
    DockModule,
    ScheduledActivitiesComponent,
  ],
})
export class EhsDetailsModule {}
