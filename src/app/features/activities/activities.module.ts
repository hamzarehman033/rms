import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivitiesComponent } from './activities.component';
import { AddActivityComponent } from './add-activity/add-activity.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ModalDialogComponent } from '@app/shared';

const routes: Routes = [
  {
    path: '',
    component: ActivitiesComponent,
  },
];

@NgModule({
  declarations: [ActivitiesComponent, AddActivityComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    TableModule,
    ConfirmDialogModule,
    ModalDialogComponent,
  ],
  providers: [ConfirmationService],
})
export class ActivitiesModule {}
