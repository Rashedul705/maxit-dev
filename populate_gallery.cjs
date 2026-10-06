const mongoose = require('mongoose');

const updateDb = async () => {
  await mongoose.connect('mongodb+srv://m4xitraj_db_user:nYEzj5w4n0TfhiD7@maxit.iolovlb.mongodb.net/?appName=Maxit');
  console.log('Connected to DB');

  const AboutContentSchema = new mongoose.Schema({
    galleryProjects: { type: [{ image: String, title: String }] }
  }, { strict: false });
  
  const AboutContent = mongoose.models.AboutContent || mongoose.model('AboutContent', AboutContentSchema);
  
  const doc = await AboutContent.findOne();
  if (doc) {
    if (!doc.galleryProjects || doc.galleryProjects.length === 0) {
      doc.galleryProjects = [
        { image: '/images/slides/agro_solar_slide_1789677870674.jpg', title: 'Agro Solar Project' }, 
        { image: '/images/slides/iot_smart_home_slide_1789677856585.jpg', title: 'Smart Home Tech' }, 
        { image: '/images/slides/networking_service_1789678979212.jpg', title: 'Networking Infrastructure' }, 
        { image: '/images/slides/commercial_rooftop_slide_1789677880098.jpg', title: 'Commercial Rooftop' }, 
        { image: '/images/projects/cctv_install.jpg', title: 'Security Setup' },
        { image: '/images/projects/data_center.jpg', title: 'Data Center' },
        { image: '/images/projects/solar_panel.jpg', title: 'Solar Array' }
      ];
      await doc.save();
      console.log('Updated gallery projects');
    } else {
      console.log('Gallery projects already populated');
    }
  } else {
    console.log('No about content doc found');
  }
  process.exit(0);
};

updateDb().catch(err => {
  console.error(err);
  process.exit(1);
});
