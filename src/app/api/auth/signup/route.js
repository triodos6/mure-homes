import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { signToken, setAuthCookie } from '@/lib/auth';

export async function POST(req) {
  try {
    const { firstName, lastName, email, password, phone, locale, currency } = await req.json();

    if (!firstName || !lastName || !email || !password || !phone) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() }, select: { id: true } });
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashed,
        firstName,
        lastName,
        phone,
        role: 'USER',
        preferredLocale: locale || 'es',
        preferredCurrency: currency || 'EUR',
      },
    });

    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const res = NextResponse.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      preferredLocale: user.preferredLocale ?? 'es',
      preferredCurrency: user.preferredCurrency ?? 'EUR',
    }, { status: 201 });

    res.cookies.set('murahomes_locale', user.preferredLocale || 'es', {
      path: '/',
      maxAge: 31536000,
      sameSite: 'lax',
    });

    return setAuthCookie(res, token);
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}
