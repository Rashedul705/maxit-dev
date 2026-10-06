import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

const ProjectSchema = new mongoose.Schema({
  title: String,
});
const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

async function run() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  const projects = await Project.find({});
  console.log(JSON.stringify(projects, null, 2));
  process.exit(0);
}
run();
