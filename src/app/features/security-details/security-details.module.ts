import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LineChartComponent } from '../../shared/components/chart-components';
import { TabsModule } from 'primeng/tabs';
import { DockModule } from 'primeng/dock';
import { SecurityDetailsTabsComponent } from './security-details-tabs.component';
import { SecurityDeviceDetailComponent } from './device-detail/security-device-detail.component';

const routes: Routes = [
  { path: '', component: SecurityDetailsTabsComponent },
  { path: ':id', component: SecurityDetailsTabsComponent },
];

@NgModule({
  declarations: [SecurityDetailsTabsComponent, SecurityDeviceDetailComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    LineChartComponent,
    TabsModule,
    DockModule,
  ],
})
export class SecurityDetailsModule {}
