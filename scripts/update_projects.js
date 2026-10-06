import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  shortDescription: String,
  category: String,
  client: String,
  date: String,
  technologies: [String],
  clientType: String,
  location: String,
  challenge: String,
  solution: String,
  scopeOfWork: [String],
  gallery: [String],
  stats: {
    capacityInstalled: String,
    energySaved: String,
    projectDuration: String
  },
  imageUrl: String,
  order: Number
}, { strict: false });

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const projects = await Project.find({});
  
  // Update all other projects with dummy data based on Urban Solar Roof Integration
  for (const p of projects) {
    if (p.title !== 'Urban Solar Roof Integration') {
      p.clientType = "Private Commercial";
      p.challenge = "We designed and installed a custom, aesthetically pleasing solar energy system for a newly constructed modern home. The 15kW system utilizes premium, low-profile black solar panels that blend seamlessly with the home's architecture. Integrated with a smart energy gateway, the homeowners can track real-time energy production and consumption, allowing them to achieve net-zero energy status.";
      p.solution = "We designed and installed a custom, aesthetically pleasing solar energy system for a newly constructed modern home. The 15kW system utilizes premium, low-profile black solar panels that blend seamlessly with the home's architecture. Integrated with a smart energy gateway, the homeowners can track real-time energy production and consumption, allowing them to achieve net-zero energy status.";
      p.scopeOfWork = [
        "Site assessment and structural analysis",
        "Custom system design and engineering",
        "Installation of 15kW solar array",
        "Integration with smart home energy gateway",
        "Utility interconnection and permitting",
        "System testing and commissioning"
      ];
      p.stats = {
        capacityInstalled: "1.5 MW",
        energySaved: "2,000 MWh/yr",
        projectDuration: "6 Months"
      };
      
      if (!p.client) p.client = "The Anderson Family";
      if (!p.location) p.location = "Dhaka, Bangladesh";
      if (!p.date) p.date = "October 2023";
      if (!p.category) p.category = "Solar Energy";
      if (!p.gallery || p.gallery.length === 0) {
        p.gallery = [
          "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2072&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=2072&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=1974&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=2070&auto=format&fit=crop"
        ];
      }
      if (!p.technologies || p.technologies.length === 0) {
        p.technologies = ["Solar Panels", "Smart Inverter", "Energy Gateway", "Battery Storage"];
      }
      await p.save();
      console.log(`Updated project: ${p.title}`);
    }
  }
  
  console.log("Done updating projects");
  process.exit(0);
}
run();
