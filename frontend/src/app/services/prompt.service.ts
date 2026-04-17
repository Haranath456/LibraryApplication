import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Prompt {
  id: number;
  title: string;
  content?: string;
  complexity: number;
  created_at: string;
  view_count?: number;
}

export interface ApiResponse<T> {
  status: string;
  data?: T;
  message?: string;
  errors?: { [key: string]: string };
}

@Injectable({
  providedIn: 'root'
})
export class PromptService {
  private apiUrl = `${environment.apiUrl}/api/prompts`;

  constructor(private http: HttpClient) { }

  /**
   * Get all prompts
   */
  getPrompts(): Observable<ApiResponse<Prompt[]>> {
    return this.http.get<ApiResponse<Prompt[]>>(`${this.apiUrl}/`);
  }

  /**
   * Get prompt details by ID
   */
  getPrompt(id: number): Observable<ApiResponse<Prompt>> {
    return this.http.get<ApiResponse<Prompt>>(`${this.apiUrl}/${id}/`);
  }

  /**
   * Create new prompt
   */
  createPrompt(prompt: Omit<Prompt, 'id' | 'created_at' | 'view_count'>): Observable<ApiResponse<Prompt>> {
    return this.http.post<ApiResponse<Prompt>>(`${this.apiUrl}/`, prompt);
  }
}
