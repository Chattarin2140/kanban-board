# Kanban Board Frontend

React-based frontend for Kanban Board application with Tailwind CSS.

## Setup

```bash
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env.local` and update:

```
VITE_API_URL=http://localhost:8000/api
```

## Project Structure

- `src/pages/` - Page components (Login, Register, Dashboard, Board)
- `src/components/` - Reusable components
- `src/services/` - API service calls
- `src/store/` - Zustand store for state management
