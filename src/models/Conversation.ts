import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IConversation extends Document {
  name: string;
  email: string;
  phone?: string;
  status: 'new' | 'open' | 'replied' | 'archived';
  unreadCount: number;
  lastMessageAt: Date;
  createdAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, index: true },
    phone: { type: String },
    status: { type: String, enum: ['new', 'open', 'replied', 'archived'], default: 'new' },
    unreadCount: { type: Number, default: 1 },
    lastMessageAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Conversation: Model<IConversation> = mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', ConversationSchema);
export default Conversation;
