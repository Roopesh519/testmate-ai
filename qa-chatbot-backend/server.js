// qa-chatbot-backend/server.js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server is running on http://0.0.0.0:${PORT}`);
    });    
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });


