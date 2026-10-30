import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found in backend/.env');
  process.exit(1);
}

const partnerMap = {
  nesco: '/partners/nesco.png',
  'palli bidyut': '/partners/palli-bidyut.png',
  'nabil group': '/partners/nabil-group.png',
  'income tax': '/partners/income-tax-office.png',
  'city corp': '/partners/rajshahi-city-corp.png',
  rmp: '/partners/rmp-police.png',
  bmda: '/partners/bmda.png',
  pksf: '/partners/pksf.png',
  brac: '/partners/brac-ngo.png',
  'rajshahi university': '/partners/rajshahi-university.png',
  badc: '/partners/badc.png',
  krishi: '/partners/rkub.png',
  rkub: '/partners/rkub.png',
  'urban health': '/partners/urban-health-care.png',
  roads: '/partners/roads-highways.png',
  lged: '/partners/lged.png',
  eed: '/partners/eed.png',
  dphe: '/partners/dphe.png',
  dsb: '/partners/dsb-rajshahi.png',
  rab: '/partners/rab-rajshahi.png',
  ttc: '/partners/ttc.png',
  teachers: '/partners/ttc.png',
  panchagarh: '/partners/panchagarh-police.png',
  'aman cold': '/partners/aman-cold-storage.jpg',
  'uttara cold': '/partners/uttara-cold-storage.jpg',
  mohila: '/partners/rajshahi-mohila-polytechnic-in.png',
  polytechnic: '/partners/rajshahi-polytechnic-ins.png',
  'bangla bari': '/partners/bangla-bari-s-c.png',
  basantapur: '/partners/basantapur-s-c.png',
};

