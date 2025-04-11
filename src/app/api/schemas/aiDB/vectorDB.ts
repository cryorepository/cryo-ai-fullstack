// schemas/aiDB/vectorDB.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

// Define interface for TypeScript
interface IVectorDB extends Document {
  generalEmbedding: number[];
  textEmbedding: number[];
  metadata: {
    name: string;
    hash: string;
    tags: string[];
  };
}

// VectorDB Schema
const vectorDBSchema: Schema = new mongoose.Schema({
  generalEmbedding: [{ type: Number }],
  textEmbedding: [{ type: Number }],
  metadata: {
    name: String,
    hash: { 
      type: String, 
      required: true, 
      unique: true, 
      index: true 
    },
    tags: [{ type: String }]
  }
});

// Prevent model recompilation in development
const VectorDB: Model<IVectorDB> = mongoose.models.VectorDB || mongoose.model<IVectorDB>('VectorDB', vectorDBSchema);

export default VectorDB;