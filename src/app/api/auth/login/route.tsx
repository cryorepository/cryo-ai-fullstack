import { NextResponse } from 'next/server';
import UserDatabase from '../../schemas/aiDB/userDB'; // Adjust path
import sendEmail from '@/utils/sendEmail'; // Adjust path
import sendDiscordMessage from '@/utils/sendDiscordMessage'; // Adjust path
import dbConnect from '@/utils/dbConnect'; // Adjust path

// Validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate a six-digit OTP code
function generateSixDigitCode(): number {
  return Math.floor(100000 + Math.random() * 900000);
}

export async function POST(request: Request) {
  await dbConnect();

  try {
    // Parse the request body
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is missing' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const newOTPCode = generateSixDigitCode();
    const fifteenMinutesFromNow = new Date(Date.now() + 15 * 60 * 1000);

    let user = await UserDatabase.findOne({ email });

    if (!user) {
      let newUsername: string;
      do {
        newUsername = `User${generateSixDigitCode()}`;
      } while (await UserDatabase.findOne({ username: newUsername }));

      user = new UserDatabase({
        email,
        username: newUsername,
        auth: {
          currentCode: newOTPCode,
          codeExpiry: fifteenMinutesFromNow,
        },
        chats: [],
      });

      await sendEmail(email, newOTPCode);
      await user.save();

      return NextResponse.json({
        message: 'Success',
        email: user.email,
        username: user.username,
      }, { status: 200 });
    }

    const updatedUser = await UserDatabase.findOneAndUpdate(
      { email },
      {
        $set: {
          'auth.currentCode': newOTPCode,
          'auth.codeExpiry': fifteenMinutesFromNow,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }

    await sendEmail(email, newOTPCode);
    await sendDiscordMessage(`User sent OTP Code ${email}`);

    return NextResponse.json({
      message: 'Success',
      email: updatedUser.email,
      username: updatedUser.username,
    }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}