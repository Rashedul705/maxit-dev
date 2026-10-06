import dbConnect from './src/lib/mongodb.ts';
import Testimonial from './src/models/Testimonial.ts';
import Service from './src/models/Service.ts';
import Project from './src/models/Project.ts';
import Reason from './src/models/Reason.ts';
import SiteSettings from './src/models/SiteSettings.ts';

const updateDatabaseAll = async () => {
  await dbConnect();
  
  const replaceMaxit = (text: string | undefined | null) => {
    if (!text) return text;
    return text.replace(/Maxit|MaxIT|MAXIT/g, 'Max iT');
  };

  // Testimonials
  const testimonials = await Testimonial.find();
  for (const doc of testimonials) {
    let updated = false;
    if (doc.quote && doc.quote.match(/Maxit|MaxIT|MAXIT/g)) {
      doc.quote = replaceMaxit(doc.quote);
      updated = true;
    }
    if (updated) await doc.save();
  }

  // Services
  const services = await Service.find();
  for (const doc of services) {
    let updated = false;
    if (doc.title && doc.title.match(/Maxit|MaxIT|MAXIT/g)) {
      doc.title = replaceMaxit(doc.title);
      updated = true;
    }
    if (updated) await doc.save();
  }

  // Projects
  const projects = await Project.find();
  for (const doc of projects) {
    let updated = false;
    if (doc.title && doc.title.match(/Maxit|MaxIT|MAXIT/g)) {
      doc.title = replaceMaxit(doc.title);
      updated = true;
    }
    if (doc.description && doc.description.match(/Maxit|MaxIT|MAXIT/g)) {
      doc.description = replaceMaxit(doc.description);
      updated = true;
    }
    if (updated) await doc.save();
  }

  // Reasons
  const reasons = await Reason.find();
  for (const doc of reasons) {
    let updated = false;
    if (doc.title && doc.title.match(/Maxit|MaxIT|MAXIT/g)) {
      doc.title = replaceMaxit(doc.title);
      updated = true;
    }
    if (doc.description && doc.description.match(/Maxit|MaxIT|MAXIT/g)) {
      doc.description = replaceMaxit(doc.description);
      updated = true;
    }
    if (updated) await doc.save();
  }

  // SiteSettings
  const settings = await SiteSettings.find();
  for (const doc of settings) {
    let updated = false;
    const fieldsToUpdate = [
      'siteName', 'siteDescription', 'contactEmail', 
      'aboutHeaderTitle', 'aboutHeaderSubtitle', 'aboutMissionTitle', 'aboutMissionText', 'aboutVisionTitle', 'aboutVisionText',
      'servicesHeaderTitle', 'servicesHeaderSubtitle',
      'projectsHeaderTitle', 'projectsHeaderSubtitle',
      'contactHeaderTitle', 'contactHeaderSubtitle'
    ];
    for (const field of fieldsToUpdate) {
      if (doc[field] && typeof doc[field] === 'string' && doc[field].match(/Maxit|MaxIT|MAXIT/g)) {
        if (field !== 'contactEmail') { // Don't mess up emails!
          doc[field] = replaceMaxit(doc[field]);
          updated = true;
        }
      }
    }
    if (updated) await doc.save();
  }

  console.log("Database fully updated!");
  process.exit(0);
};

updateDatabaseAll();
