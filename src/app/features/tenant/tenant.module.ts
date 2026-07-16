import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TenantComponent } from './tenant.component';
import { AddTenantComponent } from './add-tenant.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule } from 'primeng/table';
import { ModalDialogComponent } from '@app/shared';
import { DialogModule } from 'primeng/dialog';

const routes: Routes = [
  {
    path: '',
    component: TenantComponent,
  },
];

@NgModule({
  declarations: [TenantComponent, AddTenantComponent],
  imports: [CommonModule, RouterModule.forChild(routes), ReactiveFormsModule, ButtonModule, InputTextModule, DropdownModule, InputSwitchModule, TableModule, DialogModule, ModalDialogComponent],
})
export class TenantModule {}
