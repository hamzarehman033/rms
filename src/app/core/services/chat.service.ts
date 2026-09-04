import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ChatHistoryItem {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  message: string;
  history: ChatHistoryItem[];
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly url = environment.baseUrl + '/Chat';

  constructor(private http: HttpClient) {}

  send(payload: ChatRequest): Observable<any> {
    return this.http.post(this.url, payload);
  }
}
