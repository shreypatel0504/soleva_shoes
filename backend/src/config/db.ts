import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

// Ensure SRV records for MongoDB Atlas resolve reliably on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch {}

let memServer: any = null;

export const connectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  const uri = process.env.MONGODB_URI;

  if (uri && uri !== 'your_mongodb_atlas_connection_string') {
    try {
      console.log(`[Database] Attempting connection to MongoDB URI...`);
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
      });
      console.log(`[Database] Connected to MongoDB Atlas / Remote database successfully!`);
      return;
    } catch (err: any) {
      console.warn(`[Database] Remote MongoDB connection failed (${err.message}).`);
    }
  }

  // Fallback to mongodb-memory-server in development mode to ensure zero startup crash
  console.log(`[Database] Starting in-memory MongoDB engine for zero-config local development & testing...`);
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memServer = await MongoMemoryServer.create();
    const memUri = memServer.getUri();
    await mongoose.connect(memUri);
    console.log(`[Database] Connected to In-Memory MongoDB (${memUri}). Fully functional local environment active!`);
  } catch (memErr: any) {
    console.error(`[Database] Could not start database:`, memErr);
    throw memErr;
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (memServer) {
    await memServer.stop();
  }
};
