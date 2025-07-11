import express from 'express';
import mongoose, { mongo } from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/user.js';
// import { Inngest } from 'inngest';
import { inngest } from './inngest/client.js';
import { onSignup } from "./inngest/functions/on-signup.js";
import { onTicketCreated } from "./inngest/functions/on-ticket-create.js";
// import ticket from './assistant/models/ticket.js';
import { serve } from 'inngest/astro';
import ticketRoutes from './routes/ticket.js';
dotenv.config();

const app = express();
app.use(cors());  
app.use(express.json());  
app.use('/api/auth',userRoutes)
app.use('/api/tickets',ticketRoutes);
app.use('/api/inngest',serve({
    client:inngest,
    functions: [onSignup, onTicketCreated],
}))
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI 


mongoose
       .connect(MONGO_URI)
       .then(() => {
           console.log('Connected to MongoDB ✅');
           app.listen(PORT, () => {
               console.log(`Server is running on port ${PORT}`);
           });
       })
       .catch((err) => {
           console.error('❌❌❌ Error connecting to MongoDB:', err);
       });
