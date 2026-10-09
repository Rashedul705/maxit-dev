import mongoose from 'mongoose';  
import HomeContent from './src/models/HomeContent.js';  
mongoose.connect('mongodb+srv://m4xitraj_db_user:nYEzj5w4n0TfhiD7@maxit.iolovlb.mongodb.net/?appName=Maxit').then(async () = const doc = await HomeContent.findOne(); console.log(JSON.stringify(doc.whyChooseUs.cards, null, 2)); mongoose.disconnect(); });  
