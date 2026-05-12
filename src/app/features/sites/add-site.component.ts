import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-site',
  standalone: false,
  templateUrl: './add-site.component.html',
  styleUrl: './add-site.component.css'
})
export class AddSiteComponent {
  @Output() siteAdded = new EventEmitter<any>();

  siteForm: FormGroup;
  siteTypes = [
    { label: 'Manufacturing', value: 'manufacturing' },
    { label: 'Storage', value: 'storage' },
    { label: 'Data Center', value: 'datacenter' },
    { label: 'Office', value: 'office' },
    { label: 'Logistics', value: 'logistics' },
    { label: 'Laboratory', value: 'laboratory' },
    { label: 'Retail', value: 'retail' }
  ];

  constructor(private fb: FormBuilder) {
    this.siteForm = this.fb.group({
      siteName: ['', [Validators.required, Validators.minLength(3)]],
      siteId: ['', Validators.required],
      siteType: ['', Validators.required],
      location: ['', Validators.required],
      battery: [100, [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  onSubmit() {
    if (this.siteForm.valid) {
      this.siteAdded.emit(this.siteForm.value);
      this.siteForm.reset({ battery: 100 });
    }
  }

  resetForm() {
    this.siteForm.reset({ battery: 100 });
  }
}
