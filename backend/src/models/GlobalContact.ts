import mongoose from 'mongoose';

const GlobalContactSchema = new mongoose.Schema(
  {
    addressLine1: {
      type: String,
      default: 'Afroza Tower, 4th Floor,',
    },
    addressLine2: {
      type: String,
      default: 'Uposhohor Newmarket,',
    },
    addressLine3: {
      type: String,
      default: 'Rajshahi-6000',
    },
    phoneNumber: {
      type: String,
      default: '+88 01733-272445',
    },
    whatsappNumber: {
      type: String,
      default: '01733272445',
    },
    email: {
      type: String,
      default: 'sales@m4xit.com',
    },
    facebookUrl: {
      type: String,
      default: '#',
    },
    linkedinUrl: {
      type: String,
      default: '#',
    },
    githubUrl: {
      type: String,
      default: '#',
    }
  },
  { timestamps: true }
);

export default mongoose.models.GlobalContact || mongoose.model('GlobalContact', GlobalContactSchema);
