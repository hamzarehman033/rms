import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';

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
    FormsModule,
    RouterModule.forChild(routes),
    ButtonModule,
    InputTextModule,
    SelectModule,
    TabsModule,
  ],
})
export class ReportsModule {}
