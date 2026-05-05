import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule, Menu } from 'primeng/menu';
import { AuthService } from '../../../core/services/auth.service';

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

  constructor(private router: Router, private authService: AuthService) {}
  showNotifications = false;

  status = 'All systems operational';
  searchQuery = '';
  currentTenant = 'Acme Industrial';
  tenants = [
    { label: 'Acme Industrial', value: 'Acme Industrial' },
    { label: 'Tech Corp', value: 'Tech Corp' },
    { label: 'Global Systems', value: 'Global Systems' }
  ];

  notifications = [
    { id: 'ALR-104', message: 'Temperature exceeds threshold', severity: 'critical', device: 'DV-003', time: '2m ago' },
    { id: 'ALR-103', message: 'Device offline > 1h', severity: 'major', device: 'DV-006', time: '1h ago' },
    { id: 'ALR-102', message: 'Battery below 30%', severity: 'minor', device: 'DV-009', time: '12m ago' }
  ];

  avatarMenuItems = [
    // { label: 'Profile', icon: 'pi pi-user', command: () => this.onProfileClick() },
    { label: 'Sign Out', icon: 'pi pi-sign-out', command: () => this.onSignOut() }
  ];

  onThemeToggle(): void {
    this.toggleTheme.emit();
  }

  onNotificationClick(): void {
    this.notificationClick.emit();
  }

  onNotificationMenuToggle(event: Event): void {
    this.showNotifications = !this.showNotifications;
  }

  onAcknowledgeAlert(notification: any): void {
    console.log('Alert acknowledged:', notification.id);
    this.notifications = this.notifications.filter(n => n.id !== notification.id);
  }

  onDismissAlert(notification: any): void {
    console.log('Alert dismissed:', notification.id);
    this.notifications = this.notifications.filter(n => n.id !== notification.id);
  }
  onViewAllAlerts(): void {
    this.showNotifications = false;
    this.router.navigate(['/alarm']);
  }

  onAvatarClick(event: Event): void {
    this.avatarMenu.toggle(event);
  }

  onProfileClick(): void {
    this.router.navigate(['/profile']);
  }

  onSignOut(): void {
    this.authService.logout();
  }
}
