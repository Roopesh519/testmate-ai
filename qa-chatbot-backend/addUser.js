import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js'; // adjust path if needed
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/your-db-name'; // fallback local URI

async function addUser() {
  try {
    await mongoose.connect(uri);
    const passwordHash = await bcrypt.hash('userpassword123', 10);

    const user = new User({
      username: 'newuser',
      email: 'newuser@example.com',
      password: passwordHash,
    });

    await user.save();
    console.log('User created');
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await mongoose.disconnect();
  }
}

addUser();
