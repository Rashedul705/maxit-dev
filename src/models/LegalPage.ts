import mongoose from 'mongoose';

const LegalPageSchema = new mongoose.Schema(
  {
    privacyPolicy: {
      type: String,
      default: 'Privacy Policy content goes here...'
    },
    termsOfService: {
      type: String,
      default: 'Terms of Service content goes here...'
    }
  },
  { timestamps: true }
);

export default mongoose.models.LegalPage || mongoose.model('LegalPage', LegalPageSchema);
