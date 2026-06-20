import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../../core/services/users.service';
import { ToastService } from '../../../core/services/toast.service';
import { ROLE_OPTIONS } from '../../../core/constants/roles';
import { Menu } from '../../../core/constants/sideMenu';
import { CustomerService } from '@app/core';

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
  roles = ROLE_OPTIONS;
  
  modules = [

    { id: Menu.Overview, label: 'Overview', value: 'dashboard', icon: 'pi pi-chart-bar', selected: false },
    { id: Menu.Sites, label: 'Sites', value: 'devices', icon: 'pi pi-server', selected: false },
    { id: Menu.Telemetry, label: 'Telemetry', value: 'telemetry', icon: 'pi pi-chart-line', selected: false },
    { id: Menu.Alarms, label: 'Alarms', value: 'alarms', icon: 'pi pi-bell', selected: false },
    { id: Menu.Reports, label: 'Reports', value: 'reports', icon: 'pi pi-file-pdf', selected: false },
    { id: Menu.Locations, label: 'Locations', value: 'locations', icon: 'pi pi-map-marker', selected: false },
    { id: Menu.Tenants, label: 'Tenant', value: 'tenant', icon: 'pi pi-building', selected: false },
    { id: Menu.Customers, label: 'Customers', value: 'customers', icon: 'pi pi-user', selected: false },
    { id: Menu.Users, label: 'Users', value: 'users', icon: 'pi pi-users', selected: false },
    { id: Menu.Settings, label: 'Settings', value: 'settings', icon: 'pi pi-cog', selected: false }
  ];

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private customerService: CustomerService,
    private toastService: ToastService
  ) {
    this.userForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      phoneNumber: [''],
      role: ['', Validators.required],
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
    const moduleIds = this.modules.map(module => module.selected ? module.id : null).filter(id => id !== null);

    const payload = {
      id: this.isEditMode ? this.userData?.id : 0,
      userName: formValue.userName,
      email: formValue.email,
      phoneNumber: formValue.phoneNumber,
      role: formValue.role,
      modules: moduleIds,
      customerId: this.customerService.getActiveCustomerId() || ''
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

    const addPayload = { ...payload, password: formValue.password };
    this.usersService.createUser(addPayload).subscribe({
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

  onModuleChange(module: any) {
    module.selected = !module.selected;
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
        }
      });
    }
  }

  private populateFormWithUserData(user: any): void {
    if (!user) {
      return;
    }

    const roles = user.roles || user.role || user.Role || [];

    this.userForm.patchValue({
      userName: user.userName || '',
      email: user.email || user.Email || '',
      phoneNumber: user.phoneNumber || user.PhoneNumber || '',
      role: Array.isArray(roles) ? roles[0] || '' : roles || ''
    });
    if(user.modules && Array.isArray(user.modules)) {
      this.modules.forEach(module => {
        module.selected = user.modules.includes(module.id);
      });
    }
  }

  resetForm() {
    if (!this.isLoading) {
      this.userForm.reset({
        userName: '',
        email: '',
        password: '',
        phoneNumber: '',
        role: '',
        permissions: []
      });
      this.isEditMode = false;
      this.userData = null;
    }
  }
}
