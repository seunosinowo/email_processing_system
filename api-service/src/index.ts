import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createMessage, getMessages } from './controllers/messageController';

dotenv.config();

export const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/email_system';
export const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());

app.post('/messages', createMessage);
app.get('/messages', getMessages);

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`API Service running on port ${PORT}`));
  } catch (error) {
    console.error('Failed to start API service:', error);
    process.exit(1);
  }
}

start();