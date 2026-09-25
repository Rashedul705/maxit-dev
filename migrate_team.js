import fs from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';

// We need to redefine the schemas here since we are running a raw Node script
const TeamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    nickname: { type: String },
    position: { type: String, required: true },
    officialTitle: { type: String },
    functionalDesignation: { type: String },
    section: { type: String },
    bio: { type: String },
    message: { type: String },
    photoUrl: { type: String },
    isCeo: { type: Boolean, default: false },
    socialLinks: {
      linkedin: String,
      whatsapp: String,
      email: String,
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const TeamMember = mongoose.models.TeamMember || mongoose.model('TeamMember', TeamMemberSchema);

async function migrate() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');

    const dataPath = path.join(process.cwd(), 'data', 'team.json');
    const rawData = await fs.readFile(dataPath, 'utf-8');
    const teamData = JSON.parse(rawData);

    // Clear existing data
    await TeamMember.deleteMany({});
    console.log('Cleared existing MongoDB team data.');

    // Migrate CEO
    if (teamData.ceo && teamData.ceo.name) {
      console.log('Migrating CEO...');
      await TeamMember.create({
        name: teamData.ceo.name,
        nickname: teamData.ceo.nickname || '',
        position: teamData.ceo.officialTitle || 'CEO',
        officialTitle: teamData.ceo.officialTitle || '',
        functionalDesignation: teamData.ceo.functionalDesignation || '',
        photoUrl: teamData.ceo.image || '',
        message: teamData.ceo.message || '',
        socialLinks: teamData.ceo.socialLinks || { linkedin: '', email: '' },
        isCeo: true,
      });
      console.log('CEO migrated successfully.');
    }

    // Migrate Members
    if (teamData.members && teamData.members.length > 0) {
      console.log(`Migrating ${teamData.members.length} members...`);
      for (const m of teamData.members) {
        await TeamMember.create({
          name: m.name,
          position: m.officialTitle || '',
          officialTitle: m.officialTitle || '',
          functionalDesignation: m.functionalDesignation || '',
          section: m.section || 'Board of Directors',
          department: m.department || '',
          bio: m.bio || '',
          photoUrl: m.image || '',
          socialLinks: m.socialLinks || { linkedin: '', email: '', whatsapp: '' },
          order: m.order || 0,
          isCeo: false,
        });
      }
      console.log('Members migrated successfully.');
    }

    console.log('Migration complete!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
