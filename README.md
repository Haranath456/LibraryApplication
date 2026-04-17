# AI Prompt Library

A production-ready full-stack application for storing, managing, and viewing AI image generation prompts.

## 🎯 Features

- **Browse Prompts**: View all stored AI prompts with quick preview
- **Prompt Details**: See full prompt content with view counter
- **Create Prompts**: Add new prompts with validation
- **Complexity Levels**: Rate prompts on a 1-10 complexity scale
- **View Counting**: Redis-powered view counter for each prompt
- **Responsive UI**: Clean, professional Angular frontend
- **RESTful API**: Django backend with proper error handling
- **Docker Deployment**: Complete containerization with docker-compose

## 🏗️ Architecture

```
AI Prompt Library
├── Backend (Django)
│   ├── Models: Prompt database schema
│   ├── API Views: REST endpoints with validation
│   ├── Redis Integration: View counter tracking
│   └── PostgreSQL: Data persistence
├── Frontend (Angular 14)
│   ├── Components: Reusable UI components
│   ├── Services: API communication layer
│   ├── Routing: Multi-page navigation
│   └── Reactive Forms: Input validation
└── Infrastructure
    ├── Docker Compose: Orchestration
    ├── PostgreSQL: Database
    └── Redis: Caching layer
```

## 📋 Tech Stack

### Backend
- **Framework**: Django 4.2
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Language**: Python 3.11
- **Server**: Gunicorn (can be added)

### Frontend
- **Framework**: Angular 14
- **Language**: TypeScript 4.7
- **HTTP Client**: Angular HttpClient
- **Forms**: Reactive Forms
- **Styling**: CSS3

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Architecture**: Microservices-ready

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Git

### Installation

1. **Clone the repository**
```bash
cd d:\Projects\LibraryApplication
```

2. **Create environment file**
```bash
cp .env.example .env
```

3. **Build and start services**
```bash
docker-compose up --build
```

This single command will:
- Build backend and frontend images
- Start PostgreSQL database
- Start Redis cache
- Run Django migrations automatically
- Start Django development server
- Build and serve Angular app

4. **Access the application**
- Frontend: http://localhost:4200
- Backend API: http://localhost:8000/api
- Database: localhost:5432

## 📚 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Endpoints

#### 1. List All Prompts
```http
GET /prompts/
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "title": "Cyberpunk City",
      "complexity": 7,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### 2. Create New Prompt
```http
POST /prompts/
Content-Type: application/json

{
  "title": "Prompt Title",
  "content": "Full prompt text with at least 20 characters",
  "complexity": 5
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "title": "Prompt Title",
    "content": "Full prompt text with at least 20 characters",
    "complexity": 5,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "status": "error",
  "errors": {
    "title": "Title must be at least 3 characters",
    "content": "Content must be at least 20 characters",
    "complexity": "Complexity must be between 1 and 10"
  }
}
```

#### 3. Get Prompt Details
```http
GET /prompts/<id>/
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "title": "Cyberpunk City",
    "content": "A vibrant cyberpunk city with neon lights...",
    "complexity": 7,
    "created_at": "2024-01-15T10:30:00Z",
    "view_count": 42
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "status": "error",
  "message": "Prompt not found"
}
```

## 🎨 UI Components

### Pages

#### 1. Prompt List Page (`/prompts`)
- Grid layout of all prompts
- Quick preview with title and complexity
- Click to view details
- Navigation to add prompt page

#### 2. Prompt Detail Page (`/prompts/:id`)
- Full prompt content display
- Complexity badge with color coding
- View counter (updated via Redis)
- Copy to clipboard button
- Created date
- Navigation back to list

#### 3. Add Prompt Form (`/add-prompt`)
- Reactive form with real-time validation
- Title input (3-255 characters)
- Content textarea (min 20 characters)
- Complexity slider (1-10)
- Character counters
- Error messages for each field
- Success notification after creation
- Form reset button

## 🔧 Configuration

### Environment Variables

Create `.env` file in the root directory:

```env
# Debug mode (set to False in production)
DEBUG=True

# Django secret key (CHANGE IN PRODUCTION)
SECRET_KEY=your-super-secret-key-change-in-production

# Database
DB_NAME=prompt_library
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=postgres
DB_PORT=5432

