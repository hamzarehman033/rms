import { Component, Input, Output, EventEmitter, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-location',
  standalone: false,
  templateUrl: './add-location.component.html',
  styleUrl: './add-location.component.css'
})
export class AddLocationComponent implements OnInit, OnChanges {
  @Input() level: number = 1; // 1 = Region, 2 = SubRegion, 3 = Zone
  @Input() parentId: number = 0; // Parent location ID
  @Output() locationAdded = new EventEmitter<any>();

  locationForm: FormGroup;
  levelNames: { [key: number]: string } = {
    1: 'Region',
    2: 'SubRegion',
    3: 'Zone'
  };

  constructor(private fb: FormBuilder) {
    this.locationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      code: ['', [Validators.required, Validators.minLength(2)]],
      parentId: [0, Validators.required],
      level: [1, Validators.required]
    });
  }

  ngOnInit() {
    this.syncFormContext();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['level'] || changes['parentId']) {
      this.syncFormContext();
    }
  }

  private syncFormContext() {
    this.locationForm.patchValue({
      parentId: this.parentId,
      level: this.level
    });
  }

  onSubmit() {
    if (this.locationForm.valid) {
      this.locationAdded.emit(this.locationForm.value);
      this.locationForm.reset({
        parentId: this.parentId,
        level: this.level
      });
    }
  }

  resetForm() {
    this.locationForm.reset({
      parentId: this.parentId,
      level: this.level
    });
  }
}

