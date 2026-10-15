import mongoose from 'mongoose';

const ReasonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    iconCategory: {
      type: String,
      default: 'Settings',
    },
    gradient: {
      type: String,
      default: 'from-blue-400 to-indigo-500',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Reason || mongoose.model('Reason', ReasonSchema);
