import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(brands);
  } catch (error) {
    console.error('Failed to fetch brands:', error);
    return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const body = await req.json();
    const brand = await prisma.brand.create({
      data: {
        slug: body.slug,
        name: body.name,
        description: body.description,
        logo: body.logo || null,
        translations: body.translations || null,
      }
    });

    return NextResponse.json(brand);
  } catch (error) {
    console.error('Failed to create brand:', error);
    return NextResponse.json({ error: 'Failed to create brand' }, { status: 500 });
  }
}
