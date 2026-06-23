import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent, TopbarComponent } from '@app/shared';
import { ThemeService } from '../core/services/theme.service';
import { DevicesService } from '../core/services/devices.service';
import { SignalrService } from '../core/services/signalr.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  private subscribedDeviceIds: number[] = [];

  constructor(
    private readonly themeService: ThemeService,
    private readonly devicesService: DevicesService,
    private readonly signalrService: SignalrService,
  ) {
    this.themeService.initializeTheme();
  }

  ngOnInit(): void {
    this.initializeDeviceSubscriptions();
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

  private async initializeDeviceSubscriptions(): Promise<void> {
    const devicesResponse = await firstValueFrom(this.devicesService.getDevices());
    this.subscribedDeviceIds = devicesResponse.data.pageData?.map((device: any) => device.id).filter((id: any) => id !== undefined) || [];
    await this.signalrService.subscribeToDevices(this.subscribedDeviceIds);
  }

   async ngOnDestroy(): Promise<void> {
    if (!this.subscribedDeviceIds.length) return;
    await this.signalrService.unsubscribeFromDevices(this.subscribedDeviceIds);
    this.subscribedDeviceIds = [];
  }
}
