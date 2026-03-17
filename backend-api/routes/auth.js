import express from 'express'
import { v4 as uuid } from 'uuid'
import bcrypt from 'bcryptjs'
import { query, queryOne } from '../database.js'
import { generateToken, authMiddleware } from '../middleware/auth.js'

export const authRoutes = express.Router()

authRoutes.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const id = uuid()
    const hashedPassword = await bcrypt.hash(password, 10)

    await query(
      'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)',
      [id, name, email, hashedPassword]
    )

    const user = { id, name, email }
    const token = generateToken(user)

    res.status(201).json({ user, token })
  } catch (err) {
    if (err.message.includes('Duplicate entry')) {
      res.status(400).json({ message: 'Email already registered' })
    } else {
      res.status(500).json({ message: 'Registration failed' })
    }
  }
})

authRoutes.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await queryOne('SELECT * FROM users WHERE email = ?', [email])
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const token = generateToken(user)
    res.json({ user: { id: user.id, name: user.name, email: user.email }, token })
  } catch (err) {
    res.status(500).json({ message: 'Login failed' })
  }
})

authRoutes.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await queryOne('SELECT id, name, email FROM users WHERE id = ?', [req.user.id])
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: 'Failed to get user' })
  }
})

authRoutes.post('/logout', authMiddleware, (req, res) => {
  res.json({ message: 'Logged out successfully' })
})
