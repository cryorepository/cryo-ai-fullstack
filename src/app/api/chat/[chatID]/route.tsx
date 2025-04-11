import { NextResponse } from 'next/server';
import * as jwt from 'jsonwebtoken';
import UserDatabase from '../../schemas/aiDB/userDB'; // Adjust path
import dbConnect from '@/utils/dbConnect'; // Adjust path
import { cookies } from 'next/headers'; // For accessing cookies

// Define the JWT payload type
interface TokenPayload {
  email: string;
  username?: string;
}

// Define the Chat type
interface Chat {
  chatID: string;
  chatTitle: string;
  chatCreationDate: Date;
  //chatHistory: any[];
  chatHistory: { role: string; content: string; timestamp: Date }[]; // Specific type instead of any[]
}

// Define the User schema type
interface User {
  email: string;
  chats: Chat[];
}

export async function GET(request: Request, { params }: { params: Promise<{ chatID: string }> }) {
  await dbConnect(); // Ensure DB connection

  const { chatID } = await params;

  try {
    // Get the JWT from the cookie
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
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

    // Get chatID from route parameters
    //const { chatID } = params;
    if (!chatID) {
      return NextResponse.json({ error: 'chatID is required' }, { status: 400 });
    }

    // Find user by email and ensure chat exists
    const user = await UserDatabase.findOne({ email, 'chats.chatID': chatID }) as User | null;
    if (!user) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    // Find the specific chat in the user's chats array
    const chat = user.chats.find((c: Chat) => c.chatID.toString() === chatID);
    if (!chat) {
      console.log("NCF");
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    // Return chat data
    return NextResponse.json({
      chatID: chat.chatID,
      chatTitle: chat.chatTitle,
      chatCreationDate: chat.chatCreationDate,
      chatHistory: chat.chatHistory,
    }, { status: 200 });

  } catch (error: unknown) {
    console.error('Get chat error:', error instanceof Error ? error.message : String(error));
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}