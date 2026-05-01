import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TenantComponent } from './tenant.component';

const routes: Routes = [
  {
    path: '',
    component: TenantComponent,
  },
];

@NgModule({
  declarations: [TenantComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class TenantModule {}
