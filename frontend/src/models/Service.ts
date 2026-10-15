import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    iconCategory: {
      type: String,
      default: 'Settings',
    },
    iconUrl: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    subServices: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Service || mongoose.model('Service', ServiceSchema);
