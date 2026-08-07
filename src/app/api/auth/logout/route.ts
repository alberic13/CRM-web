import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  const response = NextResponse.json({ message: 'Logout successful' });
  response.cookies.set('crm_session', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
  return response;
}
