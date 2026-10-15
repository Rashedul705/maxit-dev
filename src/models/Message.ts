import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage extends Document {
  conversationId: mongoose.Types.ObjectId;
  direction: 'incoming' | 'outgoing';
  senderName?: string;
  senderEmail?: string;
  subject?: string;
  body: string;
  messageId?: string;
  readAt?: Date;
  emailStatus?: 'sent' | 'failed' | 'pending' | 'skipped';
  errorDetails?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
    direction: { type: String, enum: ['incoming', 'outgoing'], required: true },
    senderName: { type: String },
    senderEmail: { type: String },
    subject: { type: String },
    body: { type: String, required: true },
    messageId: { type: String, unique: true, sparse: true, index: true },
    readAt: { type: Date },
    emailStatus: { type: String, enum: ['sent', 'failed', 'pending', 'skipped'], default: 'pending' },
    errorDetails: { type: String }
  },
  { timestamps: true }
);

if (mongoose.models && (mongoose.models as any).Message) {
  delete (mongoose.models as any).Message;
}

const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);
export default Message;
