import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { SplitButtonModule } from 'primeng/splitbutton';
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
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule, MultiSelectModule, SplitButtonModule, DeviceMapComponent, LineChartComponent, PieChartComponent, BarChartComponent],
})
export class DashboardModule {}
