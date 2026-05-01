import { Component, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-rule',
  standalone: false,
  templateUrl: './add-rule.component.html',
  styleUrl: './add-rule.component.css'
})
export class AddRuleComponent {
  @Output() ruleAdded = new EventEmitter<any>();

  ruleForm: FormGroup;
  ruleTypes = [
    { label: 'Alert', value: 'alert' },
    { label: 'Action', value: 'action' },
    { label: 'Notification', value: 'notification' }
  ];

  constructor(private fb: FormBuilder) {
    this.ruleForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      ruleType: ['', Validators.required],
      condition: ['', Validators.required],
      enabled: [true]
    });
  }

  onSubmit() {
    if (this.ruleForm.valid) {
      this.ruleAdded.emit(this.ruleForm.value);
      this.ruleForm.reset({ enabled: true });
    }
  }

  resetForm() {
    this.ruleForm.reset({ enabled: true });
  }
}
