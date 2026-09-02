import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';
import { getLocalizedBrand } from '@/lib/translations/translation-service';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const allTranslations = searchParams.get('all') === 'true' || searchParams.get('allTranslations') === 'true';
    const locale = searchParams.get('locale') || request.headers.get('x-locale') || 'es';

    const isSummary = searchParams.get('summary') === 'true';

    const brands = await prisma.brand.findMany({
      orderBy: { createdAt: 'desc' }
    });

    if (isSummary) {
      const summaryBrands = brands.map((b) => {
        const transSummary = {};
        if (b.translations && typeof b.translations === 'object') {
          for (const [loc, t] of Object.entries(b.translations)) {
            if (t) {
              transSummary[loc] = {
                name: t.name || '',
                hasContent: Boolean(t.name || t.description),
              };
            }
          }
        }
        return {
          id: b.id,
          name: b.name,
          slug: b.slug,
          description: b.description,
          logo: b.logo,
          createdAt: b.createdAt,
          translations: transSummary,
        };
      });

      return NextResponse.json(summaryBrands, {
        headers: { 'Cache-Control': 'private, no-cache' }
      });
    }

    if (allTranslations) {
      return NextResponse.json(brands);
    }

    const localizedBrands = brands.map((b) => getLocalizedBrand(b, locale));
    return NextResponse.json(localizedBrands);
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
