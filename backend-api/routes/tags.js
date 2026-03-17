import express from 'express'
import { v4 as uuid } from 'uuid'
import { query, queryOne } from '../database.js'
import { authMiddleware } from '../middleware/auth.js'

export const tagRoutes = express.Router()

// Get all tags for a board
tagRoutes.get('/:boardId/tags', authMiddleware, async (req, res) => {
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

    const tags = await query(
      'SELECT * FROM tags WHERE board_id = ? ORDER BY name',
      [req.params.boardId]
    )

    res.json(tags)
  } catch (err) {
    console.error('Failed to fetch tags:', err)
    res.status(500).json({ message: 'Failed to fetch tags' })
  }
})

// Create a new tag
tagRoutes.post('/:boardId/tags', authMiddleware, async (req, res) => {
  try {
    const { name, color } = req.body

    const board = await queryOne(
      `SELECT b.* FROM boards b 
       JOIN board_members bm ON b.id = bm.board_id 
       WHERE b.id = ? AND bm.user_id = ?`,
      [req.params.boardId, req.user.id]
    )

    if (!board) {
      return res.status(404).json({ message: 'Board not found' })
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Tag name is required' })
    }

    const id = uuid()
    const tagColor = color || '#3B82F6'

    await query(
      'INSERT INTO tags (id, board_id, name, color) VALUES (?, ?, ?, ?)',
      [id, req.params.boardId, name.trim(), tagColor]
    )

    const tag = await queryOne('SELECT * FROM tags WHERE id = ?', [id])
    res.status(201).json(tag)
  } catch (err) {
    console.error('Failed to create tag:', err)
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Tag already exists' })
    }
    res.status(500).json({ message: 'Failed to create tag' })
  }
})

// Update a tag
tagRoutes.put('/:boardId/tags/:tagId', authMiddleware, async (req, res) => {
  try {
    const { name, color } = req.body

    const tag = await queryOne(
      `SELECT t.* FROM tags t 
       WHERE t.id = ? AND t.board_id = ?`,
      [req.params.tagId, req.params.boardId]
    )

    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' })
    }

    const updates = []
    const values = []

    if (name !== undefined && name.trim()) {
      updates.push('name = ?')
      values.push(name.trim())
    }
    if (color !== undefined) {
      updates.push('color = ?')
      values.push(color)
    }

    if (updates.length > 0) {
      values.push(req.params.tagId)
      await query(`UPDATE tags SET ${updates.join(', ')} WHERE id = ?`, values)
    }

    const updated = await queryOne('SELECT * FROM tags WHERE id = ?', [req.params.tagId])
    res.json(updated)
  } catch (err) {
    console.error('Failed to update tag:', err)
    res.status(500).json({ message: 'Failed to update tag' })
  }
})

// Delete a tag
tagRoutes.delete('/:boardId/tags/:tagId', authMiddleware, async (req, res) => {
  try {
    const tag = await queryOne(
      `SELECT t.* FROM tags t 
       WHERE t.id = ? AND t.board_id = ?`,
      [req.params.tagId, req.params.boardId]
    )

    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' })
    }

    await query('DELETE FROM tags WHERE id = ?', [req.params.tagId])
    res.status(204).send()
  } catch (err) {
    console.error('Failed to delete tag:', err)
    res.status(500).json({ message: 'Failed to delete tag' })
  }
})

// Assign tag to task
tagRoutes.post('/:boardId/tasks/:taskId/tags/:tagId', authMiddleware, async (req, res) => {
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

    const tag = await queryOne(
      'SELECT t.* FROM tags t WHERE t.id = ? AND t.board_id = ?',
      [req.params.tagId, req.params.boardId]
    )

    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' })
    }

    const id = uuid()
    await query(
      'INSERT IGNORE INTO task_tags (id, task_id, tag_id) VALUES (?, ?, ?)',
      [id, req.params.taskId, req.params.tagId]
    )

    res.json({ message: 'Tag assigned to task' })
  } catch (err) {
    console.error('Failed to assign tag:', err)
    res.status(500).json({ message: 'Failed to assign tag' })
  }
})

// Remove tag from task
tagRoutes.delete('/:boardId/tasks/:taskId/tags/:tagId', authMiddleware, async (req, res) => {
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

    await query('DELETE FROM task_tags WHERE task_id = ? AND tag_id = ?', [
      req.params.taskId,
      req.params.tagId,
    ])

    res.json({ message: 'Tag removed from task' })
  } catch (err) {
    console.error('Failed to remove tag:', err)
    res.status(500).json({ message: 'Failed to remove tag' })
  }
})
