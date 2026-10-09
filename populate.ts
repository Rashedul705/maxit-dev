import mongoose from 'mongoose';  
import dotenv from 'dotenv';  
dotenv.config({ path: '.env' });  
mongoose.connect(process.env.MONGODB_URI as string).then(() =
