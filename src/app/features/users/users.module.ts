import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UsersComponent } from './users.component';
import { AddUserComponent } from './add-user/add-user.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ModalDialogComponent } from '@app/shared';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
  },
];

@NgModule({
  declarations: [UsersComponent, AddUserComponent],
  imports: [CommonModule, RouterModule.forChild(routes), ReactiveFormsModule, ButtonModule, InputTextModule, DropdownModule, CheckboxModule, ConfirmDialogModule, ModalDialogComponent, FormsModule],
  providers: [ConfirmationService],
})
export class UsersModule {}
