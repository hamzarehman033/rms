import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TelemetryComponent } from './telemetry.component';

const routes: Routes = [
  {
    path: '',
    component: TelemetryComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes), TelemetryComponent],
})
export class TelemetryModule {}
