import mongoose from 'mongoose';

let isConnected = false;

export function getDbState(): 'connected' | 'connecting' | 'disconnecting' | 'disconnected' {
  switch (mongoose.connection.readyState) {
    case 1:
      return 'connected';
    case 2:
      return 'connecting';
    case 3:
      return 'disconnecting';
    default:
      return 'disconnected';
  }
}

export function isDbConnected(): boolean {
  return mongoose.connection.readyState === 1;
}


export async function dbConnect() {
  if (isConnected && mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log('[MongoDB] Connected to database successfully.');
    return conn.connection;
  } catch (error) {
    console.error('[MongoDB] Connection error:', error);
    throw error;
  }
}

export default dbConnect;
