#!/bin/bash
# Quick start script for development

echo "🚀 Starting AI Prompt Library..."
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from example..."
    cp .env.example .env
    echo "✅ .env file created. Please review and update if needed."
fi

echo ""
echo "🐳 Building and starting services..."
echo ""

# Start services
docker-compose up --build

echo ""
echo "🎉 Application is running!"
echo ""
echo "📱 Frontend: http://localhost:4200"
echo "🔌 Backend API: http://localhost:8000/api"
echo "🗄️  Database: localhost:5432"
echo "⚡ Redis: localhost:6379"
