import { Component, DestroyRef, EventEmitter, OnInit, Output, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule, Menu } from 'primeng/menu';
import { AuthService } from '../../../core/services/auth.service';
import { CustomerService } from '../../../core/services/customer.service';
import { SignalrService } from '../../../core/services/signalr.service';
import { AppRole } from '../../../core/constants/roles';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, MenuModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css',
})
export class TopbarComponent implements OnInit {
  @ViewChild('avatarMenu') avatarMenu!: Menu;
  @Output() toggleTheme = new EventEmitter<void>();
  @Output() notificationClick = new EventEmitter<void>();
  @Output() avatarClick = new EventEmitter<void>();
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private router: Router,
    private authService: AuthService,
    private customerService: CustomerService,
    private signalrService: SignalrService
  ) {}
  showNotifications = false;

  status = 'All systems operational';
  isSocketConnected = false;
  searchQuery = '';
  showCustomerSelector = false;
  selectedCustomerId: string | null = null;
  customers: Array<{ label: string; value: string }> = [];

  notifications = [
    { id: 'ALR-104', message: 'Temperature exceeds threshold', severity: 'critical', device: 'DV-003', time: '2m ago' },
    { id: 'ALR-103', message: 'Device offline > 1h', severity: 'major', device: 'DV-006', time: '1h ago' },
    { id: 'ALR-102', message: 'Battery below 30%', severity: 'minor', device: 'DV-009', time: '12m ago' }
  ];

  avatarMenuItems = [
    { label: 'Profile', icon: 'pi pi-user', command: () => this.onProfileClick() },
    { label: 'Sign Out', icon: 'pi pi-sign-out', command: () => this.onSignOut() }
  ];

  ngOnInit(): void {
    this.showCustomerSelector = this.authService.hasAnyRole([AppRole.SysAdmin]);

    this.customerService.customers$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(items => {
        this.customers = items.map(item => ({
          label: item.name,
          value: item.id,
        }));
      });

    this.customerService.activeCustomer$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(activeCustomer => {
        this.selectedCustomerId = activeCustomer?.id ?? null;
      });

    this.signalrService.isConnected$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isConnected) => {
        this.isSocketConnected = isConnected;
        this.status = isConnected ? 'All systems operational' : 'Socket disconnected';
      });
  }

  onCustomerChange(customerId: string | null): void {
    if (!customerId) {
      return;
    }

    this.customerService.setActiveCustomerById(customerId);
  }

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
