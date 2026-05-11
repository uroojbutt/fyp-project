import jwt from 'jsonwebtoken'
import User from '../models/User.model.js'

// Helper to generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}

// ─── REGISTER ───────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    // Create new user
    const user = await User.create({ fullName, email, password, role })

    // Generate token
    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      token,
      user: {
        id:       user._id,
        fullName: user.fullName,
        email:    user.email,
        role:     user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─── LOGIN ──────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Check if role matches
    if (user.role !== role) {
      return res.status(401).json({ message: `This account is not registered as ${role}` })
    }

    // Generate token
    const token = generateToken(user._id)

    res.status(200).json({
      success: true,
      token,
      user: {
        id:       user._id,
        fullName: user.fullName,
        email:    user.email,
        role:     user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─── GET PROFILE ────────────────────────────────────
export const getMe = async (req, res) => {
  res.status(200).json({ success: true, user: req.user })
}