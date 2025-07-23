import { Queue } from 'bullmq';
import { REDIS_URL } from '../index';

export const QUEUE_NAME = 'message-queue';

export const messageQueue = new Queue(QUEUE_NAME, {
  connection: {
    host: new URL(REDIS_URL).hostname,
    port: parseInt(new URL(REDIS_URL).port)
  }
});

export async function addMessageJob(messageId: string) {
  await messageQueue.add('process-message', { messageId }, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000
    }
  });
}