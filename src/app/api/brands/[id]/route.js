import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

import { getLocalizedBrand } from '@/lib/translations/translation-service';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Invalid brand ID' }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const locale = searchParams.get('locale');

    const brand = await prisma.brand.findUnique({ where: { id } });
    if (!brand) return NextResponse.json({ error: 'Brand not found' }, { status: 404 });

    if (locale) {
      return NextResponse.json(getLocalizedBrand(brand, locale), {
        headers: { 'Cache-Control': 'private, no-cache' }
      });
    }

    return NextResponse.json(brand, {
      headers: { 'Cache-Control': 'private, no-cache' }
    });
  } catch (error) {
    console.error('Failed to fetch brand:', error);
    return NextResponse.json({ error: 'Failed to fetch brand' }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { id } = await params;
    const body = await req.json();
    const brand = await prisma.brand.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        logo: body.logo,
        translations: body.translations,
      }
    });

    return NextResponse.json(brand);
  } catch (error) {
    console.error('Failed to update brand:', error);
    return NextResponse.json({ error: 'Failed to update brand' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { id } = await params;
    await prisma.brand.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete brand:', error);
    return NextResponse.json({ error: 'Failed to delete brand' }, { status: 500 });
  }
}
