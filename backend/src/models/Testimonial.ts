import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    testimonial: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
