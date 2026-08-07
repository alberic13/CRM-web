import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { loginSchema } from '@/lib/validations/auth';
import bcrypt from 'bcrypt';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Validate Input using Zod Schema (Safeguard against malformed/SQL injection payloads)
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid input', errors: validation.error.format() },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Demo Account Fallback (Guarantees Vercel demo deployment works out-of-the-box!)
    if (email.toLowerCase() === 'admin@flowtech.com' && password === 'password123') {
      const demoUser = {
        id: 'usr_admin_demo',
        email: 'admin@flowtech.com',
        name: 'Administrator',
        role: 'Admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      };

      const response = NextResponse.json({
        message: 'Login successful',
        user: demoUser,
      });

      response.cookies.set('crm_session', JSON.stringify(demoUser), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    // 2. Query User in MySQL via Prisma ORM (Safe DB lookup)
    let user = null;
    try {
      user = await prisma.user.findUnique({
        where: { email },
      });
    } catch (dbError) {
      console.warn('Database query error on Vercel:', dbError);
    }

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // 3. Verify Password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password).catch(() => false);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // 4. Create Session Data & Response
    const userSession = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
    };

    const response = NextResponse.json({
      message: 'Login successful',
      user: userSession,
    });

    // 5. Set Secure HTTP-Only Cookie
    response.cookies.set('crm_session', JSON.stringify(userSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'An error occurred on the server' },
      { status: 500 }
    );
  }
}
