import mongoose from 'mongoose';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const mongoUri = envContent.split('\n').find(line => line.startsWith('MONGODB_URI=')).split('=')[1];

async function check() {
  await mongoose.connect(mongoUri);
  const TeamMember = mongoose.models.TeamMember || mongoose.model('TeamMember', new mongoose.Schema({}, { strict: false }));
  const members = await TeamMember.find({});
  console.log(JSON.stringify(members, null, 2));
  process.exit(0);
}
check();
