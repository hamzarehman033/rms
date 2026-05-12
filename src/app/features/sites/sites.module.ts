import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ModalDialogComponent } from '@app/shared';
import { AddSiteComponent } from './add-site/add-site.component';
import { SiteConfigurationComponent } from './site-configuration.component';
import { SitesComponent } from './sites.component';

const routes: Routes = [
  {
    path: '',
    component: SitesComponent,
  },
];

@NgModule({
  declarations: [
    SitesComponent,
    AddSiteComponent,
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
    ModalDialogComponent,
    SiteConfigurationComponent
  ],
})
export class SitesModule {}
