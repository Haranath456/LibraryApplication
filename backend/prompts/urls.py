"""
URL routing for prompts API.
"""

from django.urls import path
from prompts import views

urlpatterns = [
    path('prompts/', views.prompt_list, name='prompt-list'),
    path('prompts/<int:prompt_id>/', views.prompt_detail, name='prompt-detail'),
    path('prompts/', views.cors_preflight, name='cors-preflight'),
]
