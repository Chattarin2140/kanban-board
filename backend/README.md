# Kanban Board Backend

Laravel-based API backend for Kanban Board application with PostgreSQL.

## Setup

### Prerequisites
- PHP 8.2+
- PostgreSQL
- Composer

### Installation

```bash
cd backend
cp .env.example .env
composer install
php artisan migrate
php artisan serve
```

### Environment Variables

Copy `.env.example` to `.env` and update:

```
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=kanban_board
DB_USERNAME=postgres
DB_PASSWORD=password
```

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Board Endpoints

- `GET /api/boards` - List all boards
- `POST /api/boards` - Create new board
- `GET /api/boards/:id` - Get board details
- `PUT /api/boards/:id` - Update board
- `DELETE /api/boards/:id` - Delete board
- `POST /api/boards/:id/invite` - Invite member to board

### Column Endpoints

- `POST /api/boards/:boardId/columns` - Create column
- `PUT /api/boards/:boardId/columns/:id` - Update column
- `DELETE /api/boards/:boardId/columns/:id` - Delete column

### Task Endpoints

- `GET /api/boards/:boardId/tasks` - List tasks
- `POST /api/boards/:boardId/tasks` - Create task
- `PUT /api/boards/:boardId/tasks/:id` - Update task
- `DELETE /api/boards/:boardId/tasks/:id` - Delete task
- `POST /api/boards/:boardId/tasks/:id/assign` - Assign member to task
- `POST /api/boards/:boardId/tasks/reorder` - Reorder tasks

## Database Schema

- **users** - User accounts
- **boards** - Kanban boards
- **board_members** - Board membership
- **columns** - Board columns
- **tasks** - Tasks/cards
- **task_assignments** - Task assignments
- **tags** - Task tags
- **task_tags** - Task-tag relationships
