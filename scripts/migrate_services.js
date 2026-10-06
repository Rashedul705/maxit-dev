import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    iconCategory: { type: String, required: true, default: 'Settings' },
    imageUrl: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);

const servicesData = [
  { iconCategory: "Cpu", title: "Computer & Accessories", description: "Enterprise-grade IT hardware supply and comprehensive computer accessories.", imageUrl: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=800&q=80" },
  { iconCategory: "Activity", title: "Data Logger & IoT R&D", description: "Custom research, development, and deployment of intelligent IoT devices and data logging systems.", imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80" },
  { iconCategory: "Settings", title: "Server & Security Systems", description: "Robust server infrastructure setup and advanced cybersecurity implementations.", imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80" },
  { iconCategory: "Cctv", title: "CCTV Surveillance", description: "High-definition, continuous monitoring camera systems for total premises security.", imageUrl: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&q=80" },
  { iconCategory: "Target", title: "AI-Based Camera Models", description: "Next-generation smart cameras with artificial intelligence for automated threat detection and analytics.", imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80" }
];

async function migrate() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');

    await Service.deleteMany({});
    console.log('Cleared existing services.');

    let order = 1;
    for (const s of servicesData) {
      await Service.create({
        title: s.title,
        description: s.description,
        iconCategory: s.iconCategory,
        imageUrl: s.imageUrl,
        order: order++
      });
    }

    console.log('Services migrated successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}
migrate();
