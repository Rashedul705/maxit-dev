import mongoose from 'mongoose';

const AboutContentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    stats: [{
      label: String,
      value: String
    }],
    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.models.AboutContent || mongoose.model('AboutContent', AboutContentSchema);
