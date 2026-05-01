import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { UsersComponent } from './users.component';
import { AddUserComponent } from './add-user.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ModalDialogComponent } from '@app/shared';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
  },
];

@NgModule({
  declarations: [UsersComponent, AddUserComponent],
  imports: [CommonModule, RouterModule.forChild(routes), ReactiveFormsModule, ButtonModule, InputTextModule, DropdownModule, CheckboxModule, ModalDialogComponent],
})
export class UsersModule {}