# Redis
REDIS_URL=redis://redis:6379/0
```

### Backend Configuration

Located in `backend/config/settings.py`:

- **INSTALLED_APPS**: Core Django + prompts app
- **MIDDLEWARE**: Security and CORS handling
- **DATABASES**: PostgreSQL connection
- **CORS_ALLOWED_ORIGINS**: Configure for your deployment

### Frontend Configuration

Located in `frontend/src/environments/`:
- `environment.ts`: Development (localhost:8000)
- `environment.prod.ts`: Production (backend:8000)

## 🗄️ Database Schema

### Prompt Model

```sql
CREATE TABLE prompts_prompt (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  complexity INT DEFAULT 5,
  created_at TIMESTAMP AUTO_NOW_ADD,
  INDEX idx_created_at (created_at),
  INDEX idx_complexity (complexity)
);
```

### Redis Keys

```
prompt:<id>:views    -> Integer (view count)
```

## 🔄 Redis Integration

The application uses Redis for view counting:

1. **On prompt detail view**:
   - Backend increments key: `prompt:<id>:views`
   - Returns current count in API response

2. **Key Features**:
   - Atomic increment operation
   - Persistent across requests
   - Automatic key creation
   - No expiration (always tracked)

## 🐳 Docker Compose Services

### PostgreSQL
- **Image**: postgres:15-alpine
- **Port**: 5432
- **Volume**: `postgres_data`
- **Health Check**: Enabled

### Redis
- **Image**: redis:7-alpine
- **Port**: 6379
- **Volume**: `redis_data`
- **Health Check**: Enabled

### Backend
- **Build**: From `backend/Dockerfile`
- **Port**: 8000
- **Environment**: DB and Redis config
- **Dependencies**: Waits for postgres and redis
- **Volume**: `./backend` (for development)

### Frontend
- **Build**: From `frontend/Dockerfile`
- **Port**: 4200
- **Build Strategy**: Multi-stage (builder + production)
- **Proxy**: Routes API calls to backend

## 🧪 Testing the Application

### Test Creating a Prompt

1. Navigate to http://localhost:4200/add-prompt
2. Fill in the form:
   - Title: "Beautiful Landscape"
   - Content: "A serene mountain landscape with snow-covered peaks, pristine lake reflecting the sky, surrounded by dense forest, golden hour lighting, cinematic composition, ultra-detailed"
   - Complexity: 7
3. Click "Create Prompt"
4. Should be redirected to the detail page

### Test View Counter

1. Open a prompt detail page
2. Look at the "Views" counter
3. Refresh the page
4. Counter should increment by 1 each time

### Test API Directly

**Using curl:**
```bash
# Get all prompts
curl http://localhost:8000/api/prompts/

# Create a prompt
curl -X POST http://localhost:8000/api/prompts/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Prompt",
    "content": "This is a test prompt with at least twenty characters",
    "complexity": 5
  }'

