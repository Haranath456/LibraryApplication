# AI Prompt Library - Setup Guide

## 📋 Prerequisites

- Docker Desktop (includes Docker and Docker Compose)
- Git
- 4GB RAM minimum (8GB recommended)
- 10GB free disk space

## 🚀 Installation Steps

### Step 1: Clone/Download the Project

```bash
cd d:\Projects\LibraryApplication
```

### Step 2: Create Environment File

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` and change passwords for production:
- `DB_PASSWORD`: PostgreSQL password
- `SECRET_KEY`: Django secret key (generate a random string)

### Step 3: Start the Application

#### On Windows:
```bash
start.bat
```

#### On Mac/Linux:
```bash
bash start.sh
```

Or manually:
```bash
docker-compose up --build
```

### Step 4: Wait for Services

The application will:
1. Build backend Docker image
2. Build frontend Docker image
3. Start PostgreSQL
4. Start Redis
5. Run Django migrations automatically
6. Start Django server
7. Build Angular app
8. Serve Angular app

**This takes 2-3 minutes on first run.**

### Step 5: Access the Application

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8000/api/prompts/
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## 🧪 First-Time Testing

1. Open http://localhost:4200 in your browser
2. Click "Add Prompt" navigation link
3. Fill in the form:
   - Title: "My First Prompt"
   - Content: "This is a detailed description of an AI image prompt with at least 20 characters"
   - Complexity: 5
4. Click "Create Prompt"
5. View the newly created prompt
6. Refresh the page to see the view count increment

## 🛑 Stopping the Application

#### On Windows:
```bash
stop.bat
```

#### On Mac/Linux:
```bash
bash stop.sh
```

Or manually:
```bash
docker-compose down -v
```

## 🔧 Useful Commands

### View Logs
```bash
docker-compose logs -f
```

### View Specific Service Logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
docker-compose logs -f redis
```

### Run Django Migrations
```bash
docker-compose exec backend python manage.py migrate
```

### Create Superuser for Admin
```bash
docker-compose exec backend python manage.py createsuperuser
```

### Access Django Shell
```bash
docker-compose exec backend python manage.py shell
```

### Access Django Admin
After creating superuser: http://localhost:8000/admin

### Database Shell
```bash
docker-compose exec postgres psql -U postgres -d prompt_library
```

### Redis CLI
```bash
docker-compose exec redis redis-cli
```

### View Container Status
```bash
docker-compose ps
```

## 📊 Database Inspection

### Access PostgreSQL
```bash
docker-compose exec postgres psql -U postgres -d prompt_library

# View tables
\dt

# Query prompts
SELECT * FROM prompts_prompt;

# Exit
\q
```

### Check Redis
```bash
docker-compose exec redis redis-cli

# View all keys
KEYS *

# Check view count for prompt ID 1
GET prompt:1:views

# Exit
QUIT
```

## 🔒 Security Notes

**For Development:**
- `.env.example` has example values
- DEBUG mode is enabled
- Secret key is insecure

**For Production:**
- Copy and secure `.env` file
- Generate strong SECRET_KEY
- Set `DEBUG=False`
- Use strong database password
- Configure ALLOWED_HOSTS
- Use HTTPS/TLS

## ⚠️ Troubleshooting

### "Port 5432 already in use"
```bash
# Find and kill process on port 5432
netstat -ano | findstr :5432
taskkill /PID <PID> /F
```

### "Cannot connect to Docker daemon"
- Ensure Docker Desktop is running
- On Windows, check if WSL2 is installed (required for Docker Desktop)

### "Build failed: npm not found"
- This is inside the container - shouldn't happen
- Try rebuilding: `docker-compose build --no-cache frontend`

### "Database won't start"
```bash
# Remove old volumes
docker-compose down -v

# Start fresh
docker-compose up --build
```

### Frontend shows "Cannot GET /"
- Wait 30 seconds for Angular build to complete
- Check frontend logs: `docker-compose logs -f frontend`

### API returns 500 error
```bash
# Check backend logs
docker-compose logs -f backend

# Check database connection
docker-compose logs -f postgres
```

## 📚 File Structure Reference

```
d:\Projects\LibraryApplication\
├── backend/                    # Django backend
│   ├── config/                 # Django config
│   ├── prompts//               # Prompts app
│   ├── manage.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/                   # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   ├── environments/
│   │   └── assets/
│   ├── package.json
│   ├── angular.json
│   └── Dockerfile
├── docker-compose.yml         # Service orchestration
├── .env.example              # Environment template
├── README.md                 # Full documentation
├── start.sh / start.bat      # Quick start scripts
├── stop.sh / stop.bat        # Stop scripts
└── SETUP_GUIDE.md           # This file
```

## ✅ Verification Checklist

After running `docker-compose up --build`, verify:

- [ ] Frontend loads at http://localhost:4200
- [ ] Navigation shows "Browse Prompts" and "Add Prompt"
- [ ] Can navigate to add prompt form
- [ ] Form validates input correctly
- [ ] Can create a prompt
- [ ] Created prompt appears in list
- [ ] Can click prompt to view details
- [ ] Page shows view count
- [ ] Refreshing increments view count
- [ ] Backend API is accessible at http://localhost:8000/api/prompts/

## 🆘 Getting Help

### Check the Logs
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
docker-compose logs redis
```

### Review Documentation
- [README.md](README.md) - Complete documentation
- Backend: [backend/README.md](backend/README.md) - Backend documentation
- Frontend: [frontend/README.md](frontend/README.md) - Frontend documentation

### API Testing
Use curl or Postman to test endpoints:
```bash
# List prompts
curl http://localhost:8000/api/prompts/

# Get specific prompt
curl http://localhost:8000/api/prompts/1/

# Create prompt
curl -X POST http://localhost:8000/api/prompts/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Long enough content for testing","complexity":5}'
```

## 📝 Next Steps

1. **Explore the Application**: Navigate through all pages
2. **Create Sample Data**: Add several test prompts
3. **Review Code**: Check component and service implementations
4. **Customize**: Modify styling or add new features
5. **Deploy**: Follow production deployment guide in README.md

---

**All set! Enjoy managing your AI prompts! 🎉**
