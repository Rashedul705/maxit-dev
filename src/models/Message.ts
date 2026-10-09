import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage extends Document {
  conversationId: mongoose.Types.ObjectId;
  direction: 'incoming' | 'outgoing';
  body: string;
  readAt?: Date;
  emailStatus?: 'sent' | 'failed';
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
    direction: { type: String, enum: ['incoming', 'outgoing'], required: true },
    body: { type: String, required: true },
    readAt: { type: Date },
    emailStatus: { type: String, enum: ['sent', 'failed'] }
  },
  { timestamps: true }
);

const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);
export default Message;
