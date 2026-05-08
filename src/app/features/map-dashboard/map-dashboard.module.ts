import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MapDashboardComponent } from './map-dashboard.component';
import { DeviceMapComponent } from '../../shared/components/device-map/device-map.component';

const routes: Routes = [
  {
    path: '',
    component: MapDashboardComponent,
  },
];

@NgModule({
  declarations: [MapDashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MultiSelectModule,
    SplitButtonModule,
    DeviceMapComponent
  ],
})
export class MapDashboardModule {}
