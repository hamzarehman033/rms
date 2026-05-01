import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { DataSourcesComponent } from './data-sources.component';
import { AddDataSourceComponent } from './add-data-source.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ModalDialogComponent } from '@app/shared';

const routes: Routes = [
  {
    path: '',
    component: DataSourcesComponent,
  },
];

@NgModule({
  declarations: [DataSourcesComponent, AddDataSourceComponent],
  imports: [CommonModule, RouterModule.forChild(routes), ReactiveFormsModule, ButtonModule, InputTextModule, DropdownModule, InputNumberModule, ModalDialogComponent],
})
export class DataSourcesModule {}
