#!/bin/bash
# Script to manage database

if [ "$1" == "migrate" ]; then
    echo "🔄 Running migrations..."
    docker-compose exec backend python manage.py migrate
elif [ "$1" == "makemigrations" ]; then
    echo "📝 Creating migrations..."
    docker-compose exec backend python manage.py makemigrations
elif [ "$1" == "sudo_user" ]; then
    echo "👤 Creating superuser..."
    docker-compose exec backend python manage.py createsuperuser
elif [ "$1" == "shell" ]; then
    echo "🐚 Opening Django shell..."
    docker-compose exec backend python manage.py shell
elif [ "$1" == "dbshell" ]; then
    echo "🗄️ Opening database shell..."
    docker-compose exec postgres psql -U postgres -d prompt_library
elif [ "$1" == "redis" ]; then
    echo "⚡ Opening Redis CLI..."
    docker-compose exec redis redis-cli
elif [ "$1" == "logs" ]; then
    echo "📋 Showing logs..."
    docker-compose logs -f
else
    echo "Usage: ./manage.sh [command]"
    echo ""
    echo "Available commands:"
    echo "  migrate          - Run database migrations"
    echo "  makemigrations   - Create new migrations"
    echo "  sudo_user        - Create superuser"
    echo "  shell            - Open Django shell"
    echo "  dbshell          - Open database shell"
    echo "  redis            - Open Redis CLI"
    echo "  logs             - Show service logs"
fi
