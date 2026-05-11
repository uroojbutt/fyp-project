import express    from 'express'
import app        from './app.js'
import cors       from 'cors'
import dotenv     from 'dotenv'
import connectDB  from './config/db.js'
import authRoutes from './routes/auth.routes.js'


//----------------
//DATABASE CONNECTION
//------------------
connectDB()


//--------
//STARTING SERVER
//--------
const PORT = process.env.PORT||5000;
const server = app.listen(PORT, () => console.log(` Server running on port ${PORT}`))