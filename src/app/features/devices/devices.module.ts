import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DevicesComponent } from './devices.component';
import { AddDeviceComponent } from './add-device.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ModalDialogComponent } from '@app/shared';

const routes: Routes = [
  {
    path: '',
    component: DevicesComponent,
  },
];

@NgModule({
  declarations: [
    DevicesComponent,
    AddDeviceComponent,
  ],
  imports: [
    CommonModule, 
    RouterModule.forChild(routes), 
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    InputNumberModule,
    ModalDialogComponent
  ],
})
export class DevicesModule {}
