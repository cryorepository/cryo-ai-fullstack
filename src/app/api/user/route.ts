import { NextResponse } from 'next/server';
import * as jwt from 'jsonwebtoken';
import UserDatabase from '../schemas/aiDB/userDB'; // Adjust path
import dbConnect from '@/utils/dbConnect'; // Adjust path
import { cookies } from 'next/headers'; // Import cookies

// Define the JWT payload type
interface TokenPayload {
  email: string;
  username: string;
}

// Define the Chat type
interface Chat {
  chatID: string;
  chatTitle: string;
  chatCreationDate?: Date;
  //chatHistory?: any[];
  chatHistory: { role: string; content: string; timestamp: Date }[]; // Specific type instead of any[]
}

// Define the User schema type
interface User {
  email: string;
  username: string;
  chats: Chat[];
}

export async function GET() {
  await dbConnect(); // Ensure DB connection

  try {
    // Get cookies synchronously (no await needed)
    const cookieStore = await cookies(); // This returns ReadonlyRequestCookies
    const token = cookieStore.get('token')?.value; // Get the token value

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Verify the JWT
    const JWT_KEY = process.env.JWT_SECRET as string;
    if (!JWT_KEY) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, JWT_KEY) as TokenPayload;
    const { email } = decoded;

    // Verify user exists in DB
    const user = await UserDatabase.findOne({ email }) as User | null;
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Map chats to simplified response format
    const chats = user.chats.map((chat: Chat) => ({
      chatID: chat.chatID,
      chatTitle: chat.chatTitle,
    }));

    // Return user data
    return NextResponse.json({
      email: user.email,
      username: user.username,
      chats,
    }, { status: 200 });

  } catch (error: unknown) {
    console.error('Get chat error:', error instanceof Error ? error.message : String(error));
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}