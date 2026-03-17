# Kanban Board Application

A full-stack Kanban board application for team project management.

## Tech Stack

### Frontend
- React 18.2.0
- Vite 5.0.8
- Tailwind CSS 3.4.1
- Zustand 4.4.1 (State Management)
- Axios 1.6.5 (HTTP Client)
- react-beautiful-dnd 13.1.1 (Drag & Drop)
- react-router-dom 6.20.0

### Backend
- Node.js with Express 4.18.2
- MySQL 8.0+ with mysql2 3.9.0
- JWT (jsonwebtoken 9.0.0) - Authentication
- bcryptjs 2.4.3 - Password Hashing
- uuid 9.0.1 - ID Generation

### Database
- MySQL 8.0+ with Connection Pooling
- 8 Core Tables with Relationships
- 9 Performance Indexes

## Project Structure

```
Test backend/
├── frontend/                       # React + Vite application
│   ├── src/
│   │   ├── pages/                 # Page components
│   │   ├── components/            # Reusable components
│   │   ├── services/              # API services
│   │   ├── store/                 # Zustand store
│   │   └── App.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── backend-api/                    # Node.js + Express API
│   ├── routes/                    # API endpoints
│   │   ├── auth.js
│   │   ├── boards.js
│   │   ├── columns.js
│   │   ├── tasks.js
│   │   ├── tags.js
│   │   └── notifications.js
│   ├── database.js                # MySQL connection & schema
│   ├── server.js                  # Express app
│   ├── package.json
│   └── .env.example
│
├── ARCHITECTURE.md                # Database ER Diagram & Schema
├── API_DOCUMENTATION.md           # 33 API Endpoints
├── REQUEST_RESPONSE_GUIDE.md      # Request/Response Format
├── PERFORMANCE_AND_ARCHITECTURE.md
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 16+ 
- MySQL 8.0+
- npm or yarn

### Manual Setup (Recommended for Development)

#### 1. Clone & Install Dependencies
```bash
# Backend
cd backend-api
npm install

# Frontend
cd ../frontend
npm install
```

#### 2. Setup Backend
```bash
cd backend-api
cp .env.example .env
# Edit .env with your MySQL credentials
npm start
# Backend runs on http://localhost:8000
```

#### 3. Setup Frontend
```bash
cd frontend
cp .env.example .env
npm run dev
# Frontend runs on http://localhost:3000
```

**That's it!** The backend will auto-create MySQL tables on first run.

### Using Docker Compose (Coming Soon)
```bash
docker-compose up
```

Then:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api
- MySQL: localhost:3306

## Features

### ✅ Core Features
1. **Authentication**
   - User registration and login with JWT
   - Password hashing with bcryptjs
   - Persistent user sessions

2. **Board Management**
   - Create, read, delete boards
   - Invite team members
   - View board members with count

3. **Columns**
   - Create and manage columns
   - Order columns by position
   - Cascade delete with tasks

4. **Tasks** 
   - Create, read, update, delete tasks
   - Drag-and-drop reordering (same/across columns)
   - Position tracking and persistence
   - Assign multiple members to tasks
   - Task descriptions and status

5. **Tags System**
   - Create tags with custom colors
   - Assign tags to tasks
   - Tag management per board
   - Visual tag display on cards

6. **Collaboration**
   - Invite members to boards
   - Assign members to specific tasks
   - Member list with email
   - Real-time task notifications

7. **Notifications**
   - Notify users on task assignments
   - Unread notification counter
   - Mark notifications as read
   - Real-time polling updates

### 📊 Database Features
- 8 core tables with proper relationships
- 9 performance indexes
- Cascade delete for data integrity
- UUID primary keys
- Unique constraints for duplicates prevention

## Environment Variables

### Backend (.env)
```
PORT=8000
NODE_ENV=development

# MySQL Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=kanban-board

# JWT Authentication
JWT_SECRET=your_secret_key_here_change_in_production
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000/api
```

See `.env.example` files in both directories for complete configuration.

## Development

### Running Backend
```bash
cd backend-api
npm install
npm start
# Server runs on http://localhost:8000
```

### Running Frontend
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:3000
```

### Building for Production
```bash
# Frontend
cd frontend
npm run build

# Backend (prepare for deployment)
# Set NODE_ENV=production in .env
```

## API Authentication

All protected endpoints require a Bearer JWT token in the Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Getting a Token
1. Call `POST /api/auth/register` or `POST /api/auth/login` 
2. Response includes `token` field
3. Store token in localStorage (frontend handles this)
4. Include in all subsequent API requests

### Protected Endpoints
- All `/api/boards/*` endpoints
- All `/api/tasks/*` endpoints
- All `/api/columns/*` endpoints
- All `/api/tags/*` endpoints
- All `/api/notifications/*` endpoints

See `API_DOCUMENTATION.md` for complete endpoint reference with examples.

## Database

MySQL 8.0+ is used for data persistence. 

### Auto-Setup
The backend automatically creates all tables on first run:
- No manual migrations needed
- All indexes created automatically
- Relationships and constraints configured
- Cascade delete rules enforced

### Schema
Database includes 8 core tables:
- `users` - User accounts
- `boards` - Kanban boards
- `board_members` - Board collaborations
- `columns` - Board columns
- `tasks` - Tasks within columns
- `task_assignments` - Task member assignments
- `tags` - Custom tags
- `task_tags` - Task tag relationships
- `notifications` - User notifications

See `ARCHITECTURE.md` for complete ER diagram and schema details.

## Documentation

Complete documentation available:
- **ARCHITECTURE.md** - Database ER diagram, schema, indexes
- **API_DOCUMENTATION.md** - All 33 API endpoints with examples
- **REQUEST_RESPONSE_GUIDE.md** - Request/response format standards
- **PERFORMANCE_AND_ARCHITECTURE.md** - Optimization & microservices roadmap

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

MIT
