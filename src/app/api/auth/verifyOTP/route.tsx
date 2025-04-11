import { NextResponse } from 'next/server';
import * as jwt from 'jsonwebtoken';
import UserDatabase from '../../schemas/aiDB/userDB'; // Adjust path
import sendDiscordMessage from '@/utils/sendDiscordMessage'; // Adjust path
import dbConnect from '@/utils/dbConnect'; // Adjust path

// Define the User schema type
interface User {
  email: string;
  username: string;
  auth: {
    currentCode: number | null;
    codeExpiry: Date | null;
  };
}

// Validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Define the token payload type
interface TokenPayload {
  email: string;
  username: string;
}

export async function POST(request: Request) {
  await dbConnect(); // Ensure database connection

  try {
    // Parse the request body
    const { email, otp } = await request.json() as { email?: string; otp?: string };

    // Validate input
    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Find user by email
    const user = await UserDatabase.findOne({ email }) as User | null;
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify OTP
    const currentCode = user.auth.currentCode; // number | null
    const codeExpiry = user.auth.codeExpiry;   // Date | null

    if (!currentCode || currentCode !== Number(otp)) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 401 });
    }
    if (!codeExpiry || Date.now() > codeExpiry.getTime()) {
      return NextResponse.json({ error: 'OTP has expired' }, { status: 401 });
    }

    // OTP is valid, clear it
    await UserDatabase.updateOne(
      { email },
      {
        $set: {
          'auth.currentCode': null,
          'auth.codeExpiry': null,
        },
      }
    );

    // Generate JWT
    const JWT_KEY: string = process.env.JWT_SECRET as string;
    const EXPIRY: string = process.env.TOKEN_EXPIRATION || '7d'; // Default to 7 days
    if (!JWT_KEY) {
      throw new Error('JWT_SECRET is not defined');
    }

    const token: string = jwt.sign(
      { email: user.email, username: user.username } as TokenPayload,
      JWT_KEY,
      { expiresIn: EXPIRY } as jwt.SignOptions
    );

    // Create response and set the token cookie
    const response = NextResponse.json({
      message: 'Login successful',
      email: user.email,
      username: user.username,
    }, { status: 200 });

    // Set JWT as HttpOnly cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Secure in production
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    });

    await sendDiscordMessage(`User logged in ${email}`);

    return response;

  } catch (error) {
    console.error('Verify OTP error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}