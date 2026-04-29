import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule, Menu } from 'primeng/menu';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, MenuModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css',
})
export class TopbarComponent {
  @ViewChild('avatarMenu') avatarMenu!: Menu;
  @Output() toggleTheme = new EventEmitter<void>();
  @Output() notificationClick = new EventEmitter<void>();
  @Output() avatarClick = new EventEmitter<void>();

  status = 'All systems operational';
  searchQuery = '';
  currentTenant = 'Acme Industrial';
  tenants = [
    { label: 'Acme Industrial', value: 'Acme Industrial' },
    { label: 'Tech Corp', value: 'Tech Corp' },
    { label: 'Global Systems', value: 'Global Systems' }
  ];

  avatarMenuItems = [
    { label: 'Profile', icon: 'pi pi-user', command: () => this.onProfileClick() },
    { label: 'Sign Out', icon: 'pi pi-sign-out', command: () => this.onSignOut() }
  ];

  onThemeToggle(): void {
    this.toggleTheme.emit();
  }

  onNotificationClick(): void {
    this.notificationClick.emit();
  }

  onAvatarClick(event: Event): void {
    this.avatarMenu.toggle(event);
  }

  onProfileClick(): void {
    console.log('Profile clicked');
  }

  onSignOut(): void {
    console.log('Sign out clicked');
  }
}
