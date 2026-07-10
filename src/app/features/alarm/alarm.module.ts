import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TableModule } from 'primeng/table';
import { AlarmComponent } from './alarm.component';

const routes: Routes = [
  {
    path: '',
    component: AlarmComponent,
  },
];

@NgModule({
  declarations: [AlarmComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TableModule],
})
export class AlarmModule {}
