import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PromptService, Prompt } from '../../services/prompt.service';

@Component({
  selector: 'app-prompt-list',
  templateUrl: './prompt-list.component.html',
  styleUrls: ['./prompt-list.component.css']
})
export class PromptListComponent implements OnInit {
  prompts: Prompt[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private promptService: PromptService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPrompts();
  }

  /**
   * Load all prompts from backend
   */
  loadPrompts(): void {
    this.loading = true;
    this.error = null;

    this.promptService.getPrompts().subscribe({
      next: (response) => {
        if (response.status === 'success' && response.data) {
          this.prompts = response.data;
        } else {
          this.error = 'Failed to load prompts';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error loading prompts: ' + (err.message || 'Unknown error');
        this.loading = false;
        console.error('Error loading prompts:', err);
      }
    });
  }

  /**
   * Navigate to prompt detail page
   */
  viewPrompt(id: number): void {
    this.router.navigate(['/prompts', id]);
  }

  /**
   * Get complexity color
   */
  getComplexityColor(complexity: number): string {
    if (complexity <= 3) return 'easy';
    if (complexity <= 7) return 'medium';
    return 'hard';
  }
}