# Get prompt details
curl http://localhost:8000/api/prompts/1/
```

## 📦 File Structure

```
LibraryApplication/
├── backend/
│   ├── config/
│   │   ├── __init__.py
│   │   ├── settings.py          # Django configuration
│   │   ├── urls.py              # URL routing
│   │   └── wsgi.py              # WSGI configuration
│   ├── prompts/
│   │   ├── __init__.py
│   │   ├── admin.py             # Django admin config
│   │   ├── apps.py              # App configuration
│   │   ├── models.py            # Prompt model (✅ VIEW COUNTER in Redis)
│   │   ├── views.py             # API endpoints ✅ REDIS INTEGRATION
│   │   ├── urls.py              # API routes
│   ├── manage.py                # Django management
│   ├── requirements.txt         # Python dependencies
│   ├── Dockerfile              # Backend container
│   ├── .dockerignore
│   ├── .env.example
│   └── entrypoint.sh
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── prompt-list/           # ✅ Browse prompts
│   │   │   │   ├── prompt-detail/         # ✅ View with counter
│   │   │   │   └── prompt-form/           # ✅ Create prompts
│   │   │   ├── services/
│   │   │   │   └── prompt.service.ts      # API communication
│   │   │   ├── app.module.ts              # Root module
│   │   │   ├── app-routing.module.ts      # Routing config
│   │   │   ├── app.component.ts/html/css
│   │   │   └── ...
│   │   ├── environments/
│   │   │   ├── environment.ts
│   │   │   └── environment.prod.ts
│   │   ├── assets/
│   │   ├── index.html
│   │   ├── main.ts
│   │   ├── polyfills.ts
│   │   ├── styles.css
│   │   └── ...
│   ├── package.json
│   ├── angular.json
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── Dockerfile
│   ├── .dockerignore
│   └── .gitkeep
├── docker-compose.yml          # Service orchestration
├── .env.example               # Environment template
└── README.md                   # This file
```

## 🚀 Deployment

### Local Development
```bash
docker-compose up --build
```

### Production Deployment

1. **Set environment variables**:
```bash
cp .env.example .env
# Edit .env with production values
DEBUG=False
SECRET_KEY=generate-random-key
DB_PASSWORD=strong-password
```

2. **Use production Dockerfile**:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

3. **Migrate database**:
```bash
docker-compose exec backend python manage.py migrate
```

4. **Create superuser** (optional):
```bash
docker-compose exec backend python manage.py createsuperuser
```

## 🔐 Security Considerations

- **DEBUG=False** in production
- **Strong SECRET_KEY** in production
- **Strong DB passwords**
- **HTTPS** in production (use reverse proxy like Nginx)
- **CORS configuration** should be specific to your domain
- **Validate all user input** (already implemented backend)
- **Use environment variables** for sensitive data
- **Regular security updates** for dependencies

## 🛠️ Troubleshooting

### Port Already in Use
```bash
# Kill process on port
# Windows: netstat -ano | findstr :8000
# Linux/Mac: lsof -i :8000
```

### Database Connection Error
```bash
# Check PostgreSQL is running
docker-compose ps

# Check logs
docker-compose logs postgres
```

### Redis Connection Error
```bash
# Check Redis is running
docker-compose logs redis

# Test Redis connection
docker-compose exec redis redis-cli ping
```

### Migration Issues
```bash
# Run migrations manually
docker-compose exec backend python manage.py migrate

# Create a new migration
docker-compose exec backend python manage.py makemigrations
```

### Frontend Not Loading
```bash
# Check frontend build
docker-compose logs frontend

# Rebuild frontend
docker-compose build --no-cache frontend
```

## 📝 Code Quality

- ✅ Clean, readable code structure
- ✅ Modular component architecture
- ✅ Comprehensive error handling
- ✅ Input validation (frontend + backend)
- ✅ Responsive UI design
- ✅ Proper separation of concerns
- ✅ Comments for complex logic
- ✅ Type-safe TypeScript
- ✅ RESTful API design

## 📚 Additional Features (Bonus)

The application is built to support future enhancements:

### JWT Authentication (Ready to Add)
- Backend: Add `djangorestframework-simplejwt`
- Views: Protect POST endpoints with `@login_required` decorator
- Frontend: Add JWT token to requests in HttpClient interceptor

### Tags/Categories (Ready to Add)
- Model: `Tag` with ManyToMany relation
- Admin: Inline tag editing
- Filter: `GET /prompts/?tags=anime,cyberpunk`
- Frontend: Tag filter component

### Advanced Filtering
- By complexity: `?complexity=7`
- By date range: `?created_after=2024-01-01`
- Search: `?search=cyberpunk`

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is provided as-is for educational and commercial use.

## 🎓 Learning Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Angular Documentation](https://angular.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)
- [Docker Documentation](https://docs.docker.com/)

## ✅ Verification Checklist

- [x] Backend Django models created
- [x] API endpoints implemented (GET list, POST create, GET detail)
- [x] Redis view counter integrated
- [x] PostgreSQL database configured
- [x] Input validation on backend
- [x] Angular components created (list, detail, form)
- [x] Reactive forms with validation
- [x] Service for API communication
- [x] Routing configured
- [x] Responsive UI with CSS
- [x] Backend Dockerfile
- [x] Frontend Dockerfile
- [x] docker-compose.yml with all services
- [x] Environment configuration
- [x] Complete documentation

## 🎉 You're all set!

Your AI Prompt Library is ready to go. Run `docker-compose up --build` and start managing your prompts!

For issues or questions, check the Troubleshooting section or review the API documentation.

---

**Built with ❤️ using Django, Angular, PostgreSQL, and Redis**
