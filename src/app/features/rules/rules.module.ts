import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RulesComponent } from './rules.component';
import { AddRuleComponent } from './add-rule.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ModalDialogComponent } from '@app/shared';

const routes: Routes = [
  {
    path: '',
    component: RulesComponent,
  },
];

@NgModule({
  declarations: [RulesComponent, AddRuleComponent],
  imports: [CommonModule, RouterModule.forChild(routes), ReactiveFormsModule, ButtonModule, InputTextModule, DropdownModule, InputSwitchModule, ModalDialogComponent],
})
export class RulesModule {}
