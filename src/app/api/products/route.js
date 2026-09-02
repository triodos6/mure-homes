import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';
import { getLocalizedProduct } from '@/lib/translations/translation-service';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const locale = searchParams.get('locale') || request.headers.get('x-locale') || 'es';
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

    const allTranslations = searchParams.get('allTranslations') === 'true';
    const isSummary = searchParams.get('summary') === 'true';

    const selectFields = isSummary ? {
      id: true,
      name: true,
      slug: true,
      brand: true,
      category: true,
      price: true,
      status: true,
      featured: true,
      images: true,
      thumbnail: true,
      translations: true,
      createdAt: true,
    } : undefined;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        ...(selectFields ? { select: selectFields } : {}),
      }),
      prisma.product.count({ where }),
    ]);

    if (isSummary) {
      const summaryProducts = products.map((p) => {
        const translationsSummary = {};
        if (p.translations && typeof p.translations === 'object') {
          for (const [loc, t] of Object.entries(p.translations)) {
            if (t) {
              translationsSummary[loc] = {
                name: t.name || '',
                status: t.status || (t.name ? 'published' : 'missing'),
              };
            }
          }
        }
        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          brand: p.brand,
          category: p.category,
          price: p.price,
          status: p.status,
          featured: p.featured,
          images: p.images?.slice(0, 1) || [],
          thumbnail: p.thumbnail || p.images?.[0] || null,
          createdAt: p.createdAt,
          translations: translationsSummary,
        };
      });

      return NextResponse.json(
        { products: summaryProducts, total, page, totalPages: Math.ceil(total / limit) },
        { headers: { 'Cache-Control': 'private, no-cache' } }
      );
    }

    const localizedProducts = products.map((p) => getLocalizedProduct(p, locale, { includeAllTranslations: allTranslations }));

    return NextResponse.json(
      { products: localizedProducts, total, page, totalPages: Math.ceil(total / limit) },
      { headers: { 'Cache-Control': 'private, no-cache' } }
    );
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
