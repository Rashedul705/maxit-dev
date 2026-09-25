import mongoose from 'mongoose';

const AboutContentSchema = new mongoose.Schema(
  {
    journey: {
      type: String,
      required: true,
    },
    mission: {
      type: String,
      required: true,
    },
    vision: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.models.AboutContent || mongoose.model('AboutContent', AboutContentSchema);
