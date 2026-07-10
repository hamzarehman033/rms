import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TableModule } from 'primeng/table';
import { TelemetryComponent } from './telemetry.component';
import { LineChartComponent } from '../../shared/components/chart-components';

const routes: Routes = [
  {
    path: '',
    component: TelemetryComponent,
  },
];

@NgModule({
  declarations: [TelemetryComponent],
  imports: [CommonModule, RouterModule.forChild(routes), LineChartComponent, TableModule],
})
export class TelemetryModule {}
