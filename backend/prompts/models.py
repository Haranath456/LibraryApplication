"""
Prompt Model - stores AI image generation prompts.
"""

from django.db import models


class Prompt(models.Model):
    """
    Model representing an AI image generation prompt.
    
    Attributes:
        id: Auto-generated primary key
        title: Brief title of the prompt (min 3 characters)
        content: Full prompt text (min 20 characters)
        complexity: Complexity level from 1-10
        created_at: Timestamp when prompt was created
    """
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    content = models.TextField()
    complexity = models.IntegerField(default=5)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return self.title
