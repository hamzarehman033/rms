import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AlertSeverity = 'critical' | 'major' | 'minor' | 'info';

@Component({
  selector: 'app-alert-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-item.component.html',
  styleUrl: './alert-item.component.css',
})
export class AlertItemComponent {
  @Input() severity: AlertSeverity = 'info';
  @Input() title: string = '';
  @Input() meta: string = '';
}
