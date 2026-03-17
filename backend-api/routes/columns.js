import express from 'express'
import { v4 as uuid } from 'uuid'
import { query, queryOne } from '../database.js'
import { authMiddleware } from '../middleware/auth.js'

export const columnRoutes = express.Router()

columnRoutes.post('/:boardId/columns', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body
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
      'SELECT MAX(position) as max FROM columns WHERE board_id = ?',
      [req.params.boardId]
    )

    const id = uuid()
    const position = (maxPositionRow?.max || 0) + 1

    await query(
      'INSERT INTO columns (id, board_id, name, position) VALUES (?, ?, ?, ?)',
      [id, req.params.boardId, name, position]
    )

    const column = await queryOne('SELECT * FROM columns WHERE id = ?', [id])
    res.status(201).json(column)
  } catch (err) {
    res.status(500).json({ message: 'Failed to create column' })
  }
})

columnRoutes.put('/:boardId/columns/:columnId', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body
    const board = await queryOne(
      `SELECT b.* FROM boards b 
       JOIN board_members bm ON b.id = bm.board_id 
       WHERE b.id = ? AND bm.user_id = ?`,
      [req.params.boardId, req.user.id]
    )

    if (!board) {
      return res.status(404).json({ message: 'Board not found' })
    }

    await query(
      'UPDATE columns SET name = ? WHERE id = ? AND board_id = ?',
      [name, req.params.columnId, req.params.boardId]
    )

    const column = await queryOne('SELECT * FROM columns WHERE id = ?', [req.params.columnId])
    res.json(column)
  } catch (err) {
    res.status(500).json({ message: 'Failed to update column' })
  }
})

columnRoutes.delete('/:boardId/columns/:columnId', authMiddleware, async (req, res) => {
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

    await query('DELETE FROM columns WHERE id = ? AND board_id = ?', [req.params.columnId, req.params.boardId])
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete column' })
  }
})
