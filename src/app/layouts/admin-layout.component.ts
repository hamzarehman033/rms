import { Component, OnDestroy, OnInit } from '@angular/core';
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
export class AdminLayoutComponent implements OnInit, OnDestroy {
  constructor(
    private readonly themeService: ThemeService,
  ) {
    this.themeService.initializeTheme();
  }

  ngOnInit(): void {}

 

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
