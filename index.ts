import express from 'express'
import cors from 'cors'
import userRoutes from './userRoutes'

const app = express()
const PORT = 3001
// Middleware
app.use(cors())
app.use(express.json())
app.use('/api', userRoutes)

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
