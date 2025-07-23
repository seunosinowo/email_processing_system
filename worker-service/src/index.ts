import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { startWorker } from './queues/messageWorker';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/email_system';
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    await startWorker(REDIS_URL);
    console.log('Worker service started');
  } catch (error) {
    console.error('Failed to start worker service:', error);
    process.exit(1);
  }
}

start();
