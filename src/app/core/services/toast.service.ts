import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

export interface ToastMessage {
  severity: 'success' | 'info' | 'warn' | 'error';
  summary: string;
  detail?: string;
  life?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private defaultLife = 3000; // Default duration for toasts
  constructor(private messageService: MessageService) {}

  /**
   * Show a success toast message
   * @param summary Main message text
   * @param detail Optional detailed message
   */
  showSuccess(summary: string, detail?: string): void {
    this.messageService.add({
      severity: 'success',
      summary: summary,
      detail: detail,
      life: this.defaultLife
    });
  }

  /**
   * Show an error toast message
   * @param summary Main message text
   * @param detail Optional detailed message
   */
  showError(summary: string, detail?: string): void {
    this.messageService.add({
      severity: 'error',
      summary: summary,
      detail: detail,
      life: this.defaultLife
    });
  }

  /**
   * Show an info toast message
   * @param summary Main message text
   * @param detail Optional detailed message
   */
  showInfo(summary: string, detail?: string): void {
    this.messageService.add({
      severity: 'info',
      summary: summary,
      detail: detail,
      life: this.defaultLife
    });
  }

  /**
   * Show a warning toast message
   * @param summary Main message text
   * @param detail Optional detailed message
   */
  showWarning(summary: string, detail?: string): void {
    this.messageService.add({
      severity: 'warn',
      summary: summary,
      detail: detail,
      life: this.defaultLife
    });
  }

  /**
   * Show a custom toast message
   * @param message Complete toast message object
   */
  show(message: ToastMessage): void {
    this.messageService.add({
      severity: message.severity,
      summary: message.summary,
      detail: message.detail,
      life: message.life ?? this.defaultLife
    });
  }

  /**
   * Clear all toast messages
   */
  clear(): void {
    this.messageService.clear();
  }
}
