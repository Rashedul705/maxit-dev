import mongoose from 'mongoose';

let isConnected = false;

export async function dbConnect() {
  if (isConnected && mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  try {
    const conn = await mongoose.connect(uri);
    isConnected = true;
    console.log('[MongoDB] Connected to database successfully.');
    return conn.connection;
  } catch (error) {
    console.error('[MongoDB] Connection error:', error);
    throw error;
  }
}

export default dbConnect;
