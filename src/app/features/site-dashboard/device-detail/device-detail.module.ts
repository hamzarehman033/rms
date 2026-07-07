import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DeviceViewComponent } from "@app/shared";
import { LineChartComponent } from '../../../shared/components/chart-components';
import { DockModule } from 'primeng/dock';

const routes: Routes = [];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes), DeviceViewComponent, DockModule, LineChartComponent],
})
export class DeviceDetailModule {}
