import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PromptService, Prompt } from '../../services/prompt.service';

@Component({
  selector: 'app-prompt-detail',
  templateUrl: './prompt-detail.component.html',
  styleUrls: ['./prompt-detail.component.css']
})
export class PromptDetailComponent implements OnInit {
  prompt: Prompt | null = null;
  loading = true;
  error: string | null = null;
  promptId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private promptService: PromptService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.promptId = +params['id'];
      this.loadPromptDetail();
    });
  }

  /**
   * Load prompt detail from backend
   */
  loadPromptDetail(): void {
    this.loading = true;
    this.error = null;

    this.promptService.getPrompt(this.promptId).subscribe({
      next: (response) => {
        if (response.status === 'success' && response.data) {
          this.prompt = response.data;
        } else {
          this.error = 'Failed to load prompt';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error loading prompt: ' + (err.message || 'Unknown error');
        this.loading = false;
        console.error('Error loading prompt:', err);
      }
    });
  }

  /**
   * Go back to list
   */
  goBack(): void {
    this.router.navigate(['/prompts']);
  }

  /**
   * Copy content to clipboard
   */
  copyToClipboard(): void {
    if (this.prompt?.content) {
      navigator.clipboard.writeText(this.prompt.content).then(() => {
        alert('Prompt copied to clipboard!');
      });
    }
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
