import jwt from 'jsonwebtoken'
import User from '../models/user-model.js'

// Helper to generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}

// ─── REGISTER ───────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Basic validation (IMPORTANT)
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email, and password are required'
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    // Create new user (role optional, schema default will handle it)
    const user = await User.create({
      name,
      email,
      password,
      role
    })

    // Generate token
    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      token,  
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })

  } catch (error) {
    console.log("🔥 REGISTER ERROR:", error)
    res.status(500).json({ message: error.message })
  }
}

// ─── LOGIN ──────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      })
    }

    // Check if user exists (IMPORTANT: include password because select:false)
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Check password
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }


    // Generate token
    const token = generateToken(user._id)

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })

  } catch (error) {
    console.log("🔥 LOGIN ERROR:", error)
    res.status(500).json({ message: error.message })
  }
}

// ─── GET PROFILE ────────────────────────────────────
export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  })
}