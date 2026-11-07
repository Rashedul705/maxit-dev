import mongoose from 'mongoose';

let isConnected = false;
let connectingPromise: Promise<any> | null = null;
let listenersAttached = false;

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

function attachListeners() {
  if (listenersAttached) return;
  listenersAttached = true;

  mongoose.connection.on('connected', () => {
    isConnected = true;
    console.log('[MongoDB] State changed: Connected.');
  });

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    console.warn('[MongoDB] State changed: Disconnected. Scheduling auto-reconnect in 2s...');
    setTimeout(() => {
      dbConnect().catch((err: any) => {
        console.warn('[MongoDB] Auto-reconnect failed (will retry):', err?.message || err);
      });
    }, 2000);
  });

  mongoose.connection.on('error', (err: any) => {
    isConnected = false;
    console.error('[MongoDB] Connection error event:', err?.message || err);
  });
}

export async function dbConnect(): Promise<any> {
  attachListeners();

  // If already connected, return immediately
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return mongoose.connection;
  }

  // If currently connecting, await existing promise to avoid connection churn
  if (connectingPromise && mongoose.connection.readyState === 2) {
    return connectingPromise;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  connectingPromise = (async () => {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
        maxPoolSize: 10,
        heartbeatFrequencyMS: 10000,
      });
      isConnected = true;
      connectingPromise = null;
      console.log('[MongoDB] Connected to database successfully.');
      return conn.connection;
    } catch (error: any) {
      isConnected = false;
      connectingPromise = null;
      console.error('[MongoDB] Connection error:', error?.message || error);
      throw error;
    }
  })();

  return connectingPromise;
}

export default dbConnect;
