# Kanban Board Application

A full-stack Kanban board application for team project management.

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Zustand (State Management)
- Axios (HTTP Client)

### Backend
- Laravel 11
- PHP 8.2+
- PostgreSQL
- Laravel Sanctum (Authentication)

### DevOps
- Docker
- Docker Compose

## Project Structure

```
project/
├── frontend/               # React application
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── services/      # API services
│   │   └── store/         # Zustand stores
│   └── package.json
│
├── backend/               # Laravel API
│   ├── app/
│   │   ├── Models/        # Database models
│   │   └── Http/Controllers/Api/  # API controllers
│   ├── database/
│   │   └── migrations/    # Database migrations
│   ├── routes/
│   │   └── api.php        # API routes
│   └── composer.json
│
└── docker-compose.yml     # Docker configuration
```

## Quick Start

### Using Docker Compose

```bash
docker-compose up
```

Then:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api
- Database: localhost:5432

### Manual Setup

#### Backend
```bash
cd backend
cp .env.example .env
composer install
php artisan migrate
php artisan serve
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Features

1. **Authentication**
   - User registration and login

2. **Board Management**
   - Create and manage boards
   - Invite team members

3. **Columns**
   - Create and manage columns
   - Rename columns

4. **Tasks**
   - Create and manage tasks
   - Drag-and-drop reordering
   - Assign members to tasks
   - Add tags to tasks

5. **Collaboration**
   - Invite members to boards
   - Real-time updates
   - Member assignment tracking

## Environment Variables

### Backend (.env)
```
APP_NAME="Kanban Board"
APP_ENV=local
APP_DEBUG=true
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=kanban_board
DB_USERNAME=postgres
DB_PASSWORD=password
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:8000/api
```

## Development

### Running Tests
```bash
cd backend
php artisan test
```

### Building for Production
```bash
cd frontend
npm run build
```

## API Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

Tokens are obtained from the login endpoint and should be stored in localStorage on the client.

## Database

PostgreSQL is used for data persistence. The database is automatically created and migrations are run on startup.

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT
