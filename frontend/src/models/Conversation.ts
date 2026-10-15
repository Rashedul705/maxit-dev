import mongoose, { Schema, Document, Model } from 'mongoose';

export type ConversationStatus = 'unread' | 'new' | 'open' | 'replied' | 'archived';

export interface IConversation extends Document {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  status: ConversationStatus;
  unreadCount: number;
  lastMessagePreview?: string;
  threadMessageId?: string;
  emailStatus?: 'sent' | 'failed' | 'pending';
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, index: true },
    phone: { type: String },
    subject: { type: String, default: 'Website Inquiry' },
    status: { 
      type: String, 
      enum: ['unread', 'new', 'open', 'replied', 'archived'], 
      default: 'unread' 
    },
    unreadCount: { type: Number, default: 1 },
    lastMessagePreview: { type: String, default: '' },
    threadMessageId: { type: String },
    emailStatus: { type: String, enum: ['sent', 'failed', 'pending'], default: 'pending' },
    lastMessageAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

if (mongoose.models && (mongoose.models as any).Conversation) {
  delete (mongoose.models as any).Conversation;
}

const Conversation: Model<IConversation> = mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', ConversationSchema);
export default Conversation;
