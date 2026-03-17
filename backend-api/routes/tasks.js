import express from 'express'
import { v4 as uuid } from 'uuid'
import { query, queryOne } from '../database.js'
import { authMiddleware } from '../middleware/auth.js'

export const taskRoutes = express.Router()

taskRoutes.get('/:boardId/tasks', authMiddleware, async (req, res) => {
  try {
    const board = await queryOne(
      `SELECT b.* FROM boards b 
       JOIN board_members bm ON b.id = bm.board_id 
       WHERE b.id = ? AND bm.user_id = ?`,
      [req.params.boardId, req.user.id]
    )

    if (!board) {
      return res.status(404).json({ message: 'Board not found' })
    }

    const tasks = await query(
      `SELECT t.* FROM tasks t 
       JOIN columns c ON t.column_id = c.id 
       WHERE c.board_id = ?`,
      [req.params.boardId]
    )

    // Add assignees and tags to each task
    const tasksWithAssigneesAndTags = await Promise.all(
      tasks.map(async (task) => {
        const assignees = await query(
          `SELECT u.id, u.name, u.email FROM users u
           JOIN task_assignments ta ON u.id = ta.user_id
           WHERE ta.task_id = ?`,
          [task.id]
        )
        const tags = await query(
          `SELECT t.id, t.name, t.color FROM tags t
           JOIN task_tags tt ON t.id = tt.tag_id
           WHERE tt.task_id = ?`,
          [task.id]
        )
        return { ...task, assignees, tags }
      })
    )

    res.json(tasksWithAssigneesAndTags)
  } catch (err) {
    console.error('Failed to fetch tasks:', err)
    res.status(500).json({ message: 'Failed to fetch tasks' })
  }
})

taskRoutes.post('/:boardId/tasks', authMiddleware, async (req, res) => {
  try {
    const { column_id, title, description } = req.body
    const board = await queryOne(
      `SELECT b.* FROM boards b 
       JOIN board_members bm ON b.id = bm.board_id 
       WHERE b.id = ? AND bm.user_id = ?`,
      [req.params.boardId, req.user.id]
    )

    if (!board) {
      return res.status(404).json({ message: 'Board not found' })
    }

    const maxPositionRow = await queryOne(
      'SELECT MAX(position) as max FROM tasks WHERE column_id = ?',
      [column_id]
    )

    const id = uuid()
    const position = (maxPositionRow?.max || 0) + 1

    await query(
      'INSERT INTO tasks (id, column_id, title, description, position) VALUES (?, ?, ?, ?, ?)',
      [id, column_id, title, description || null, position]
    )

    const task = await queryOne('SELECT * FROM tasks WHERE id = ?', [id])
    res.status(201).json(task)
  } catch (err) {
    res.status(500).json({ message: 'Failed to create task' })
  }
})

taskRoutes.put('/:boardId/tasks/:taskId', authMiddleware, async (req, res) => {
  try {
    const { title, description, column_id, position } = req.body

    const task = await queryOne(
      `SELECT t.* FROM tasks t 
       JOIN columns c ON t.column_id = c.id 
       WHERE t.id = ? AND c.board_id = ?`,
      [req.params.taskId, req.params.boardId]
    )

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    const updates = []
    const values = []

    if (title !== undefined) {
      updates.push('title = ?')
      values.push(title)
    }
    if (description !== undefined) {
      updates.push('description = ?')
      values.push(description)
    }
    if (column_id !== undefined) {
      updates.push('column_id = ?')
      values.push(column_id)
    }
    if (position !== undefined) {
      updates.push('position = ?')
      values.push(position)
    }

    if (updates.length > 0) {
      values.push(req.params.taskId)
      await query(`UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`, values)
    }

    const updated = await queryOne('SELECT * FROM tasks WHERE id = ?', [req.params.taskId])
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: 'Failed to update task' })
  }
})

taskRoutes.delete('/:boardId/tasks/:taskId', authMiddleware, async (req, res) => {
  try {
    const task = await queryOne(
      `SELECT t.* FROM tasks t 
       JOIN columns c ON t.column_id = c.id 
       WHERE t.id = ? AND c.board_id = ?`,
      [req.params.taskId, req.params.boardId]
    )

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    await query('DELETE FROM tasks WHERE id = ?', [req.params.taskId])
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete task' })
  }
})

taskRoutes.post('/:boardId/tasks/reorder', authMiddleware, async (req, res) => {
  try {
    const { tasks } = req.body

    for (const t of tasks) {
      await query(
        'UPDATE tasks SET position = ?, column_id = ? WHERE id = ?',
        [t.position, t.column_id, t.id]
      )
    }

    const updated = await query(
      `SELECT t.* FROM tasks t 
       JOIN columns c ON t.column_id = c.id 
       WHERE c.board_id = ?`,
      [req.params.boardId]
    )

    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: 'Failed to reorder tasks' })
  }
})

taskRoutes.post('/:boardId/tasks/:taskId/assign', authMiddleware, async (req, res) => {
  try {
    const { member_id } = req.body

    const task = await queryOne(
      `SELECT t.* FROM tasks t 
       JOIN columns c ON t.column_id = c.id 
       WHERE t.id = ? AND c.board_id = ?`,
      [req.params.taskId, req.params.boardId]
    )

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    await query(
      'INSERT IGNORE INTO task_assignments (id, task_id, user_id) VALUES (?, ?, ?)',
      [uuid(), req.params.taskId, member_id]
    )

    // Create notification
    const notificationMessage = `You were assigned to task "${task.title}"`
    await query(
      'INSERT INTO notifications (id, user_id, task_id, type, message) VALUES (?, ?, ?, ?, ?)',
      [uuid(), member_id, req.params.taskId, 'task_assigned', notificationMessage]
    )

    const updated = await queryOne('SELECT * FROM tasks WHERE id = ?', [req.params.taskId])
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: 'Failed to assign task' })
  }
})

taskRoutes.delete('/:boardId/tasks/:taskId/assign/:memberId', authMiddleware, async (req, res) => {
  try {
    const task = await queryOne(
      `SELECT t.* FROM tasks t 
       JOIN columns c ON t.column_id = c.id 
       WHERE t.id = ? AND c.board_id = ?`,
      [req.params.taskId, req.params.boardId]
    )

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    await query('DELETE FROM task_assignments WHERE task_id = ? AND user_id = ?', [
      req.params.taskId,
      req.params.memberId,
    ])

    res.json({ message: 'Member unassigned' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to unassign member' })
  }
})
