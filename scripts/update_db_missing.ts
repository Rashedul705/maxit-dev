import dbConnect from './src/lib/mongodb.ts';
import Testimonial from './src/models/Testimonial.ts';
import CompanyProfileData from './src/models/CompanyProfileData.ts';
import TeamMember from './src/models/TeamMember.ts';
import TeamSection from './src/models/TeamSection.ts';

const updateDatabaseAllMissing = async () => {
  await dbConnect();
  
  const replaceMaxit = (text: string | undefined | null) => {
    if (!text) return text;
    return text.replace(/Maxit|MaxIT|MAXIT/g, 'Max iT');
  };

  // Testimonials (Field is 'testimonial', not 'quote')
  const testimonials = await Testimonial.find();
  for (const doc of testimonials) {
    let updated = false;
    if (doc.testimonial && doc.testimonial.match(/Maxit|MaxIT|MAXIT/g)) {
      doc.testimonial = replaceMaxit(doc.testimonial);
      updated = true;
    }
    if (updated) await doc.save();
  }

  // Company Profile Data
  const profiles = await CompanyProfileData.find();
  for (const doc of profiles) {
    let updated = false;
    
    // howWeWork
    if (doc.howWeWork) {
      for (const hw of doc.howWeWork) {
        if (hw.title && hw.title.match(/Maxit|MaxIT|MAXIT/g)) { hw.title = replaceMaxit(hw.title); updated = true; }
        if (hw.description && hw.description.match(/Maxit|MaxIT|MAXIT/g)) { hw.description = replaceMaxit(hw.description); updated = true; }
      }
    }
    
    // whyChooseUs
    if (doc.whyChooseUs) {
      for (const wcu of doc.whyChooseUs) {
        if (wcu.title && wcu.title.match(/Maxit|MaxIT|MAXIT/g)) { wcu.title = replaceMaxit(wcu.title); updated = true; }
        if (wcu.description && wcu.description.match(/Maxit|MaxIT|MAXIT/g)) { wcu.description = replaceMaxit(wcu.description); updated = true; }
      }
    }
    
    // capabilities
    if (doc.capabilities) {
      for (let i = 0; i < doc.capabilities.length; i++) {
        if (doc.capabilities[i].match(/Maxit|MaxIT|MAXIT/g)) {
          doc.capabilities[i] = replaceMaxit(doc.capabilities[i]);
          updated = true;
        }
      }
    }

    if (updated) await doc.save();
  }

  // Team Members
  const members = await TeamMember.find();
  for (const doc of members) {
    let updated = false;
    if (doc.bio && doc.bio.match(/Maxit|MaxIT|MAXIT/g)) {
      doc.bio = replaceMaxit(doc.bio);
      updated = true;
    }
    if (updated) await doc.save();
  }

  // Team Section
  const teamSections = await TeamSection.find();
  for (const doc of teamSections) {
    let updated = false;
    if (doc.title && doc.title.match(/Maxit|MaxIT|MAXIT/g)) {
      doc.title = replaceMaxit(doc.title);
      updated = true;
    }
    if (doc.subtitle && doc.subtitle.match(/Maxit|MaxIT|MAXIT/g)) {
      doc.subtitle = replaceMaxit(doc.subtitle);
      updated = true;
    }
    if (doc.description && doc.description.match(/Maxit|MaxIT|MAXIT/g)) {
      doc.description = replaceMaxit(doc.description);
      updated = true;
    }
    if (updated) await doc.save();
  }

  console.log("Database missing fields fully updated!");
  process.exit(0);
};

updateDatabaseAllMissing();