function matchPartnerLogo(name) {
  const n = name.toLowerCase();
  for (const [key, val] of Object.entries(partnerMap)) {
    if (n.includes(key)) return val;
  }
  return null;
}

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  console.log('Connected to DB:', db.databaseName);

  // 1. Migrate Partners
  console.log('\n--- Migrating Partners ---');
  const partners = await db.collection('partners').find({}).toArray();
  let updatedPartners = 0;
  for (const p of partners) {
    if (p.logo && p.logo.includes('ibb.co')) {
      const localLogo = matchPartnerLogo(p.name);
      if (localLogo) {
        await db.collection('partners').updateOne(
          { _id: p._id },
          { $set: { logo: localLogo } }
        );
        console.log(`Updated partner: ${p.name} -> ${localLogo}`);
        updatedPartners++;
      } else {
        console.warn(`No match found for partner: ${p.name}`);
      }
    }
  }
  console.log(`Updated ${updatedPartners} partners.`);

  // 2. Migrate Testimonials
  console.log('\n--- Migrating Testimonials ---');
  const testimonials = await db.collection('testimonials').find({}).toArray();
  let updatedTestimonials = 0;
  for (const t of testimonials) {
    if (t.imageUrl && t.imageUrl.includes('ibb.co')) {
      let localImg = null;
      const combined = `${t.name} ${t.company}`.toLowerCase();
      if (combined.includes('bmda')) localImg = '/partners/bmda.png';
      else if (combined.includes('nabil')) localImg = '/partners/nabil-group.png';
      else if (combined.includes('krishi') || combined.includes('rkub')) localImg = '/partners/rkub.png';

      if (localImg) {
        await db.collection('testimonials').updateOne(
          { _id: t._id },
          { $set: { imageUrl: localImg } }
        );
        console.log(`Updated testimonial: ${t.name} -> ${localImg}`);
        updatedTestimonials++;
      } else {
        console.warn(`No match found for testimonial: ${t.name} (${t.company})`);
      }
    }
  }
  console.log(`Updated ${updatedTestimonials} testimonials.`);

  // 3. Migrate Services
  console.log('\n--- Migrating Services ---');
  const solarService = await db.collection('services').findOne({
    title: /solar energy/i,
  });
  if (solarService && solarService.imageUrl && solarService.imageUrl.includes('ibb.co')) {
    await db.collection('services').updateOne(
      { _id: solarService._id },
      { $set: { imageUrl: '/images/slides/commercial_rooftop_slide_1789677880098.jpg' } }
    );
    console.log('Updated Solar Energy service imageUrl to /images/slides/commercial_rooftop_slide_1789677880098.jpg');
  }

  // 4. Migrate Projects
  console.log('\n--- Migrating Projects ---');
  const agroProject = await db.collection('projects').findOne({
    title: /automated hydroponic/i,
  });
  if (agroProject && agroProject.imageUrl && agroProject.imageUrl.includes('ibb.co')) {
    await db.collection('projects').updateOne(
      { _id: agroProject._id },
      { $set: { imageUrl: '/images/projects/agro_tech.jpg' } }
    );
    console.log('Updated Automated Hydroponic Greenhouse project imageUrl to /images/projects/agro_tech.jpg');
  }

  // 5. Migrate HomeContent
  console.log('\n--- Migrating HomeContent ---');
  const homeDoc = await db.collection('homecontents').findOne({});
  if (homeDoc) {
    const updateOps = {};
    if (homeDoc.aboutPreview?.image?.includes('ibb.co')) {
      updateOps['aboutPreview.image'] = '/images/about_preview.jpg';
    }
    if (Array.isArray(homeDoc.hero?.backgroundImages)) {
      const updatedHeroImgs = homeDoc.hero.backgroundImages.map((img) => {
        if (typeof img === 'string' && img.includes('ibb.co')) {
          return '/images/slides/hero_slide_4.jpg';
        }
        return img;
      });
      updateOps['hero.backgroundImages'] = updatedHeroImgs;
    }
    if (Object.keys(updateOps).length > 0) {
      await db.collection('homecontents').updateOne({ _id: homeDoc._id }, { $set: updateOps });
      console.log('Updated homecontents:', Object.keys(updateOps));
    }
  }

  // 6. Migrate AboutContent
  console.log('\n--- Migrating AboutContent ---');
  const aboutDoc = await db.collection('aboutcontents').findOne({});
  if (aboutDoc && Array.isArray(aboutDoc.galleryProjects)) {
    const updatedGallery = aboutDoc.galleryProjects.map((proj) => {
      if (typeof proj.image === 'string' && proj.image.includes('ibb.co')) {
        const title = (proj.title || '').toLowerCase();
        let replacement = '/images/slides/cctv_service_1789678989455.jpg';
        if (title.includes('security')) replacement = '/images/slides/cctv_service_1789678989455.jpg';
        else if (title.includes('data center')) replacement = '/images/slides/networking_service_1789678979212.jpg';
        else if (title.includes('solar')) replacement = '/images/slides/solar_automation_slide_1789677805531.jpg';
        else if (title.includes('irrigation')) replacement = '/images/slides/agro_tech_service_1789678968707.jpg';
        return { ...proj, image: replacement };
      }
      return proj;
    });
    await db.collection('aboutcontents').updateOne(
      { _id: aboutDoc._id },
      { $set: { galleryProjects: updatedGallery } }
    );
    console.log('Updated aboutcontents galleryProjects');
  }

  console.log('\n--- Checking for remaining ibb.co references ---');
  const collections = await db.listCollections().toArray();
  let remainingCount = 0;
  for (const col of collections) {
    const docs = await db.collection(col.name).find({}).toArray();
    for (const d of docs) {
      if (JSON.stringify(d).includes('ibb.co')) {
        console.warn(`Found remaining ibb.co in ${col.name} document ${d._id}`);
        remainingCount++;
      }
    }
  }

  if (remainingCount === 0) {
    console.log('SUCCESS: Zero ibb.co references remain in MongoDB!');
  } else {
    console.warn(`WARNING: ${remainingCount} ibb.co references still remain.`);
  }

  await mongoose.disconnect();
  console.log('Done!');
}

run().catch((err) => {
  console.error('Error running migration:', err);
  process.exit(1);
});
