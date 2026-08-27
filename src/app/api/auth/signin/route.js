import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { signToken, setAuthCookie } from '@/lib/auth';

export async function POST(req) {
  try {
    const { email, password, locale: clientLocale } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { 
        id: true, 
        email: true, 
        password: true, 
        firstName: true, 
        lastName: true, 
        phone: true, 
        role: true,
        preferredLocale: true,
        preferredCurrency: true,
      },
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const targetLocale = user.preferredLocale || clientLocale || 'es';

    const res = NextResponse.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      phone: user.phone ?? null,
      role: user.role,
      preferredLocale: user.preferredLocale ?? 'es',
      preferredCurrency: user.preferredCurrency ?? 'EUR',
    });

    res.cookies.set('murahomes_locale', targetLocale, {
      path: '/',
      maxAge: 31536000,
      sameSite: 'lax',
    });

    return setAuthCookie(res, token);
  } catch (error) {
    console.error('Signin error:', error);
    return NextResponse.json({ error: 'Failed to sign in' }, { status: 500 });
  }
}
