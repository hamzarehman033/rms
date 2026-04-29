import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css',
})
export class TopbarComponent {
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

  onThemeToggle(): void {
    this.toggleTheme.emit();
  }

  onNotificationClick(): void {
    this.notificationClick.emit();
  }

  onAvatarClick(): void {
    this.avatarClick.emit();
  }
}
