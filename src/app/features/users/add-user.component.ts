import { Component, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-user',
  standalone: false,
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent {
  @Output() userAdded = new EventEmitter<any>();

  userForm: FormGroup;
  roles = [
    { label: 'Admin', value: 'admin' },
    { label: 'Operator', value: 'operator' },
    { label: 'Viewer', value: 'viewer' }
  ];
  
  modules = [
    { label: 'Dashboard', value: 'dashboard', icon: 'pi pi-chart-bar' },
    { label: 'Devices', value: 'devices', icon: 'pi pi-server' },
    { label: 'Locations', value: 'locations', icon: 'pi pi-map-marker' },
    { label: 'Users', value: 'users', icon: 'pi pi-users' },
    { label: 'Rules', value: 'rules', icon: 'pi pi-list' },
    { label: 'Alarms', value: 'alarms', icon: 'pi pi-bell' },
    { label: 'Reports', value: 'reports', icon: 'pi pi-file-pdf' },
    { label: 'Settings', value: 'settings', icon: 'pi pi-cog' }
  ];

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      permissions: [[]]
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      formValue.permissions = this.getSelectedPermissions();
      this.userAdded.emit(formValue);
      this.userForm.reset();
    }
  }

  getSelectedPermissions(): any[] {
    const permissions: any[] = [];
    this.modules.forEach(module => {
      const viewCheckbox = document.querySelector(`input[name="${module.value}-view"]:checked`);
      const editCheckbox = document.querySelector(`input[name="${module.value}-edit"]:checked`);
      
      if (viewCheckbox || editCheckbox) {
        permissions.push({
          module: module.value,
          view: !!viewCheckbox,
          edit: !!editCheckbox
        });
      }
    });
    return permissions;
  }

  resetForm() {
    this.userForm.reset();
  }
}
