@echo off
REM Quick start script for Windows

echo 🚀 Starting AI Prompt Library...
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed. Please install Docker Desktop.
    pause
    exit /b 1
)

REM Create .env if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file from example...
    copy .env.example .env
    echo ✅ .env file created. Please review and update if needed.
)

echo.
echo 🐳 Building and starting services...
echo.

REM Start services
docker-compose up --build

echo.
echo 🎉 Application is running!
echo.
echo 📱 Frontend: http://localhost:4200
echo 🔌 Backend API: http://localhost:8000/api
echo 🗄️ Database: localhost:5432
echo ⚡ Redis: localhost:6379
