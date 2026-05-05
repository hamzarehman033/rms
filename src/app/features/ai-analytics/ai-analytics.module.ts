import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AiAnalyticsComponent } from './ai-analytics.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

const routes: Routes = [
  {
    path: '',
    component: AiAnalyticsComponent,
  },
];

@NgModule({
  declarations: [
    AiAnalyticsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ButtonModule,
    InputTextModule,
  ],
})
export class AiAnalyticsModule {}
