import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DeviceMapComponent } from '../../shared/components/device-map/device-map.component';
import { LineChartComponent, PieChartComponent, BarChartComponent } from '../../shared/components/chart-components';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
];

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, RouterModule.forChild(routes), DeviceMapComponent, LineChartComponent, PieChartComponent, BarChartComponent],
})
export class DashboardModule {}
