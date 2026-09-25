import mongoose from 'mongoose';

const PartnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 50,
    },
    listType: {
      type: String,
      enum: ['homepage', 'company-profile'],
      required: true,
    },
    logo: {
      type: String,
    },
    description: {
      type: String,
      maxlength: 100,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Partner || mongoose.model('Partner', PartnerSchema);
