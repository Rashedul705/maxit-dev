import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const ReasonSchema = new mongoose.Schema({
  title: String,
  description: String,
  iconCategory: String,
  gradient: String,
  order: Number
}, { timestamps: true });
const Reason = mongoose.model('Reason', ReasonSchema);

const reasons = [
  {
    title: "Sustainable Energy",
    description: "Harnessing the power of the sun for a greener, cost-effective, and highly efficient future.",
    iconCategory: "Sun",
    gradient: "from-amber-400 to-orange-500",
  },
  {
    title: "Technical Expertise",
    description: "Reliable technical solutions backed by years of robust experience in automation and precise engineering.",
    iconCategory: "Settings",
    gradient: "from-blue-400 to-indigo-500",
  },
  {
    title: "Agro Innovation",
    description: "Modernizing agriculture with smart irrigation and cutting-edge technology-driven solutions.",
    iconCategory: "Leaf",
    gradient: "from-green-400 to-emerald-500",
  },
  {
    title: "Smart Automation",
    description: "Seamlessly connect and control industrial and home environments with intelligent IoT systems.",
    iconCategory: "Cpu",
    gradient: "from-purple-400 to-pink-500",
  },
  {
    title: "24/7 Premium Support",
    description: "Our dedicated support team ensures your systems run flawlessly around the clock without interruption.",
    iconCategory: "Headphones",
    gradient: "from-rose-400 to-red-500",
  },
  {
    title: "Cost Efficiency",
    description: "Optimized energy and automation systems designed to significantly lower your operational expenses.",
    iconCategory: "TrendingDown",
    gradient: "from-teal-400 to-cyan-500",
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
    const count = await Reason.countDocuments();
    if (count === 0) {
      const docs = reasons.map((r, index) => ({
        ...r,
        order: index + 1
      }));
      await Reason.insertMany(docs);
      console.log('Seeded reasons');
    } else {
      console.log('Reasons already seeded');
    }
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
seed();
