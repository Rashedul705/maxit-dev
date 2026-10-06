const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://m4xitraj_db_user:nYEzj5w4n0TfhiD7@maxit.iolovlb.mongodb.net/?appName=Maxit';
const PROJECT_ID = '6ab6aff8722c1e45caf740ed';

async function main() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create a generic schema that matches the collection
    const ProjectSchema = new mongoose.Schema({}, { strict: false });
    const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema, 'projects');

    const updateData = {
      clientType: "Private Commercial",
      location: "Dhaka, Bangladesh",
      stats: {
        capacityInstalled: "1.5 MW",
        energySaved: "2,000 MWh/yr",
        projectDuration: "6 Months"
      },
      challenge: "The client faced extremely high operational costs due to reliance on grid power during peak hours and frequent power outages affecting their automated agricultural equipment.",
      solution: "We designed and deployed a comprehensive smart solar-plus-storage microgrid, perfectly synchronized with their existing greenhouse environmental control systems to ensure uninterrupted power.",
      scopeOfWork: [
        "Site assessment and energy modeling",
        "Installation of 1.5 MW solar photovoltaic array",
        "Integration of 500 kWh battery energy storage system (BESS)",
        "Deployment of proprietary AI-driven energy management software",
        "Grid synchronization and regulatory compliance"
      ],
      gallery: [
        "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=800&auto=format&fit=crop"
      ]
    };

    const result = await Project.updateOne({ _id: new mongoose.Types.ObjectId(PROJECT_ID) }, { $set: updateData });
    console.log(`Update result:`, result);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

main();
