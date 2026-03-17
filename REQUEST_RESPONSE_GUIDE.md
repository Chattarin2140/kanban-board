# Request & Response Design 

## Standard Response Format

### Success Response (2xx)
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful",
  "timestamp": "2024-03-17T10:30:00Z"
}
```

### Error Response (4xx, 5xx)
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "field": "field_name" // Optional - for validation errors
  },
  "timestamp": "2024-03-17T10:30:00Z"
}
```

---

## Authentication

### Register
**Request:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2024-03-17T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Registration successful"
}
```

### Login
**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

---

## Boards

### Create Board
**Request:**
```http
POST /api/boards
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Project Alpha"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "owner_id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Project Alpha",
    "created_at": "2024-03-17T10:30:00Z"
  },
  "message": "Board created successfully"
}
```

### Get All Boards
**Request:**
```http
GET /api/boards
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "owner_id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Project Alpha",
      "created_at": "2024-03-17T10:30:00Z"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440002",
      "owner_id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Project Beta",
      "created_at": "2024-03-17T10:31:00Z"
    }
  ],
  "count": 2
}
```

### Get Board with Columns & Tasks
**Request:**
```http
GET /api/boards/{boardId}
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "board": {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "owner_id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Project Alpha",
      "created_at": "2024-03-17T10:30:00Z"
    },
    "columns": [
      {
        "id": "770e8400-e29b-41d4-a716-446655440001",
        "board_id": "660e8400-e29b-41d4-a716-446655440001",
        "name": "To Do",
        "position": 1,
        "created_at": "2024-03-17T10:30:00Z"
      }
    ],
    "tasks": [
      {
        "id": "880e8400-e29b-41d4-a716-446655440001",
        "column_id": "770e8400-e29b-41d4-a716-446655440001",
        "title": "Design mockups",
        "description": "Create UI mockups for dashboard",
        "position": 1,
        "assignees": [
          {
            "id": "550e8400-e29b-41d4-a716-446655440000",
            "name": "John Doe",
            "email": "john@example.com"
          }
        ],
        "tags": [
          {
            "id": "990e8400-e29b-41d4-a716-446655440001",
            "name": "Design",
            "color": "#FF6B6B"
          }
        ],
        "created_at": "2024-03-17T10:30:00Z"
      }
    ],
    "members": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "John Doe",
        "email": "john@example.com"
      }
    ]
  }
}
```

---

## Columns

### Create Column
**Request:**
```http
POST /api/boards/{boardId}/columns
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "In Progress"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "board_id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "In Progress",
    "position": 2,
    "created_at": "2024-03-17T10:32:00Z"
  },
  "message": "Column created successfully"
}
```

---

## Tasks

### Create Task
**Request:**
```http
POST /api/boards/{boardId}/columns/{columnId}/tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Implement login feature",
  "description": "Add JWT authentication to backend"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440002",
    "column_id": "770e8400-e29b-41d4-a716-446655440002",
    "title": "Implement login feature",
    "description": "Add JWT authentication to backend",
    "position": 1,
    "assignees": [],
    "tags": [],
    "created_at": "2024-03-17T10:35:00Z"
  },
  "message": "Task created successfully"
}
```

### Reorder Tasks (Drag & Drop)
**Request:**
```http
POST /api/boards/{boardId}/tasks/reorder
Authorization: Bearer {token}
Content-Type: application/json

