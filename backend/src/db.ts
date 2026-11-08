import mongoose from 'mongoose';
import dns from 'dns';

// Ensure standard Google/Cloudflare DNS for Docker/Alpine environments with broken internal SRV resolution
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore if restricted in sandbox
}

let isConnected = false;
let connectingPromise: Promise<any> | null = null;
let listenersAttached = false;
let lastDbError: string | null = null;

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

export function getLastDbError(): string | null {
  return lastDbError;
}

function attachListeners() {
  if (listenersAttached) return;
  listenersAttached = true;

  mongoose.connection.on('connected', () => {
    isConnected = true;
    lastDbError = null;
    console.log('[MongoDB] State changed: Connected.');
  });

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    console.warn('[MongoDB] State changed: Disconnected. Scheduling auto-reconnect in 2s...');
    setTimeout(() => {
      dbConnect().catch((err: any) => {
        lastDbError = err?.message || String(err);
        console.warn('[MongoDB] Auto-reconnect failed (will retry):', lastDbError);
      });
    }, 2000);
  });

  mongoose.connection.on('error', (err: any) => {
    isConnected = false;
    lastDbError = err?.message || String(err);
    console.error('[MongoDB] Connection error event:', lastDbError);
  });
}

export async function dbConnect(): Promise<any> {
  attachListeners();

  // If already connected, return immediately
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    lastDbError = null;
    return mongoose.connection;
  }

  // If currently connecting, await existing promise to avoid connection churn
  if (connectingPromise && mongoose.connection.readyState === 2) {
    return connectingPromise;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    lastDbError = 'MONGODB_URI environment variable is missing.';
    throw new Error(lastDbError);
  }

  connectingPromise = (async () => {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 15000,
        connectTimeoutMS: 20000,
        maxPoolSize: 10,
        heartbeatFrequencyMS: 10000,
      });
      isConnected = true;
      connectingPromise = null;
      lastDbError = null;
      console.log('[MongoDB] Connected to database successfully.');
      return conn.connection;
    } catch (error: any) {
      isConnected = false;
      connectingPromise = null;
      lastDbError = error?.message || String(error);
      console.error('[MongoDB] Connection error:', lastDbError);
      throw error;
    }
  })();

  return connectingPromise;
}

export default dbConnect;
