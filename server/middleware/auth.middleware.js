import jwt from 'jsonwebtoken'
import User from '../models/user-model.js'

export const protect = async (req, res, next) => {
  try {
    // 1. Check if token exists in request header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token' })
    }

    // 2. Extract the token
    const token = authHeader.split(' ')[1]

    // 3. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // 4. Attach the user to the request
    req.user = await User.findById(decoded.id).select('-password')

    next() // move to next function
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' })
  }
}

// Role-based access control
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role '${req.user.role}' is not allowed to access this route`,
      })
    }
    next()
  }
}