import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatHistoryItem, ChatService } from '../../../core/services/chat.service';
import { DevicesService } from '../../../core/services/devices.service';

interface ChatQuestion {
  text: string;
  needsDevice: boolean;
}

interface ChatDeviceOption {
  id: number;
  name: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css',
})
export class ChatbotComponent {
  @ViewChild('messageList') messageList?: ElementRef<HTMLDivElement>;

  readonly questions: ChatQuestion[] = [
    { text: 'What is this application?', needsDevice: false },
    { text: 'How do I add a device?', needsDevice: false },
    { text: 'How many devices are listed?', needsDevice: false },
    { text: 'How many devices are online?', needsDevice: false },
    { text: 'How do I add a location?', needsDevice: false },
    { text: 'How do I schedule an activity?', needsDevice: false },
    { text: 'How do I download reports?', needsDevice: false },
    { text: 'What is the status of a device?', needsDevice: true },
    { text: 'What are EHS and Security?', needsDevice: false },
    { text: 'What activities are scheduled today?', needsDevice: false }
  ];

  isOpen = false;
  isLoading = false;
  isLoadingDevices = false;
  draft = '';
  error = '';
  pendingQuestion: ChatQuestion | null = null;
  devices: ChatDeviceOption[] = [];
  messages: ChatHistoryItem[] = [];

  constructor(
    private chatService: ChatService,
    private devicesService: DevicesService
  ) {}

  toggle(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.scrollToBottom();
    }
  }

  selectQuestion(question: ChatQuestion): void {
    if (this.isLoading) {
      return;
    }

    if (!question.needsDevice) {
      this.send(question.text);
      return;
    }

    this.pendingQuestion = question;
    this.error = '';
    this.loadDevices();
  }

  selectDevice(device: ChatDeviceOption): void {
    if (!this.pendingQuestion || this.isLoading) {
      return;
    }

    const question = this.pendingQuestion.text;
    this.pendingQuestion = null;
    this.send(`${question} ${device.name}`);
  }

  send(question?: string): void {
    const message = (question ?? this.draft).trim();
    if (!message || this.isLoading) {
      return;
    }

    const history = this.messages.map(item => ({ role: item.role, content: item.content }));
    this.messages = [...this.messages, { role: 'user', content: message }];
    this.draft = '';
    this.error = '';
    this.isLoading = true;
    this.scrollToBottom();

    this.chatService.send({ message, history }).subscribe({
      next: (response: any) => {
        const answer = response?.data?.answer ?? '';
        if (answer) {
          this.messages = [...this.messages, { role: 'assistant', content: answer }];
        }
        this.isLoading = false;
        this.scrollToBottom();
      },
      error: (err: any) => {
        this.error = this.readError(err);
        this.isLoading = false;
      }
    });
  }

  private loadDevices(): void {
    if (this.devices.length) {
      return;
    }

    this.isLoadingDevices = true;
    this.devicesService.getDevices().subscribe({
      next: (response: any) => {
        const list = response?.data?.pageData || response?.data || response || [];
        const items = Array.isArray(list) ? list : [];
        this.devices = items
          .map((item: any) => {
            const id = Number(item?.id ?? item?.deviceId ?? item?.siteId);
            if (!Number.isFinite(id) || id <= 0) {
              return null;
            }
            const name = String(item?.siteName ?? item?.name ?? item?.deviceName ?? `Device ${id}`).trim();
            return { id, name };
          })
          .filter((item: ChatDeviceOption | null): item is ChatDeviceOption => !!item);
        this.isLoadingDevices = false;
      },
      error: () => {
        this.devices = [];
        this.isLoadingDevices = false;
        this.error = 'Failed to load devices.';
      }
    });
  }

  private readError(error: any): string {
    const message = error?.error?.message;
    if (Array.isArray(message) && message.length) {
      return message.join(' ');
    }
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
    return 'Failed to send message.';
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const el = this.messageList?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    });
  }
}
