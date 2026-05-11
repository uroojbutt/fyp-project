import jwt from 'jsonwebtoken'

const sendToken = (user, statusCode, res) => {
  // Generate token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  )

  // Cookie options
  const cookieOptions = {
    httpOnly : true,                              // not accessible via JS
    secure   : process.env.NODE_ENV === 'production',
    sameSite : 'strict',
    expires  : new Date(
      Date.now() + (process.env.COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
    ),
  }

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success : true,
      token,
      user: {
        id    : user._id,
        name  : user.name,
        email : user.email,
        role  : user.role,
      },
    })
}

export default sendToken