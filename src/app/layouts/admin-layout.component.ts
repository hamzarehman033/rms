import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent, TopbarComponent } from '@app/shared';
import { ThemeService } from '../core/services/theme.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
})
export class AdminLayoutComponent {
  constructor(private readonly themeService: ThemeService) {
    this.themeService.initializeTheme();
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
}
