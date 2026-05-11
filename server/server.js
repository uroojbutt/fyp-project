import express    from 'express'
import app        from './app.js'
import cors       from 'cors'
import dotenv     from 'dotenv'
import connectDB  from './config/db.js'
import authRoutes from './routes/auth.routes.js'

// Load env vars early — before anything else reads them
dotenv.config()

//----------------
// DATABASE CONNECTION
//----------------
connectDB()

//--------
// STARTING SERVER
//--------
const PORT = process.env.PORT || 4000

const server = app.listen(PORT, () =>
  console.log(` Server running on port ${PORT} in ${process.env.NODE_ENV} mode`)
)

//--------
// GRACEFUL SHUTDOWN HELPER
//--------
const shutdown = (reason, exitCode = 1) => {
  console.error(`\n Shutting down: ${reason}`)
  server.close(() => {
    console.log(' HTTP server closed.')
    process.exit(exitCode)
  })

  // Force kill if server hangs
  setTimeout(() => {
    console.error('  Forcing exit after timeout.')
    process.exit(exitCode)
  }, 10_000).unref() // .unref() won't block the event loop
}

//--------
// UNHANDLED PROMISE REJECTIONS
// e.g. await somePromise() without try/catch
//--------
process.on('unhandledRejection', (reason, promise) => {
  console.error(' Unhandled Rejection at:', promise)
  console.error('   Reason:', reason)
  shutdown('Unhandled Promise Rejection')
})

//--------
// UNCAUGHT EXCEPTIONS
// e.g. throw new Error() outside async context
//--------
process.on('uncaughtException', (err) => {
  console.error(' Uncaught Exception:', err.message)
  console.error(err.stack);
  server.close(() => {
    console.log(' HTTP server closed.');    
    process.exit(1)
  })
})

//--------
// GRACEFUL TERMINATION SIGNALS
// SIGTERM → sent by Docker / Kubernetes / PM2 to stop the process
// SIGINT  → sent by Ctrl+C in terminal
//--------
process.on('SIGTERM', () => shutdown('SIGTERM received', 0))
process.on('SIGINT',  () => shutdown('SIGINT received',  0))
export default server