import mongoose from 'mongoose';

const TeamSectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    order: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

export default mongoose.models.TeamSection || mongoose.model('TeamSection', TeamSectionSchema);
