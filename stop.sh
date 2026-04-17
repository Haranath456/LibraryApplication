#!/bin/bash
# Script to stop all services

echo "🛑 Stopping AI Prompt Library services..."
docker-compose down -v
echo "✅ Services stopped and volumes removed."
