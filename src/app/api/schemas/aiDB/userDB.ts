// schemas/aiDB/userDB.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

// Define interfaces for TypeScript
interface IChat extends Document {
  chatID: mongoose.Types.ObjectId;
  chatTitle: string | null;
  chatModel: string | null; // Renamed from 'model' to 'chatModel'
  chatCreationDate: Date;
  chatHistory: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }[];
}

interface IUser extends Document {
  email: string;
  username: string;
  auth: {
    currentCode: number | null;
    codeExpiry: Date | null;
  };
  chats: IChat[];
  createdAt: Date;
  updatedAt: Date;
}

// Chat Schema
const chatSchema: Schema = new mongoose.Schema({
  chatID: { 
    type: mongoose.Schema.Types.ObjectId, 
    default: () => new mongoose.Types.ObjectId(), 
    index: true 
  },
  chatTitle: { type: String, default: null },
  chatModel: { type: String, default: null }, // Renamed from 'model' to 'chatModel'
  chatCreationDate: { type: Date, default: Date.now },
  chatHistory: [
    {
      role: { 
        type: String, 
        enum: ['user', 'assistant'], 
        required: true 
      },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

// User Schema
const userSchema: Schema = new mongoose.Schema(
  {
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      index: true 
    },
    username: { 
      type: String, 
      required: true, 
      unique: true, 
      index: true 
    },
    auth: {
      currentCode: { type: Number, default: null },
      codeExpiry: { type: Date, default: null },
    },
    chats: [chatSchema],
  },
  { timestamps: true }
);

// Prevent model recompilation in development
const UserDatabase: Model<IUser> = mongoose.models.UserDB || mongoose.model<IUser>('UserDB', userSchema);

export default UserDatabase;