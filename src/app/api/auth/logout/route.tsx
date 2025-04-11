import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // For cookie management

export async function GET() {
  // Access the cookie store
  const cookieStore = await cookies();

  // Clear the 'token' cookie
  cookieStore.delete('token');

  // Return a JSON response
  return NextResponse.json({ message: 'Logged out' }, { status: 200 });
}