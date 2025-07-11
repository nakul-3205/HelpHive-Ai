import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'

import userRoutes from './routes/user.js'
import ticketRoutes from './routes/ticket.js'

import { authenticate } from './middlewares/auth.js'

import { inngest } from './inngest/client.js'
import { onSignup } from './inngest/functions/on-signup.js'
import { onTicketCreated } from './inngest/functions/on-ticket-create.js'
import { serve } from 'inngest/astro'

dotenv.config()
const app = express()

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://helphive-ai-frontend.onrender.com'
    ],
    credentials: true
  })
)
app.use(express.json())

app.use('/api/auth', userRoutes)

app.use(
  '/api/inngest',
  serve({
    client: inngest,
    functions: [onSignup, onTicketCreated]
  })
)

app.use(authenticate)

app.use('/api/tickets', ticketRoutes)

const PORT = process.env.PORT || 3000
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch(err => {
    console.error('Mongo connection error:', err)
  })
