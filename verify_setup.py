#!/usr/bin/env python
"""
Quick check script to verify application integrity.
Run this to ensure all files are in place before starting.
"""

import os
import sys

def check_files():
    """Check if all required files exist."""
    
    required_files = {
        'Backend': [
            'backend/manage.py',
            'backend/requirements.txt',
            'backend/config/settings.py',
            'backend/config/urls.py',
            'backend/prompts/models.py',
            'backend/prompts/views.py',
            'backend/prompts/urls.py',
            'backend/Dockerfile',
        ],
        'Frontend': [
            'frontend/package.json',
            'frontend/angular.json',
            'frontend/src/main.ts',
            'frontend/src/app/app.module.ts',
            'frontend/src/app/app-routing.module.ts',
            'frontend/src/app/services/prompt.service.ts',
            'frontend/Dockerfile',
        ],
        'Docker & Config': [
            'docker-compose.yml',
            '.env.example',
            '.gitignore',
        ],
        'Documentation': [
            'README.md',
            'SETUP_GUIDE.md',
        ]
    }
    
    all_good = True
    
    for category, files in required_files.items():
        print(f"\n✓ Checking {category}:")
        for file_path in files:
            if os.path.exists(file_path):
                print(f"  ✅ {file_path}")
            else:
                print(f"  ❌ {file_path} - MISSING!")
                all_good = False
    
    print("\n" + "="*60)
    if all_good:
        print("✅ All files present! Ready to start.")
        print("\nNext step: docker-compose up --build")
        return 0
    else:
        print("❌ Some files are missing!")
        print("\nPlease ensure all files are created correctly.")
        return 1

if __name__ == '__main__':
    sys.exit(check_files())
