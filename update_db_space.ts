import dbConnect from './src/lib/mongodb.ts';
import Testimonial from './src/models/Testimonial.ts';
import CompanyProfileData from './src/models/CompanyProfileData.ts';
import TeamMember from './src/models/TeamMember.ts';
import TeamSection from './src/models/TeamSection.ts';
import HeroContent from './src/models/HeroContent.ts';
import AboutContent from './src/models/AboutContent.ts';
import Service from './src/models/Service.ts';
import Project from './src/models/Project.ts';
import Reason from './src/models/Reason.ts';
import SiteSettings from './src/models/SiteSettings.ts';

const updateDatabaseSpace = async () => {
  await dbConnect();
  
  const replaceMaxITSpace = (text: string | undefined | null) => {
    if (!text) return text;
    // Replace "Max IT" or "MAX IT" with space
    return text.replace(/Max IT|MAX IT/g, 'Max iT');
  };

  // Testimonials
  const testimonials = await Testimonial.find();
  for (const doc of testimonials) {
    if (doc.testimonial) doc.testimonial = replaceMaxITSpace(doc.testimonial);
    await doc.save();
  }

  // Company Profile Data
  const profiles = await CompanyProfileData.find();
  for (const doc of profiles) {
    if (doc.howWeWork) {
      for (const hw of doc.howWeWork) {
        if (hw.title) hw.title = replaceMaxITSpace(hw.title);
        if (hw.description) hw.description = replaceMaxITSpace(hw.description);
      }
    }
    if (doc.whyChooseUs) {
      for (const wcu of doc.whyChooseUs) {
        if (wcu.title) wcu.title = replaceMaxITSpace(wcu.title);
        if (wcu.description) wcu.description = replaceMaxITSpace(wcu.description);
      }
    }
    if (doc.capabilities) {
      for (let i = 0; i < doc.capabilities.length; i++) {
        doc.capabilities[i] = replaceMaxITSpace(doc.capabilities[i]);
      }
    }
    await doc.save();
  }

  // Team Members
  const members = await TeamMember.find();
  for (const doc of members) {
    if (doc.bio) doc.bio = replaceMaxITSpace(doc.bio);
    await doc.save();
  }

  // Team Section
  const teamSections = await TeamSection.find();
  for (const doc of teamSections) {
    if (doc.title) doc.title = replaceMaxITSpace(doc.title);
    if (doc.subtitle) doc.subtitle = replaceMaxITSpace(doc.subtitle);
    if (doc.description) doc.description = replaceMaxITSpace(doc.description);
    await doc.save();
  }

  console.log("Database 'Max IT' (with space) fully updated!");
  process.exit(0);
};

updateDatabaseSpace();
