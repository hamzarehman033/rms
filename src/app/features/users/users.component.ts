import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { UsersService } from '../../core/services/users.service';
import { ToastService } from '../../core/services/toast.service';
import { Menu, MenuMapper, MenuOptions } from '../../core/constants/sideMenu';
import { AppRole } from '../../core/constants/roles';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  isLoading = false;
  displayAddUserDialog = false;
  selectedTab = 0;
  searchTerm = '';
  users: any[] = [];
  selectedUserForEdit: any = null;
  dialogHeader = 'Invite New User';
  MenuMapper = MenuMapper;
  Menu = Menu;
  AppRole = AppRole;

  constructor(
    private usersService: UsersService,
    private toastService: ToastService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.usersService.getUsers().subscribe({
      next: (response: any) => {
        const userList = response?.data?.pageData || response?.data || response || [];
        this.users = userList;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Error loading users:', error);
        this.toastService.showError('Error', 'Failed to load users. Please try again.');
      }
    });
  }

  openAddUserDialog() {
    this.selectedUserForEdit = null;
    this.dialogHeader = 'Invite New User';
    this.displayAddUserDialog = true;
  }

  openEditUserDialog(user: any): void {
    this.selectedUserForEdit = user;
    this.dialogHeader = 'Edit User';
    this.displayAddUserDialog = true;
  }

  deleteUser(user: any): void {
    this.confirmationService.confirm({
      header: 'Delete User',
      message: `Are you sure you want to delete ${user?.name || user?.email || 'this user'}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.isLoading = true;
        this.usersService.deleteUser(user.id).subscribe({
          next: () => {
            this.isLoading = false;
            this.toastService.showSuccess('Success', 'User deleted successfully.');
            this.loadUsers();
          },
          error: (error: any) => {
            this.isLoading = false;
            console.error('Error deleting user:', error);
            this.toastService.showError('Error', 'Failed to delete user. Please try again.');
          }
        });
      }
    });
  }

  onUserAdded(userData: any) {
    this.displayAddUserDialog = false;
    this.selectedUserForEdit = null;
    this.loadUsers();
  }

  onUserUpdated(userData: any) {
    this.displayAddUserDialog = false;
    this.selectedUserForEdit = null;
    this.loadUsers();
  }

  getUserPermission(module: Menu): string {
    return MenuMapper[module] || 'Undefined';
  }

  getPermissionSummary(permissions: any[]): string {
    if (!permissions || permissions.length === 0) return 'No access';
    
    const viewCount = permissions.filter(p => p.view).length;
    const editCount = permissions.filter(p => p.edit).length;
    
    return `${viewCount}V, ${editCount}E`;
  }

  hasEdit(permissions: any[]): boolean {
    return permissions.some(p => p.edit || p.canEdit);
  }

  get totalUsers(): number {
    return this.users.length;
  }

  get adminUsers(): number {
    return this.users.filter(u => this.getPrimaryRole(u) === AppRole.Admin).length;
  }

  get userUsers(): number {
    return this.users.filter(u => this.getPrimaryRole(u) === AppRole.User).length;
  }

  get technicianUsers(): number {
    return this.users.filter(u => this.getPrimaryRole(u) === AppRole.Technician).length;
  }

  get viewerUsers(): number {
    return this.users.filter(u => this.getPrimaryRole(u) === AppRole.Viewer).length;
  }

  get filteredUsers(): any[] {
    let filtered = this.users;

    if (this.selectedTab === 1) {
      filtered = filtered.filter(u => this.getPrimaryRole(u) === AppRole.Admin);
    } else if (this.selectedTab === 2) {
      filtered = filtered.filter(u => this.getPrimaryRole(u) === AppRole.User);
    } else if (this.selectedTab === 3) {
      filtered = filtered.filter(u => this.getPrimaryRole(u) === AppRole.Technician);
    } else if (this.selectedTab === 4) {
      filtered = filtered.filter(u => this.getPrimaryRole(u) === AppRole.Viewer);
    }

    if (this.searchTerm) {
      const term = this.searchTerm.trim().toLowerCase();
      if (!term) {
        return filtered;
      }

      return filtered.filter(u =>
        String(u.userName ?? '').toLowerCase().includes(term) ||
        String(u.email ?? '').toLowerCase().includes(term)
      );
    }

    return filtered;
  }

  private getPrimaryRole(user: any): AppRole | null {
    const role = Array.isArray(user?.roles) ? user.roles[0] : user?.role;
    const normalized = String(role ?? '').trim().toLowerCase();

    const roleMap: Record<string, AppRole> = {
      admin: AppRole.Admin,
      user: AppRole.User,
      technician: AppRole.Technician,
      viewer: AppRole.Viewer,
      sysadmin: AppRole.SysAdmin
    };

    return roleMap[normalized] ?? null;
  }
}
