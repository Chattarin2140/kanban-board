import express from 'express'
import { query, queryOne } from '../database.js'
import { authMiddleware } from '../middleware/auth.js'

export const notificationRoutes = express.Router()

notificationRoutes.get('/', authMiddleware, async (req, res) => {
  try {
    const notifications = await query(
      `SELECT n.*, t.title as task_title FROM notifications n
       JOIN tasks t ON n.task_id = t.id
       WHERE n.user_id = ?
       ORDER BY n.created_at DESC
       LIMIT 10`,
      [req.user.id]
    )
    res.json(notifications)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notifications' })
  }
})

notificationRoutes.get('/unread', authMiddleware, async (req, res) => {
  try {
    const count = await queryOne(
      `SELECT COUNT(*) as count FROM notifications
       WHERE user_id = ? AND is_read = FALSE`,
      [req.user.id]
    )
    res.json({ unread: count.count })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch unread count' })
  }
})

notificationRoutes.put('/:notificationId/read', authMiddleware, async (req, res) => {
  try {
    await query(
      'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
      [req.params.notificationId, req.user.id]
    )
    res.json({ message: 'Notification marked as read' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark notification as read' })
  }
})

notificationRoutes.put('/read-all', authMiddleware, async (req, res) => {
  try {
    await query(
      'UPDATE notifications SET is_read = TRUE WHERE user_id = ?',
      [req.user.id]
    )
    res.json({ message: 'All notifications marked as read' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark notifications as read' })
  }
})
