# Kanban Board API Documentation

## Authentication API

### Register User
**Endpoint:** `POST /api/auth/register`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (201 Created):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login
**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get Current User
**Endpoint:** `GET /api/auth/me`

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "John Doe",
  "email": "john@example.com"
}
```

---

## Boards API

### Get All Boards
**Endpoint:** `GET /api/boards`

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
[
  {
    "id": "board-001",
    "name": "Project 1",
    "owner_id": "user-001",
    "owner_name": "John Doe",
    "created_at": "2024-01-15T10:30:00Z",
    "member_count": 3,
    "columns": [
      {
        "id": "col-001",
        "name": "Todo",
        "position": 1
      },
      {
        "id": "col-002",
        "name": "In Progress",
        "position": 2
      }
    ],
    "tasks": [
      {
        "id": "task-001",
        "column_id": "col-001",
        "title": "Setup project",
        "description": "Initial setup",
        "position": 1,
        "assignees": [
          {
            "id": "user-001",
            "name": "John Doe",
            "email": "john@example.com"
          }
        ],
        "tags": [
          {
            "id": "tag-001",
            "name": "urgent",
            "color": "#EF4444"
          }
        ]
      }
    ]
  }
]
```

### Create Board
**Endpoint:** `POST /api/boards`

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "name": "New Project"
}
```

**Response (201 Created):**
```json
{
  "id": "board-002",
  "name": "New Project",
  "owner_id": "user-001",
  "created_at": "2024-01-20T14:22:00Z"
}
```

### Get Single Board
**Endpoint:** `GET /api/boards/{boardId}`

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):** Same as Get All Boards (single item)

### Delete Board
**Endpoint:** `DELETE /api/boards/{boardId}`

**Headers:** `Authorization: Bearer {token}`

**Response (204 No Content)**

### Invite Member to Board
**Endpoint:** `POST /api/boards/{boardId}/invite`

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "email": "newmember@example.com"
}
```

**Response (200 OK):**
```json
{
  "message": "Member invited successfully",
  "member": {
    "id": "user-002",
    "name": "New Member",
    "email": "newmember@example.com"
  }
}
```

### Get Board Members
**Endpoint:** `GET /api/boards/{boardId}/members`

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
[
  {
    "id": "user-001",
    "name": "John Doe",
    "email": "john@example.com"
  },
  {
    "id": "user-002",
    "name": "New Member",
    "email": "newmember@example.com"
  }
]
```

---

## Columns API

### Create Column
**Endpoint:** `POST /api/boards/{boardId}/columns`

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "name": "Done"
}
```

**Response (201 Created):**
```json
{
  "id": "col-003",
  "board_id": "board-001",
  "name": "Done",
  "position": 3,
  "created_at": "2024-01-22T09:15:00Z"
}
```

### Update Column
**Endpoint:** `PUT /api/boards/{boardId}/columns/{columnId}`

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "name": "Completed"
}
```

**Response (200 OK):**
```json
{
  "id": "col-003",
  "board_id": "board-001",
  "name": "Completed",
  "position": 3,
  "created_at": "2024-01-22T09:15:00Z"
}
```

### Delete Column
**Endpoint:** `DELETE /api/boards/{boardId}/columns/{columnId}`

**Headers:** `Authorization: Bearer {token}`

**Response (204 No Content)**

---

## Tasks API

### Get All Tasks
**Endpoint:** `GET /api/boards/{boardId}/tasks`

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
[
  {
    "id": "task-001",
    "column_id": "col-001",
    "title": "Setup project",
    "description": "Initial setup and configuration",
    "position": 1,
    "created_at": "2024-01-15T10:30:00Z",
    "assignees": [
      {
        "id": "user-001",
        "name": "John Doe",
        "email": "john@example.com"
      }
    ],
    "tags": [
      {
        "id": "tag-001",
        "name": "urgent",
        "color": "#EF4444"
      }
    ]
  }
]
```

### Create Task
**Endpoint:** `POST /api/boards/{boardId}/tasks`

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "column_id": "col-001",
  "title": "Implement login",
  "description": "Add user authentication"
}
```

**Response (201 Created):**
```json
{
  "id": "task-002",
  "column_id": "col-001",
  "title": "Implement login",
  "description": "Add user authentication",
  "position": 2,
  "created_at": "2024-01-23T11:00:00Z",
  "assignees": [],
  "tags": []
}
```

### Update Task
**Endpoint:** `PUT /api/boards/{boardId}/tasks/{taskId}`

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "title": "Implement OAuth login",
  "description": "Add Google and GitHub OAuth",
  "column_id": "col-002",
  "position": 1
}
```

