import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  email: string;
  message: string;
  createdAt: Date;
}

const MessageSchema: Schema = new Schema({
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IMessage>('Message', MessageSchema);