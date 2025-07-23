import { Request, Response } from 'express';
import { z } from 'zod';
import Message, { IMessage } from '../models/Message';
import { addMessageJob } from '../queues/messageQueue';
import { MessageInput } from '../types';

const messageSchema = z.object({
  email: z.string().email('Invalid email format'),
  message: z.string().min(1, 'Message cannot be empty')
});

export const createMessage = async (req: Request, res: Response) => {
  try {
    const validatedData = messageSchema.parse(req.body) as MessageInput;
    const message = new Message(validatedData);
    await message.save();
    await addMessageJob(message._id.toString());
    res.status(201).json({ message: 'Message queued successfully', id: message._id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMessages = async (_req: Request, res: Response) => {
  try {
    const messages: IMessage[] = await Message.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};