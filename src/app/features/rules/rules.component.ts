import { Component } from '@angular/core';

@Component({
  selector: 'app-rules',
  standalone: false,
  templateUrl: './rules.component.html',
  styleUrl: './rules.component.css'
})
export class RulesComponent {
  displayAddRuleDialog = false;

  openAddRuleDialog() {
    this.displayAddRuleDialog = true;
  }

  onRuleAdded(ruleData: any) {
    console.log('Rule added:', ruleData);
    this.displayAddRuleDialog = false;
  }
}
