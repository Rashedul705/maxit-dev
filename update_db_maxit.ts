import dbConnect from './src/lib/mongodb.ts';
import HeroContent from './src/models/HeroContent.ts';
import AboutContent from './src/models/AboutContent.ts';

const updateDatabase = async () => {
  await dbConnect();
  
  // Hero Content
  const heroDocs = await HeroContent.find();
  for (const doc of heroDocs) {
    let updated = false;
    if (doc.brandingText && doc.brandingText.match(/Maxit|MaxIT|MAXIT/i)) {
      doc.brandingText = doc.brandingText.replace(/Maxit|MaxIT|MAXIT/gi, 'Max iT');
      updated = true;
    }
    if (updated) await doc.save();
  }

  // About Content
  const aboutDocs = await AboutContent.find();
  for (const doc of aboutDocs) {
    let updated = false;
    if (doc.journey && doc.journey.match(/Maxit|MaxIT|MAXIT/i)) {
      doc.journey = doc.journey.replace(/Maxit|MaxIT|MAXIT/gi, 'Max iT');
      updated = true;
    }
    if (updated) await doc.save();
  }

  console.log("Database updated!");
  process.exit(0);
};

updateDatabase();
