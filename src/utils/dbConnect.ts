// lib/mongodb.ts
import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI = process.env.AI_DB_URI || '';

if (!MONGODB_URI) {
  throw new Error('Please define the AI_DB_URI environment variable in .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface CachedMongoose {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: CachedMongoose;
}

let cached: CachedMongoose = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable command buffering
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log(`MongoDB Connected: ${mongooseInstance.connection.host}`);
      return mongooseInstance;
    }).catch((error) => {
      console.error('MongoDB connection error:', error);
      throw error; // Re-throw to be handled by the caller
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null; // Reset promise on failure to allow retry
    throw error;
  }
}

export default dbConnect;