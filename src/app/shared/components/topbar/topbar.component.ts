import { Component, DestroyRef, EventEmitter, OnInit, Output, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule, Menu } from 'primeng/menu';
import { AuthService } from '../../../core/services/auth.service';
import { CustomerService } from '../../../core/services/customer.service';
import { DevicesService } from '../../../core/services/devices.service';
import { SignalrService } from '../../../core/services/signalr.service';
import { DecodedPayload, DeviceDataEvent } from '../../../core/constants/device-message.model';
import { AppRole } from '../../../core/constants/roles';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, FormsModule, AutoCompleteModule, DropdownModule, MenuModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css',
})
export class TopbarComponent implements OnInit {
  @ViewChild('avatarMenu') avatarMenu!: Menu;
  @Output() toggleTheme = new EventEmitter<void>();
  @Output() notificationClick = new EventEmitter<void>();
  @Output() avatarClick = new EventEmitter<void>();
  private readonly destroyRef = inject(DestroyRef);
  private readonly deviceLabelById = new Map<number, string>();

  constructor(
    private router: Router,
    private authService: AuthService,
    private customerService: CustomerService,
    private devicesService: DevicesService,
    private signalrService: SignalrService
  ) {}

  showNotifications = false;
  status = 'All systems operational';
  isSocketConnected = false;
  devices: any[] = [];
  selectedDevice: any = null;
  filteredDevices: Array<{ id: string; name: string; code: string }> = [];
  showCustomerSelector = false;
  selectedCustomerId: string | null = null;
  customers: Array<{ label: string; value: string }> = [];
  notifications: any[] = [];

  avatarMenuItems = [
    { label: 'Profile', icon: 'pi pi-user', command: () => this.onProfileClick() },
    { label: 'Sign Out', icon: 'pi pi-sign-out', command: () => this.onSignOut() }
  ];

  ngOnInit(): void {
    this.showCustomerSelector = this.authService.hasAnyRole([AppRole.SysAdmin, AppRole.Manager]);

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
        this.devices = [];
        this.filteredDevices = [];
        this.notifications = [];
        this.deviceLabelById.clear();
        if (activeCustomer?.id) {
          this.loadDevices();
        }
      });

    this.signalrService.isConnected$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isConnected) => {
        this.isSocketConnected = isConnected;
        this.status = isConnected ? 'All systems operational' : 'Connection disconnected';
      });

    this.signalrService.onDeviceData$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => this.onDeviceData(event));
  }

  filterDevices(event: { query: string }): any[] {
    const query = event.query.toLowerCase();
    return this.filteredDevices = this.devices.filter(device =>
      device.name.toLowerCase().includes(query) ||
      device.code.toLowerCase().includes(query)
    );
  }

  onDeviceSelect(event: { value: { id: string } }): void {
    const id = event.value?.id;
    if (id) {
      this.router.navigate(['/site-dashboard', id]);
      this.selectedDevice = null;
    }
  }

  private loadDevices(): void {
    this.devicesService.getDevices()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(response => {
        this.devices = response?.data?.pageData || [];
        this.filteredDevices = this.devices;
      });
  }

  private onDeviceData(event: DeviceDataEvent | null): void {
    if (!event?.decodedPayload) {
      return;
      
    }
    const payload = event.decodedPayload;
    const alarmSlots = [
      { code: payload.alarm1Code, level: payload.alarm1Level },
      { code: payload.alarm2Code, level: payload.alarm2Level },
      { code: payload.alarm3Code, level: payload.alarm3Level },
      { code: payload.alarm4Code, level: payload.alarm4Level },
      { code: payload.alarm5Code, level: payload.alarm5Level },
      { code: payload.alarm6Code, level: payload.alarm6Level },
    ];

    alarmSlots
      .filter(slot => !!slot.code && slot.level !== 'None' && slot.code !== 'No alarm in this slot')
      .forEach((slot, index) => {
        this.notifications.push({
          id: `${payload.deviceId}-${index + 1}-${slot.code}`,
          message: slot.code,
          severity: slot.level,
          device: payload.deviceId,
        });
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

  onAcknowledgeAlert(notification: { id: string }): void {
    this.notifications = this.notifications.filter(n => n.id !== notification.id);
  }

  onDismissAlert(notification: { id: string }): void {
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
