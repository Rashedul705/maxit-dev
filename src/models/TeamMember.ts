import mongoose from 'mongoose';

const TeamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    nickname: {
      type: String,
    },
    position: {
      type: String,
      required: true,
    },
    officialTitle: {
      type: String,
    },
    functionalDesignation: {
      type: String,
    },
    section: {
      type: String,
    },
    bio: {
      type: String,
    },
    message: {
      type: String,
    },
    photoUrl: {
      type: String,
    },
    isCeo: {
      type: Boolean,
      default: false,
    },
    socialLinks: {
      linkedin: String,
      whatsapp: String,
      email: String,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.TeamMember || mongoose.model('TeamMember', TeamMemberSchema);
