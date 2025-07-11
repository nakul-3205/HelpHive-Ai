import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { inngest } from '../inngest/client.js'
import User from '../models/User.js'

export const signup = async (req, res) => {
  const { email, password, skills = [] } = req.body

  try {
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' })

    const exists = await User.findOne({ email })
    if (exists) return res.status(409).json({ message: 'Email already registered' })

    const hashed = await bcrypt.hash(password, 10)

    const newUser = await User.create({ email, password: hashed, skills })

    if (typeof inngest?.send === 'function') {
      await inngest.send({ name: 'user/signup', data: { email: newUser.email } })
    }

    const token = jwt.sign({ _id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '7d' })

    return res.status(201).json({ user: newUser, token })
  } catch (err) {
    console.error('signup:', err)
    return res.status(500).json({ message: 'Signup failed' })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' })

    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })

    return res.status(200).json({ user, token })
  } catch (err) {
    console.error('login:', err)
    return res.status(500).json({ message: 'Login failed' })
  }
}

export const logout = (_req, res) => res.json({ message: 'Logged out' })

export const updateUser = async (req, res) => {
  const { skills = [], role, email } = req.body
  try {
    if (!req.user || req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' })

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'User not found' })

    await User.updateOne(
      { email },
      { $set: { skills: skills.length ? skills : user.skills, role } }
    )

    return res.status(200).json({ message: 'User updated' })
  } catch (err) {
    console.error('updateUser:', err)
    return res.status(500).json({ message: 'Update failed' })
  }
}

export const getUser = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' })

    const users = await User.find().select('-password')
    return res.status(200).json(users)
  } catch (err) {
    console.error('getUser:', err)
    return res.status(500).json({ message: 'Fetch failed' })
  }
}