**Response (200 OK):**
```json
{
  "id": "task-002",
  "column_id": "col-002",
  "title": "Implement OAuth login",
  "description": "Add Google and GitHub OAuth",
  "position": 1,
  "created_at": "2024-01-23T11:00:00Z"
}
```

### Delete Task
**Endpoint:** `DELETE /api/boards/{boardId}/tasks/{taskId}`

**Headers:** `Authorization: Bearer {token}`

**Response (204 No Content)**

### Reorder Tasks
**Endpoint:** `POST /api/boards/{boardId}/tasks/reorder`

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "tasks": [
    {
      "id": "task-001",
      "column_id": "col-001",
      "position": 2
    },
    {
      "id": "task-002",
      "column_id": "col-001",
      "position": 1
    },
    {
      "id": "task-003",
      "column_id": "col-002",
      "position": 1
    }
  ]
}
```

**Response (200 OK):**
```json
[
  {
    "id": "task-002",
    "column_id": "col-001",
    "title": "Implement login",
    "position": 1
  },
  {
    "id": "task-001",
    "column_id": "col-001",
    "title": "Setup project",
    "position": 2
  }
]
```

### Assign Member to Task
**Endpoint:** `POST /api/boards/{boardId}/tasks/{taskId}/assign`

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "member_id": "user-002"
}
```

**Response (200 OK):**
```json
{
  "message": "Member assigned successfully",
  "assignee": {
    "id": "user-002",
    "name": "New Member",
    "email": "newmember@example.com"
  }
}
```

### Unassign Member from Task
**Endpoint:** `DELETE /api/boards/{boardId}/tasks/{taskId}/assign/{memberId}`

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "message": "Member unassigned"
}
```

---

## Tags API

### Get All Tags
**Endpoint:** `GET /api/boards/{boardId}/tags`

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
[
  {
    "id": "tag-001",
    "board_id": "board-001",
    "name": "urgent",
    "color": "#EF4444",
    "created_at": "2024-01-15T10:30:00Z"
  },
  {
    "id": "tag-002",
    "board_id": "board-001",
    "name": "bug",
    "color": "#F59E0B",
    "created_at": "2024-01-16T14:22:00Z"
  }
]
```

### Create Tag
**Endpoint:** `POST /api/boards/{boardId}/tags`

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "name": "feature",
  "color": "#10B981"
}
```

**Response (201 Created):**
```json
{
  "id": "tag-003",
  "board_id": "board-001",
  "name": "feature",
  "color": "#10B981",
  "created_at": "2024-01-24T09:00:00Z"
}
```

### Update Tag
**Endpoint:** `PUT /api/boards/{boardId}/tags/{tagId}`

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "name": "enhancement",
  "color": "#8B5CF6"
}
```

**Response (200 OK):**
```json
{
  "id": "tag-003",
  "board_id": "board-001",
  "name": "enhancement",
  "color": "#8B5CF6",
  "created_at": "2024-01-24T09:00:00Z"
}
```

### Delete Tag
**Endpoint:** `DELETE /api/boards/{boardId}/tags/{tagId}`

**Headers:** `Authorization: Bearer {token}`

**Response (204 No Content)**

### Assign Tag to Task
**Endpoint:** `POST /api/boards/{boardId}/tasks/{taskId}/tags/{tagId}`

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "message": "Tag assigned to task"
}
```

### Remove Tag from Task
**Endpoint:** `DELETE /api/boards/{boardId}/tasks/{taskId}/tags/{tagId}`

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "message": "Tag removed from task"
}
```

---

## Notifications API

### Get Notifications
**Endpoint:** `GET /api/notifications`

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
[
  {
    "id": "notif-001",
    "user_id": "user-001",
    "task_id": "task-001",
    "type": "task_assigned",
    "message": "You were assigned to task 'Setup project'",
    "is_read": false,
    "created_at": "2024-01-24T10:15:00Z"
  }
]
```

### Get Unread Count
**Endpoint:** `GET /api/notifications/unread-count`

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "count": 3
}
```

### Mark Notification as Read
**Endpoint:** `PUT /api/notifications/{notificationId}`

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "is_read": true
}
```

**Response (200 OK):**
```json
{
  "id": "notif-001",
  "is_read": true,
  "updated_at": "2024-01-24T10:20:00Z"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Invalid request data"
}
```

### 401 Unauthorized
```json
{
  "message": "No token provided"
}
```

### 403 Forbidden
```json
{
  "message": "Not authorized to access this resource"
}
```

### 404 Not Found
```json
{
  "message": "Board not found"
}
```

### 500 Server Error
```json
{
  "message": "Internal server error"
}
```

---

## HTTP Status Codes Summary

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No Content (Success with no response body) |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |
