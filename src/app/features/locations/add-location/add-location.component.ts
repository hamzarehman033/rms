import { Component, Input, Output, EventEmitter, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@app/core';

@Component({
  selector: 'app-add-location',
  standalone: false,
  templateUrl: './add-location.component.html',
  styleUrl: './add-location.component.css'
})
export class AddLocationComponent implements OnInit, OnChanges {
  @Input() level: number = 1; // 1 = Region, 2 = SubRegion, 3 = Zone
  @Input() parentId: number = 0; // Parent location ID
  @Input() editingLocation: Location | null = null; // For edit mode
  @Output() locationAdded = new EventEmitter<any>();
  @Output() locationUpdated = new EventEmitter<any>();

  locationForm: FormGroup;
  isEditMode = false;
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
    if (changes['level'] || changes['parentId'] || changes['editingLocation']) {
      this.syncFormContext();
    }
  }

  private syncFormContext() {
    if (this.editingLocation) {
      this.isEditMode = true;
      this.locationForm.patchValue({
        name: this.editingLocation.name,
        code: this.editingLocation.code,
        parentId: this.editingLocation.parentId,
        level: this.editingLocation.level,
      });
    } else {
      this.isEditMode = false;
      this.locationForm.patchValue({
        parentId: this.parentId,
        level: this.level
      });
    }
  }

  onSubmit() {
    if (this.locationForm.valid) {
      if (this.isEditMode) {
        this.locationUpdated.emit({
          id: this.editingLocation?.id,
          ...this.locationForm.value
        });
      } else {
        this.locationAdded.emit(this.locationForm.value);
      }
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

