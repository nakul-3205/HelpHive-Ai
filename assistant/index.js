import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Routes
import userRoutes from './routes/user.js';
import ticketRoutes from './routes/ticket.js';

// Middlewares
import { authenticate } from './middlewares/auth.js'; // ✅ use your auth middleware here

// Inngest stuff 
import { inngest } from './inngest/client.js';
import { onSignup } from './inngest/functions/on-signup.js';
import { onTicketCreated } from './inngest/functions/on-ticket-create.js';
import { serve } from 'inngest/astro';

dotenv.config();
const app = express();

// 🔧 Basic setup
app.use(cors());
app.use(express.json());

// ✅ Public routes (no auth needed)
app.use('/api/auth', userRoutes);

// 🔐 Protect all routes below this
app.use(authenticate);

// ✅ Protected routes
app.use('/api/tickets', ticketRoutes);

// Optional (protected) inngest routes
app.use('/api/inngest', serve({
  client: inngest,
  functions: [onSignup, onTicketCreated],
}));

// 🚀 Server + DB setup
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error connecting to MongoDB:', err);
  });
