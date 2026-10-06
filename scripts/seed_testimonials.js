import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const TestimonialSchema = new mongoose.Schema({
  name: String,
  company: String,
  testimonial: String,
  rating: Number,
  imageUrl: String,
  order: Number
}, { timestamps: true });
const Testimonial = mongoose.model('Testimonial', TestimonialSchema);

const testimonials = [
  {
    name: "Sarah Ahmed",
    company: "Green Farms Ltd",
    testimonial: "MaxIT Solution's solar irrigation system transformed our farming efficiency. Highly professional and reliable implementation.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop"
  },
  {
    name: "Mohammad Rahman",
    company: "Industrial Complex",
    testimonial: "Their automation solutions have significantly reduced our operational costs. Excellent technical expertise.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop"
  },
  {
    name: "Fatima Khan",
    company: "Eco Home Owner",
    testimonial: "The solar home system installation was smooth and the team was very knowledgeable. Great service!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop"
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
    const count = await Testimonial.countDocuments();
    if (count === 0) {
      const docs = testimonials.map((t, index) => ({
        name: t.name,
        company: t.company,
        testimonial: t.testimonial,
        rating: t.rating,
        imageUrl: t.image,
        order: index + 1
      }));
      await Testimonial.insertMany(docs);
      console.log('Seeded testimonials');
    } else {
      console.log('Testimonials already seeded');
    }
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
seed();
