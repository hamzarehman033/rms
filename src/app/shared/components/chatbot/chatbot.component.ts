import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatHistoryItem, ChatService } from '../../../core/services/chat.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css',
})
export class ChatbotComponent {
  @ViewChild('messageList') messageList?: ElementRef<HTMLDivElement>;

  isOpen = false;
  isLoading = false;
  draft = '';
  error = '';
  messages: ChatHistoryItem[] = [];

  constructor(private chatService: ChatService) {}

  toggle(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.scrollToBottom();
    }
  }

  onComposerKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  send(): void {
    const message = this.draft.trim();
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

  private readError(error: any): string {
    const message = "Failed to send message.";
    // const message = error?.error?.message;
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
