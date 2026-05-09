import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DeviceDetailComponent } from './device-detail.component';
import { DeviceViewComponent } from "@app/shared";
import { LineChartComponent } from '../../shared/components/chart-components';
import { DockModule } from 'primeng/dock';

const routes: Routes = [
  {
    path: '',
    component: DeviceDetailComponent,
  },
];

@NgModule({
  declarations: [DeviceDetailComponent],
  imports: [CommonModule, RouterModule.forChild(routes), DeviceViewComponent, DockModule, LineChartComponent],
})
export class DeviceDetailModule {}
