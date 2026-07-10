import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppRole, AuthService, ToastService, UsersService } from '@app/core';
import { Menu, MenuOptions } from '../../core/constants/sideMenu';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  selectedTab = 0;
  isLoading = false;
  isSaving = false;
  isChangingPassword = false;
  currentUser: any = null;
  modules = MenuOptions;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private usersService: UsersService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadProfile();
  }

  initializeForm(): void {
    this.profileForm = this.fb.group({
      phoneNumber: [''],
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
    });
  }

  loadProfile(): void {
    const authUser = this.authService.getCurrentUser();
    const userId = authUser?.id;

    if (!userId) {
      this.toastService.showError('Error', 'Unable to load current user.');
      return;
    }

    this.isLoading = true;
    this.usersService.getUserById(userId).subscribe({
      next: (response: any) => {
        this.currentUser = response?.data || response;
        this.profileForm.patchValue({
          phoneNumber: this.currentUser?.phoneNumber || '',
        });
        if(!this.currentUser?.roles?.includes(AppRole.SysAdmin)) {
          this.modules = MenuOptions.filter(module => module.id !== Menu.Settings && module.id !== Menu.Customers);
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastService.showError('Error', 'Failed to load profile.');
      }
    });
  }

  onSaveProfile(): void {
    if (this.profileForm.invalid || !this.currentUser?.id) {
      return;
    }

    const roles = this.currentUser.roles || this.currentUser.role || [];
    const payload = {
      id: this.currentUser.id,
      userName: this.currentUser.userName,
      email: this.currentUser.email,
      phoneNumber: this.profileForm.value.phoneNumber,
      role: Array.isArray(roles) ? roles[0] || '' : roles || '',
      modules: this.currentUser.modules || []
    };

    this.isSaving = true;
    this.usersService.updateUser(this.currentUser.id, payload).subscribe({
      next: () => {
        this.currentUser = { ...this.currentUser, phoneNumber: payload.phoneNumber };
        this.isSaving = false;
        this.toastService.showSuccess('Success', 'Profile updated successfully.');
      },
      error: () => {
        this.isSaving = false;
        this.toastService.showError('Error', 'Failed to update profile.');
      }
    });
  }

  onChangePassword(): void {
    if (this.passwordForm.invalid) {
      return;
    }

    this.isChangingPassword = true;
    this.authService.changePassword(this.passwordForm.value).subscribe({
      next: () => {
        this.isChangingPassword = false;
        this.passwordForm.reset();
        this.toastService.showSuccess('Success', 'Password changed successfully.');
      },
      error: () => {
        this.isChangingPassword = false;
        this.toastService.showError('Error', 'Failed to change password.');
      }
    });
  }

  onUploadPhoto(): void {}

  onDownloadPhoto(): void {
    console.log('Download photo');
  }

  onDeletePhoto(): void {
    console.log('Delete photo');
  }
  onCancel(): void {
    this.profileForm.patchValue({
      phoneNumber: this.currentUser?.phoneNumber || '',
    });
  }

  hasModule(moduleId: number): boolean {
    const modules = this.currentUser?.modules || [];
    return modules.map((id: any) => Number(id)).includes(moduleId);
  }

  get roleLabel(): string {
    const roles = this.currentUser?.roles || this.currentUser?.role || [];
    return Array.isArray(roles) ? roles[0] || '-' : roles || '-';
  }
}
