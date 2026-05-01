import { Component, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-data-source',
  standalone: false,
  templateUrl: './add-data-source.component.html',
  styleUrl: './add-data-source.component.css'
})
export class AddDataSourceComponent {
  @Output() dataSourceAdded = new EventEmitter<any>();

  dataSourceForm: FormGroup;
  sourceTypes = [
    { label: 'REST API', value: 'rest' },
    { label: 'Database', value: 'database' },
    { label: 'MQTT', value: 'mqtt' },
    { label: 'WebSocket', value: 'websocket' }
  ];

  constructor(private fb: FormBuilder) {
    this.dataSourceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      sourceType: ['', Validators.required],
      endpoint: ['', Validators.required],
      connectionString: [''],
      refreshRate: [60, [Validators.required, Validators.min(5)]]
    });
  }

  onSubmit() {
    if (this.dataSourceForm.valid) {
      this.dataSourceAdded.emit(this.dataSourceForm.value);
      this.dataSourceForm.reset({ refreshRate: 60 });
    }
  }

  resetForm() {
    this.dataSourceForm.reset({ refreshRate: 60 });
  }
}
