import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { UsersService } from '../../core/services/users.service';
import { ToastService } from '../../core/services/toast.service';

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
        this.users = userList.map((user: any) => {
          const firstName = user.firstName || user.FirstName || '';
          const lastName = user.lastName || user.LastName || '';
          const fullName = user.name || user.Name || `${firstName} ${lastName}`.trim();

          return {
            id: user.id || user.userId || user.Id || 'N/A',
            firstName: firstName || fullName.split(' ')[0] || 'Unknown',
            lastName: lastName || fullName.split(' ').slice(1).join(' '),
            name: fullName,
            email: user.email || user.Email || 'N/A',
            role: String(user.role || user.Role || 'viewer').toLowerCase(),
            status: user.status || user.Status || (user.isActive === false ? 'Inactive' : 'Active'),
            lastActive:
              user.lastActive ||
              user.LastActive ||
              user.lastLogin ||
              user.LastLogin ||
              '-',
            permissions: user.permissions || user.Permissions || []
          };
        });
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
    return this.users.filter(u => u.role === 'admin').length;
  }

  get operatorUsers(): number {
    return this.users.filter(u => u.role === 'operator').length;
  }

  get viewerUsers(): number {
    return this.users.filter(u => u.role === 'viewer').length;
  }

  get filteredUsers(): any[] {
    let filtered = this.users;

    if (this.selectedTab === 1) {
      filtered = filtered.filter(u => u.role === 'admin');
    } else if (this.selectedTab === 2) {
      filtered = filtered.filter(u => u.role === 'operator');
    } else if (this.selectedTab === 3) {
      filtered = filtered.filter(u => u.role === 'viewer');
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        u =>
          String(u.id).toLowerCase().includes(term) ||
          String(u.firstName).toLowerCase().includes(term) ||
          String(u.lastName).toLowerCase().includes(term) ||
          String(u.email).toLowerCase().includes(term)
      );
    }

    return filtered;
  }
}
