import express from 'express'
import { v4 as uuid } from 'uuid'
import { query, queryOne } from '../database.js'
import { authMiddleware } from '../middleware/auth.js'

export const boardRoutes = express.Router()

boardRoutes.get('/', authMiddleware, async (req, res) => {
  try {
    const boards = await query(
      `SELECT b.* FROM boards b 
       JOIN board_members bm ON b.id = bm.board_id 
       WHERE bm.user_id = ?`,
      [req.user.id]
    )

    // Add member count to each board
    const boardsWithMembers = await Promise.all(
      boards.map(async (board) => {
        const members = await query(
          `SELECT u.id, u.name, u.email FROM users u
           JOIN board_members bm ON u.id = bm.user_id
           WHERE bm.board_id = ?`,
          [board.id]
        )
        return { ...board, members }
      })
    )

    res.json(boardsWithMembers)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch boards' })
  }
})

boardRoutes.get('/:id', authMiddleware, async (req, res) => {
  try {
    const board = await queryOne(
      `SELECT b.* FROM boards b 
       JOIN board_members bm ON b.id = bm.board_id 
       WHERE b.id = ? AND bm.user_id = ?`,
      [req.params.id, req.user.id]
    )

    if (!board) {
      return res.status(404).json({ message: 'Board not found' })
    }

    const columns = await query('SELECT * FROM columns WHERE board_id = ? ORDER BY position', [board.id])
    const tasks = await query(
      `SELECT t.* FROM tasks t 
       JOIN columns c ON t.column_id = c.id 
       WHERE c.board_id = ?`,
      [board.id]
    )

    // Add assignees to each task
    const tasksWithAssignees = await Promise.all(
      tasks.map(async (task) => {
        const assignees = await query(
          `SELECT u.id, u.name, u.email FROM users u
           JOIN task_assignments ta ON u.id = ta.user_id
           WHERE ta.task_id = ?`,
          [task.id]
        )
        return { ...task, assignees }
      })
    )

    res.json({ ...board, columns, tasks: tasksWithAssignees })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch board' })
  }
})

boardRoutes.post('/', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body
    const id = uuid()

    await query('INSERT INTO boards (id, owner_id, name) VALUES (?, ?, ?)', [id, req.user.id, name])
    await query('INSERT INTO board_members (id, board_id, user_id) VALUES (?, ?, ?)', [uuid(), id, req.user.id])

    const board = await queryOne('SELECT * FROM boards WHERE id = ?', [id])
    res.status(201).json(board)
  } catch (err) {
    res.status(500).json({ message: 'Failed to create board' })
  }
})

boardRoutes.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body
    const board = await queryOne('SELECT * FROM boards WHERE id = ? AND owner_id = ?', [req.params.id, req.user.id])

    if (!board) {
      return res.status(404).json({ message: 'Board not found' })
    }

    await query('UPDATE boards SET name = ? WHERE id = ?', [name, req.params.id])
    const updated = await queryOne('SELECT * FROM boards WHERE id = ?', [req.params.id])
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: 'Failed to update board' })
  }
})

boardRoutes.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const board = await queryOne('SELECT * FROM boards WHERE id = ? AND owner_id = ?', [req.params.id, req.user.id])

    if (!board) {
      return res.status(404).json({ message: 'Board not found' })
    }

    await query('DELETE FROM boards WHERE id = ?', [req.params.id])
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete board' })
  }
})

boardRoutes.post('/:id/invite', authMiddleware, async (req, res) => {
  try {
    const { email } = req.body
    const board = await queryOne('SELECT * FROM boards WHERE id = ? AND owner_id = ?', [req.params.id, req.user.id])

    if (!board) {
      return res.status(404).json({ message: 'Board not found' })
    }

    const user = await queryOne('SELECT * FROM users WHERE email = ?', [email])
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    await query('INSERT IGNORE INTO board_members (id, board_id, user_id) VALUES (?, ?, ?)',
      [uuid(), req.params.id, user.id])

    res.json(board)
  } catch (err) {
    res.status(500).json({ message: 'Failed to invite member' })
  }
})

boardRoutes.get('/:id/members', authMiddleware, async (req, res) => {
  try {
    const board = await queryOne(
      `SELECT b.* FROM boards b 
       JOIN board_members bm ON b.id = bm.board_id 
       WHERE b.id = ? AND bm.user_id = ?`,
      [req.params.id, req.user.id]
    )

    if (!board) {
      return res.status(404).json({ message: 'Board not found' })
    }

    const members = await query(
      `SELECT u.id, u.name, u.email FROM users u
       JOIN board_members bm ON u.id = bm.user_id
       WHERE bm.board_id = ?`,
      [req.params.id]
    )

    res.json(members)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch members' })
  }
})
