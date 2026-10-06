import mongoose from 'mongoose';

const ProjectCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    order: { type: Number, default: 0 }
  }
);
const ProjectCategory = mongoose.models.ProjectCategory || mongoose.model('ProjectCategory', ProjectCategorySchema);

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const cats = [
    "Solar Energy", "Smart Home & Solar", "Agro Tech", "Networking", "Security", "Automation"
  ];

  for (let i = 0; i < cats.length; i++) {
    try {
      await ProjectCategory.create({ name: cats[i], order: i });
      console.log("Created cat:", cats[i]);
    } catch (e) {
      console.log("Failed or exists:", cats[i]);
    }
  }
  
  process.exit(0);
}
run();
