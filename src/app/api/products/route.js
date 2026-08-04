import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(1000, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)));
    const skip = (page - 1) * limit;

    const where = {};
    if (category) {
      where.category = category;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({ products, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const body = await req.json();
    if (!body.slug || !body.name || !body.category || !body.price) {
      return NextResponse.json({ error: 'Missing required fields: slug, name, category, price' }, { status: 400 });
    }
    const product = await prisma.product.create({
      data: {
        slug: body.slug,
        name: body.name,
        category: body.category,
        price: parseFloat(body.price),
        brand: body.brand || '',
        description: body.description || '',
        dimensions: body.dimensions || null,
        thumbnail: body.thumbnail || null,
        featured: body.featured ?? false,
        status: body.status || 'active',
        materials: Array.isArray(body.materials)
          ? body.materials
          : typeof body.materials === 'string'
            ? body.materials.split(',').map(m => m.trim()).filter(Boolean)
            : [],
        images: Array.isArray(body.images) ? body.images.flatMap(img => typeof img === 'string' ? img.split(',').map(s => s.trim()).filter(Boolean) : []) : [],
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
