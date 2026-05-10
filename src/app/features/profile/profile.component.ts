import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { toast } from '../../utils/global-toast';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  selectedTab = 0;

  // Current user profile data
  currentUser = {
    firstName: 'Anna',
    lastName: 'Smith',
    email: 'anna@pulse.io',
    role: 'admin',
    avatar: 'A',
    joinDate: 'Jan 10, 2025',
  };

  // Modules for permission management
  modules = [
    { label: 'Dashboard', value: 'dashboard', icon: 'pi pi-chart-bar' },
    { label: 'Devices', value: 'devices', icon: 'pi pi-microchip' },
    { label: 'Locations', value: 'locations', icon: 'pi pi-map' },
    { label: 'Users', value: 'users', icon: 'pi pi-users' },
    { label: 'Rules', value: 'rules', icon: 'pi pi-cog' },
    { label: 'Alarms', value: 'alarms', icon: 'pi pi-bell' },
    { label: 'Reports', value: 'reports', icon: 'pi pi-file' },
    { label: 'Settings', value: 'settings', icon: 'pi pi-sliders-v' },
  ];

  // User permissions
  userPermissions = [
    { module: 'dashboard', read: true, write: true },
    { module: 'devices', read: true, write: true },
    { module: 'locations', read: true, write: true },
    { module: 'users', read: true, write: true },
    { module: 'rules', read: true, write: true },
    { module: 'alarms', read: true, write: true },
    { module: 'reports', read: true, write: true },
    { module: 'settings', read: true, write: true },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.profileForm = this.fb.group({
      firstName: [this.currentUser.firstName, Validators.required],
      lastName: [this.currentUser.lastName, Validators.required],
      email: [this.currentUser.email, [Validators.required, Validators.email]],
    });

    // Add permission controls
    this.modules.forEach((module) => {
      const permission = this.userPermissions.find(
        (p) => p.module === module.value,
      );
      this.profileForm.addControl(
        `${module.value}_read`,
        new FormControl({ value: permission?.read || false, disabled: true }),
      );
      this.profileForm.addControl(
        `${module.value}_write`,
        new FormControl({ value: permission?.write || false, disabled: true }),
      );
    });
  }

  getPermissionForModule(module: string): any {
    return this.userPermissions.find((p) => p.module === module);
  }

  onSaveProfile(): void {
    if (this.profileForm.valid) {
      try {
        // Update user profile
        this.currentUser.firstName = this.profileForm.get('firstName')?.value;
        this.currentUser.lastName = this.profileForm.get('lastName')?.value;
        this.currentUser.email = this.profileForm.get('email')?.value;

        // Update permissions
        this.modules.forEach((module) => {
          const permission = this.userPermissions.find(
            (p) => p.module === module.value,
          );
          if (permission) {
            const readValue = this.profileForm.get(
              `${module.value}_read`,
            )?.value;
            const writeValue = this.profileForm.get(
              `${module.value}_write`,
            )?.value;
            permission.read = readValue || false;
            permission.write = writeValue || false;
          }
        });

        console.log('Profile saved:', {
          user: this.currentUser,
          permissions: this.userPermissions,
        });

        // Show success toast
        toast.success(
          'Profile Updated',
          'Your profile and permissions have been saved successfully.',
        );
      } catch (error) {
        // Show error toast
        toast.error(
          'Failed to Save',
          'An error occurred while saving your profile. Please try again.',
        );
        console.error('Error saving profile:', error);
      }
    }
  }

  onChangePassword(): void {
    console.log('Change password clicked');
  }

  onUploadPhoto(): void {}

  onCancel(): void {
    this.initializeForm();
  }

  getReadControl(moduleValue: string): FormControl {
    return this.profileForm.get(`${moduleValue}_read`) as FormControl;
  }

  getWriteControl(moduleValue: string): FormControl {
    return this.profileForm.get(`${moduleValue}_write`) as FormControl;
  }

  isModuleEnabled(moduleValue: string): boolean {
    const readValue = this.profileForm.get(`${moduleValue}_read`)?.value;
    const writeValue = this.profileForm.get(`${moduleValue}_write`)?.value;
    return readValue || writeValue;
  }
}
