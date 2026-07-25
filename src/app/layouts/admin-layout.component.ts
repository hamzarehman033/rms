import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { SidebarComponent, TopbarComponent } from '@app/shared';
import { ThemeService } from '../core/services/theme.service';
import { CustomerService } from '../core/services/customer.service';
import { DevicesService } from '../core/services/devices.service';
import { SignalrService } from '../core/services/signalr.service';
import { SitesStreamStateService } from '../core/services/sites-stream-state.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
})
export class AdminLayoutComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly themeService: ThemeService,
    private readonly customerService: CustomerService,
    private readonly devicesService: DevicesService,
    private readonly signalrService: SignalrService,
    private readonly sitesStreamStateService: SitesStreamStateService,
  ) {
    this.themeService.initializeTheme();
  }

  ngOnInit(): void {
    this.customerService.activeCustomer$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        void this.connectAllDevices();
      });
  }

  private async connectAllDevices(): Promise<void> {
    try {
      await this.signalrService.start();

      const response = await firstValueFrom(this.devicesService.getDevices());
      const deviceIds = response.data?.pageData.map((device: any) => device.id);
      await this.signalrService.subscribeToDevices(deviceIds);
    } catch (error) {
      console.error('[AdminLayout] Failed to auto-connect devices', error);
    }
  }
  onToggleTheme(): void {
    this.themeService.toggleTheme();
  }

  onNotificationClick(): void {
    console.log('Notification clicked');
  }

  onAvatarClick(): void {
    console.log('Avatar clicked');
  }

  ngOnDestroy(): void {}
}
