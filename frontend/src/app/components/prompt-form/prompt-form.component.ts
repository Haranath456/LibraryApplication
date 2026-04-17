import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PromptService } from '../../services/prompt.service';

@Component({
  selector: 'app-prompt-form',
  templateUrl: './prompt-form.component.html',
  styleUrls: ['./prompt-form.component.css']
})
export class PromptFormComponent {
  promptForm: FormGroup;
  submitted = false;
  loading = false;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private promptService: PromptService,
    private router: Router
  ) {
    this.promptForm = this.createForm();
  }

  /**
   * Create reactive form with validation
   */
  private createForm(): FormGroup {
    return this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(255)
        ]
      ],
      content: [
        '',
        [
          Validators.required,
          Validators.minLength(20)
        ]
      ],
      complexity: [
        5,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(10)
        ]
      ]
    });
  }

  /**
   * Get form controls for template access
   */
  get f() {
    return this.promptForm.controls;
  }

  /**
   * Check if form field is invalid and touched
   */
  isInvalid(fieldName: string): boolean {
    const control = this.promptForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched || this.submitted));
  }

  /**
   * Get error message for field
   */
  getErrorMessage(fieldName: string): string {
    const control = this.promptForm.get(fieldName);
    if (!control || !control.errors) return '';

    if (control.errors['required']) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (control.errors['minlength']) {
      const minLength = control.errors['minlength'].requiredLength;
      return `${fieldName} must be at least ${minLength} characters`;
    }
    if (control.errors['maxlength']) {
      const maxLength = control.errors['maxlength'].requiredLength;
      return `${fieldName} must not exceed ${maxLength} characters`;
    }
    if (control.errors['min']) {
      return `Complexity must be at least ${control.errors['min'].min}`;
    }
    if (control.errors['max']) {
      return `Complexity must not exceed ${control.errors['max'].max}`;
    }

    return 'Invalid input';
  }

  /**
   * Submit form
   */
  onSubmit(): void {
    this.submitted = true;
    this.error = null;
    this.successMessage = null;

    if (!this.promptForm.valid) {
      this.error = 'Please fix the errors in the form';
      return;
    }

    this.loading = true;

    const formData = {
      title: this.promptForm.value.title.trim(),
      content: this.promptForm.value.content.trim(),
      complexity: this.promptForm.value.complexity
    };

    this.promptService.createPrompt(formData).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.successMessage = 'Prompt created successfully!';
          this.promptForm.reset({ complexity: 5 });
          this.submitted = false;

          // Redirect to detail page after 1 second
          setTimeout(() => {
            this.router.navigate(['/prompts', response.data?.id]);
          }, 1000);
        } else {
          this.error = response.message || 'Failed to create prompt';
        }
        this.loading = false;
      },
      error: (err) => {
        if (err.error?.errors) {
          // Backend validation errors
          this.error = Object.values(err.error.errors).join(', ');
        } else {
          this.error = 'Error creating prompt: ' + (err.message || 'Unknown error');
        }
        this.loading = false;
        console.error('Error creating prompt:', err);
      }
    });
  }

  /**
   * Reset form
   */
  resetForm(): void {
    this.promptForm.reset({ complexity: 5 });
    this.submitted = false;
    this.error = null;
  }

  /**
   * Get current title length for display
   */
  getTitleLength(): number {
    return this.promptForm.get('title')?.value?.length || 0;
  }

  /**
   * Get current content length for display
   */
  getContentLength(): number {
    return this.promptForm.get('content')?.value?.length || 0;
  }

  /**
   * Get complexity color class based on value
   */
  getComplexityColor(value: number): string {
    if (value <= 3) return 'complexity-low';
    if (value <= 7) return 'complexity-medium';
    return 'complexity-high';
  }
}