{
  "taskId": "880e8400-e29b-41d4-a716-446655440002",
  "sourceColumnId": "770e8400-e29b-41d4-a716-446655440001",
  "destColumnId": "770e8400-e29b-41d4-a716-446655440002",
  "newPosition": 3
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "task": {
      "id": "880e8400-e29b-41d4-a716-446655440002",
      "column_id": "770e8400-e29b-41d4-a716-446655440002",
      "position": 3,
      "title": "Implement login feature",
      "description": "Add JWT authentication to backend",
      "assignees": [],
      "tags": [],
      "created_at": "2024-03-17T10:35:00Z"
    }
  },
  "message": "Task reordered successfully"
}
```

### Assign User to Task
**Request:**
```http
POST /api/boards/{boardId}/tasks/{taskId}/assign
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "assignment": {
      "id": "aa0e8400-e29b-41d4-a716-446655440001",
      "task_id": "880e8400-e29b-41d4-a716-446655440002",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "created_at": "2024-03-17T10:36:00Z"
    },
    "assignees": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "John Doe",
        "email": "john@example.com"
      }
    ]
  },
  "message": "User assigned to task successfully"
}
```

---

## Tags

### Create Tag
**Request:**
```http
POST /api/boards/{boardId}/tags
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Bug",
  "color": "#FF0000"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440002",
    "board_id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Bug",
    "color": "#FF0000",
    "created_at": "2024-03-17T10:40:00Z"
  },
  "message": "Tag created successfully"
}
```

### Assign Tag to Task
**Request:**
```http
POST /api/boards/{boardId}/tasks/{taskId}/tags/{tagId}
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "tag_assignment": {
      "id": "bb0e8400-e29b-41d4-a716-446655440001",
      "task_id": "880e8400-e29b-41d4-a716-446655440002",
      "tag_id": "990e8400-e29b-41d4-a716-446655440002",
      "created_at": "2024-03-17T10:41:00Z"
    },
    "tags": [
      {
        "id": "990e8400-e29b-41d4-a716-446655440002",
        "name": "Bug",
        "color": "#FF0000"
      }
    ]
  },
  "message": "Tag assigned to task successfully"
}
```

---

## Notifications

### Get Notifications
**Request:**
```http
GET /api/notifications
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "cc0e8400-e29b-41d4-a716-446655440001",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "task_id": "880e8400-e29b-41d4-a716-446655440002",
      "type": "task_assigned",
      "message": "You were assigned to task: Implement login feature",
      "is_read": false,
      "created_at": "2024-03-17T10:35:00Z"
    }
  ],
  "unread_count": 1
}
```

### Get Unread Count
**Request:**
```http
GET /api/notifications/unread-count
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "unread_count": 3
  }
}
```

### Mark Notification as Read
**Request:**
```http
PUT /api/notifications/{notificationId}/read
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "notification": {
      "id": "cc0e8400-e29b-41d4-a716-446655440001",
      "is_read": true,
      "updated_at": "2024-03-17T10:42:00Z"
    }
  },
  "message": "Notification marked as read"
}
```

---

## Error Responses

### 400 - Bad Request
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Name is required",
    "field": "name"
  },
  "timestamp": "2024-03-17T10:30:00Z"
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing authentication token"
  },
  "timestamp": "2024-03-17T10:30:00Z"
}
```

### 403 - Forbidden
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to access this resource"
  },
  "timestamp": "2024-03-17T10:30:00Z"
}
```

### 404 - Not Found
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Board not found"
  },
  "timestamp": "2024-03-17T10:30:00Z"
}
```

### 500 - Internal Server Error
```json
{
  "success": false,
  "error": {
    "code": "SERVER_ERROR",
    "message": "An unexpected error occurred. Please try again later."
  },
  "timestamp": "2024-03-17T10:30:00Z"
}
```

---

## Design Principles

### 1. Consistency
- All endpoints follow the same response structure
- Error handling is uniform across the API
- HTTP status codes are used correctly

### 2. Clarity
- Response includes `success` flag for easy client-side handling
- Error messages are human-readable
- Data structure is logical and predictable

### 3. Efficiency
- Include only necessary fields in responses
- Use pagination for large datasets (future implementation)
- Support filtering and search parameters

### 4. Security
- All endpoints require authentication (except login/register)
- JWT tokens for stateless authentication
- CORS headers configured for frontend access

### 5. Timestamps
- All responses include `timestamp` in ISO 8601 format (UTC)
- All entities include `created_at` timestamp
- Updates include `updated_at` timestamp (future implementation)
