import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.css',
})
export class StatCardComponent {
  @Input() label: string = '';
  @Input() value: string = '';
  @Input() hint: string = '';
  @Input() delta?: string;
  @Input() icon?: string;
  @Input() iconColor: 'primary' | 'success' | 'warning' | 'info' | 'error' = 'primary';

  get isDeltaUp(): boolean {
    return !this.delta?.startsWith('-');
  }
}
