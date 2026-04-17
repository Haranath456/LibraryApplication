@echo off
REM Script to stop all services on Windows

echo 🛑 Stopping AI Prompt Library services...
docker-compose down -v
echo ✅ Services stopped and volumes removed.
pause
