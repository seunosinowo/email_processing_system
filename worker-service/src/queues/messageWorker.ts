import { Worker } from 'bullmq';
import Message from '../models/Message';
const QUEUE_NAME = 'message-queue';

export async function startWorker(redisUrl: string) {
  const worker = new Worker(
    QUEUE_NAME,
    async (job) => {
      const { messageId } = job.data;
      try {
        const message = await Message.findById(messageId);
        if (!message) {
          throw new Error(`Message with ID ${messageId} not found`);
        }
        console.log(`Sending message to ${message.email}: ${message.message}`);
      } catch (error) {
        console.error(`Failed to process job ${job.id}:`, error);
        throw error;
      }
    },
    {
      connection: {
        host: new URL(redisUrl).hostname,
        port: parseInt(new URL(redisUrl).port)
      }
    }
  );

  worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed: ${err.message}`);
  });

  return worker;
}