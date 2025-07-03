// qa-chatbot-backend/server.js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config(); // ✅ Load env before importing routes

console.log('🔐 JWT_SECRET loaded:', !!process.env.JWT_SECRET);
console.log('🔑 TOGETHER_API_KEY loaded:', !!process.env.TOGETHER_API_KEY);
console.log('🛢️ MONGO_URI loaded:', !!process.env.MONGO_URI);

import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import profileRoutes from './routes/profile.js';

const app = express();
const PORT = process.env.PORT || 5000;

// 👇 Use this CORS setup
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-deployed-frontend.com'],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/profile', profileRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 The Server is running on http://0.0.0.0:${PORT}`);
    });    
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });


