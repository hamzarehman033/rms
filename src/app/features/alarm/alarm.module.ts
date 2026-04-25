import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AlarmComponent } from './alarm.component';

const routes: Routes = [
  {
    path: '',
    component: AlarmComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes), AlarmComponent],
})
export class AlarmModule {}
