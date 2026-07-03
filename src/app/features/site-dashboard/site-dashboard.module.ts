import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LineChartComponent } from '../../shared/components/chart-components';
import { SiteDashboardComponent } from './site-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: SiteDashboardComponent,
  },
  {
    path: ':id',
    component: SiteDashboardComponent,
  },
];

@NgModule({
  declarations: [SiteDashboardComponent],
  imports: [
    CommonModule, 
    RouterModule.forChild(routes), 
    LineChartComponent
  ],
})
export class SiteDashboardModule {}
