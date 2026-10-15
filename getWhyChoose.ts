import mongoose from 'mongoose';  
import dotenv from 'dotenv';
import HomeContent from './backend/src/models/HomeContent.js';  

dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI is not set');
  process.exit(1);
}

mongoose.connect(uri).then(async () => {
  const doc = await HomeContent.findOne();
  console.log(JSON.stringify(doc?.whyChooseUs?.cards, null, 2));
  mongoose.disconnect();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
