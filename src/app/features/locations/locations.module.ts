import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { LocationsComponent } from './locations.component';
import { AddLocationComponent } from './add-location.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ModalDialogComponent } from '@app/shared';
import { Select, SelectModule } from 'primeng/select';
import { TreeTableModule } from 'primeng/treetable';
import { DialogModule } from 'primeng/dialog';

const routes: Routes = [
  {
    path: '',
    component: LocationsComponent,
  },
];

@NgModule({
  declarations: [LocationsComponent, AddLocationComponent],
  imports: [
    CommonModule, 
    RouterModule.forChild(routes), 
    ReactiveFormsModule, 
    ButtonModule, 
    InputTextModule, 
    ModalDialogComponent,
    SelectModule,
    TreeTableModule,
    DialogModule
  ],
})
export class LocationsModule {}
