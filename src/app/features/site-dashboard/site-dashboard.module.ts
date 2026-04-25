import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SiteDashboardComponent } from './site-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: SiteDashboardComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes), SiteDashboardComponent],
})
export class SiteDashboardModule {}
