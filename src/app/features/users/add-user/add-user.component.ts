import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../../core/services/users.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-add-user',
  standalone: false,
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent implements OnInit, OnChanges {
  @Input() userData: any = null;
  @Output() userAdded = new EventEmitter<any>();
  @Output() userUpdated = new EventEmitter<any>();

  userForm: FormGroup;
  isLoading = false;
  isEditMode = false;
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

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private toastService: ToastService
  ) {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      status: ['Active'],
      permissions: [[]]
    });
  }

  ngOnInit(): void {
    if (this.userData) {
      this.isEditMode = true;
      this.fetchAndPopulateUserData();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userData'] && !changes['userData'].firstChange) {
      if (this.userData) {
        this.isEditMode = true;
        this.fetchAndPopulateUserData();
      } else {
        this.isEditMode = false;
        this.resetForm();
      }
    }
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.toastService.showError('Validation Error', 'Please fill in all required fields correctly.');
      return;
    }

    this.isLoading = true;
    const formValue = this.userForm.value;
    const permissions = this.getSelectedPermissions();

    const payload = {
      id: this.isEditMode ? this.userData?.id : 0,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      role: formValue.role,
      permissions,
      status: formValue.status
    };

    if (this.isEditMode) {
      this.usersService.updateUser(this.userData.id, payload).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.toastService.showSuccess('Success', 'User updated successfully.');
          this.userUpdated.emit(response);
          this.userForm.reset();
          this.isEditMode = false;
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Error updating user:', error);
          this.toastService.showError('Error', 'Failed to update user. Please try again.');
        }
      });
      return;
    }

    this.usersService.createUser(payload).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.toastService.showSuccess('Success', 'User created successfully.');
        this.userAdded.emit(response);
        this.userForm.reset();
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Error creating user:', error);
        this.toastService.showError('Error', 'Failed to create user. Please try again.');
      }
    });
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

  private fetchAndPopulateUserData(): void {
    if (this.userData && this.userData.id) {
      this.isLoading = true;
      this.usersService.getUserById(this.userData.id).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          const user = response?.data || response;
          this.populateFormWithUserData(user);
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Error fetching user details:', error);
          this.populateFormWithUserData(this.userData);
        }
      });
    }
  }

  private populateFormWithUserData(user: any): void {
    if (!user) {
      return;
    }

    this.userForm.patchValue({
      firstName: user.firstName || user.FirstName || user.name?.split(' ')[0] || '',
      lastName: user.lastName || user.LastName || user.name?.split(' ').slice(1).join(' ') || '',
      email: user.email || user.Email || '',
      role: String(user.role || user.Role || 'viewer').toLowerCase(),
      status: user.status || user.Status || 'Active'
    });
  }

  resetForm() {
    if (!this.isLoading) {
      this.userForm.reset();
      this.isEditMode = false;
      this.userData = null;
    }
  }
}
