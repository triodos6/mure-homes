import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, email: true, firstName: true, lastName: true, phone: true, image: true, role: true, preferredLocale: true, preferredCurrency: true },
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching current user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const session = await getSession();
    if (!session || !session.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const allowed = ['firstName', 'lastName', 'phone', 'image'];
    const data = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)));

    const user = await prisma.user.update({ where: { id: session.userId }, data });
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
