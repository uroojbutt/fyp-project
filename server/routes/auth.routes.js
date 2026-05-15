import express from 'express'
import { register, login, getMe } from '../controllers/auth.controller.js'
import { protect } from '../middleware/auth.middleware.js'
import isAdmin from '../middleware/isAdmin.js'


const  router = express.Router()

router.get('/admin/dashboard', protect, isAdmin, (req, res) => {
  res.json({ message: 'Welcome Admin' });
})


router.post('/register', register)
router.post('/login',    login)
router.get('/me',        protect, getMe)  // protected!

export default router