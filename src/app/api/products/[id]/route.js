import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';
import { revalidateTag } from 'next/cache';

import { getLocalizedProduct } from '@/lib/translations/translation-service';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const locale = searchParams.get('locale');

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    if (locale) {
      return NextResponse.json(getLocalizedProduct(product, locale), {
        headers: { 'Cache-Control': 'private, no-cache' }
      });
    }

    return NextResponse.json(product, {
      headers: { 'Cache-Control': 'private, no-cache' }
    });
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { id } = await params;
    const body = await req.json();

    // Remove properties that are not in Prisma schema
    const { features, ...validData } = body;

    const updatePayload = {};
    if (validData.name !== undefined) updatePayload.name = validData.name;
    if (validData.slug !== undefined) updatePayload.slug = validData.slug;
    if (validData.category !== undefined) updatePayload.category = validData.category;
    if (validData.brand !== undefined) updatePayload.brand = validData.brand;
    if (validData.description !== undefined) updatePayload.description = validData.description;
    if (validData.dimensions !== undefined) updatePayload.dimensions = validData.dimensions;
    if (validData.thumbnail !== undefined) updatePayload.thumbnail = validData.thumbnail;
    if (validData.featured !== undefined) updatePayload.featured = Boolean(validData.featured);
    if (validData.status !== undefined) updatePayload.status = validData.status;
    if (validData.price !== undefined) updatePayload.price = parseFloat(validData.price);
    
    if (validData.images !== undefined) {
      updatePayload.images = Array.isArray(validData.images)
        ? validData.images.flatMap(img => typeof img === 'string' ? img.split(',').map(s => s.trim()).filter(Boolean) : [])
        : [];
    }

    if (validData.materials !== undefined) {
      updatePayload.materials = Array.isArray(validData.materials)
        ? validData.materials
        : typeof validData.materials === 'string'
          ? validData.materials.split(',').map(m => m.trim()).filter(Boolean)
          : [];
    }

    if (validData.translations !== undefined) {
      updatePayload.translations = validData.translations;
    }

    if (validData.marketPrices !== undefined) {
      updatePayload.marketPrices = validData.marketPrices;
    }

    const product = await prisma.product.update({
      where: { id },
      data: updatePayload,
    });

    // Revalidate product cache tags
    try {
      revalidateTag(`product:${id}`);
    } catch { }

    return NextResponse.json(product);
  } catch (error) {
    console.error('CRITICAL PATH ERROR: Failed to update product:', error.message || error);
    return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 });
  }
}

export async function PUT(req, ctx) {
  return PATCH(req, ctx);
}

export async function DELETE(req, { params }) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { id } = await params;
    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete product' }, { status: 500 });
  }
}
