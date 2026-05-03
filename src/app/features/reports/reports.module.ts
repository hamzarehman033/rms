import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
  },
];

@NgModule({
  declarations: [
    ReportsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ButtonModule,
    InputTextModule,
  ],
})
export class ReportsModule {}
