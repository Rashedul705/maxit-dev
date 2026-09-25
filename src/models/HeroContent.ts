import mongoose from 'mongoose';

const StatSchema = new mongoose.Schema({
  end: { type: Number, required: true },
  suffix: { type: String, default: "" },
  label: { type: String, required: true }
}, { _id: false });

const HeroContentSchema = new mongoose.Schema(
  {
    brandingText: {
      type: String,
      default: 'MAXIT',
    },
    titleLine1: {
      type: String,
      default: 'Solar Energy &',
    },
    titleLine2: {
      type: String,
      default: 'Smart Automation',
    },
    description: {
      type: String,
      default: 'Empowering your future with sustainable energy solutions, advanced agro-technology, and intelligent industrial automation.',
    },
    stats: {
      type: [StatSchema],
      default: [
        { end: 50, suffix: '+', label: 'Projects' },
        { end: 30, suffix: '+', label: 'Clients' },
        { end: 10, suffix: '+', label: 'Years Exp' },
        { end: 24, suffix: '/7', label: 'Support' }
      ]
    }
  },
  { timestamps: true }
);

export default mongoose.models.HeroContent || mongoose.model('HeroContent', HeroContentSchema);
