import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';
import { getLocalizedProduct, getLocalizedProductCard, invalidateAllProductCaches } from '@/lib/translations/translation-service';

// In-memory process caches (TTL 60 seconds) to guarantee 10-50ms latencies on repeat queries
let statsCache = { data: null, timestamp: 0 };
const adminSummaryCache = new Map();
const publicCatalogCache = new Map();
const STATS_CACHE_TTL = 60 * 1000;
const API_CACHE_TTL = 60 * 1000;

export function invalidateStatsCache() {
  statsCache = { data: null, timestamp: 0 };
  adminSummaryCache.clear();
  publicCatalogCache.clear();
  invalidateAllProductCaches();
}

async function getCachedCatalogStats(force = false) {
  const now = Date.now();
  if (!force && statsCache.data && (now - statsCache.timestamp < STATS_CACHE_TTL)) {
    return statsCache.data;
  }

  try {
    const facetResults = await prisma.product.aggregateRaw({
      pipeline: [
        {
          $facet: {
            stats: [
              {
                $group: {
                  _id: null,
                  total: { $sum: 1 },
                  avgPrice: { $avg: '$price' }
                }
              }
            ],
            categories: [
              {
                $group: {
                  _id: '$category',
                  count: { $sum: 1 }
                }
              }
            ],
            brands: [
              {
                $group: {
                  _id: '$brand'
                }
              }
            ]
          }
        }
      ]
    });

    const facet = Array.isArray(facetResults) ? facetResults[0] : facetResults;
    const categoryCounts = {};
    if (Array.isArray(facet?.categories)) {
      facet.categories.forEach((c) => {
        if (c._id) categoryCounts[c._id] = c.count;
      });
    }

    const stats = {
      total: facet?.stats?.[0]?.total || 0,
      avgPrice: Math.round(facet?.stats?.[0]?.avgPrice || 0),
      brandsCount: Array.isArray(facet?.brands) ? facet.brands.length : 1,
      categoryCounts,
    };

    statsCache = { data: stats, timestamp: now };
    return stats;
  } catch (err) {
    console.error('Failed to compute catalog stats:', err);
    return null;
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const locale = searchParams.get('locale') || request.headers.get('x-locale') || 'es';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(1000, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)));
    const skip = (page - 1) * limit;

    const allTranslations = searchParams.get('allTranslations') === 'true';
    const isSummary = searchParams.get('summary') === 'true';
    const forceStats = searchParams.get('forceStats') === 'true';
    const includeStats = searchParams.get('includeStats') === 'true' || forceStats;
    const sortBy = searchParams.get('sortBy') || 'newest';
    const now = Date.now();

    // ─────────────────────────────────────────────────────────────
    // FAST-PATH: Admin Summary Queries with In-Memory Cache
    // ─────────────────────────────────────────────────────────────
    if (isSummary) {
      const adminCacheKey = `${category}:${search}:${sortBy}:${page}:${limit}:${includeStats}`;
      const cachedAdmin = adminSummaryCache.get(adminCacheKey);
      if (!forceStats && cachedAdmin && (now - cachedAdmin.timestamp < API_CACHE_TTL)) {
        return NextResponse.json(cachedAdmin.data, {
          headers: { 'Cache-Control': 'private, no-cache', 'X-Cache': 'HIT' }
        });
      }

      const match = {};
      if (category && category !== 'all') {
        match.category = category;
      }
      if (search && search.trim()) {
        const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        match.$or = [
          { name: { $regex: escaped, $options: 'i' } },
          { brand: { $regex: escaped, $options: 'i' } },
          { category: { $regex: escaped, $options: 'i' } },
          { slug: { $regex: escaped, $options: 'i' } },
        ];
      }

      let sort = { createdAt: -1 };
      if (sortBy === 'price-asc') sort = { price: 1, createdAt: -1 };
      else if (sortBy === 'price-desc') sort = { price: -1, createdAt: -1 };
      else if (sortBy === 'name-asc') sort = { name: 1, createdAt: -1 };

      const pipeline = [];
      if (Object.keys(match).length > 0) {
        pipeline.push({ $match: match });
      }

      pipeline.push({
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [
            { $sort: sort },
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                _id: 1,
                name: 1,
                slug: 1,
                brand: 1,
                category: 1,
                price: 1,
                status: 1,
                featured: 1,
                thumbnail: 1,
                images: { $slice: ['$images', 1] },
                createdAt: 1,
                translatedLocales: {
                  $filter: {
                    input: {
                      $map: {
                        input: { $objectToArray: { $ifNull: ['$translations', {}] } },
                        as: 'trans',
                        in: {
                          $cond: [
                            {
                              $or: [
                                { $eq: ['$$trans.v.status', 'published'] },
                                { $gt: [{ $strLenCP: { $ifNull: ['$$trans.v.name', ''] } }, 0] }
                              ]
                            },
                            '$$trans.k',
                            null
                          ]
                        }
                      }
                    },
                    as: 'loc',
                    cond: { $ne: ['$$loc', null] }
                  }
                }
              }
            }
          ]
        }
      });

      const promises = [prisma.product.aggregateRaw({ pipeline })];
      if (includeStats) {
        promises.push(getCachedCatalogStats(forceStats));
      }

      const [facetResults, stats] = await Promise.all(promises);
      const facetResult = Array.isArray(facetResults) ? facetResults[0] : facetResults;
      const total = facetResult?.metadata?.[0]?.total || 0;
      const rawProducts = facetResult?.data || [];

      const summaryProducts = rawProducts.map((p) => {
        const id = p._id?.$oid || String(p._id);
        const translationsSummary = {};
        if (Array.isArray(p.translatedLocales)) {
          p.translatedLocales.forEach((loc) => {
            translationsSummary[loc] = {
              status: 'published',
              name: p.name || '',
            };
          });
        }

        return {
          id,
          name: p.name || '',
          slug: p.slug || '',
          brand: p.brand || '',
          category: p.category || '',
          price: p.price ?? 0,
          status: p.status || 'draft',
          featured: Boolean(p.featured),
          thumbnail: p.thumbnail || p.images?.[0] || null,
          images: p.images || [],
          createdAt: p.createdAt?.$date || p.createdAt || null,
          translations: translationsSummary,
          translatedLocales: p.translatedLocales || [],
        };
      });

      const payload = {
        products: summaryProducts,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        ...(stats ? { stats } : {})
      };

      adminSummaryCache.set(adminCacheKey, { data: payload, timestamp: now });

      return NextResponse.json(payload, {
        headers: { 'Cache-Control': 'private, no-cache', 'X-Cache': 'MISS' }
      });
    }

    // ─────────────────────────────────────────────────────────────
    // STANDARD CLIENT PATH (Storefront customer catalog)
    // ─────────────────────────────────────────────────────────────
    const publicCacheKey = `${category}:${search}:${sortBy}:${page}:${limit}:${locale}:${allTranslations}`;
    const cachedPublic = publicCatalogCache.get(publicCacheKey);
    if (cachedPublic && (now - cachedPublic.timestamp < API_CACHE_TTL)) {
      return NextResponse.json(cachedPublic.data, {
        headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300', 'X-Cache': 'HIT' }
      });
    }

    let orderBy = { createdAt: 'desc' };
    if (sortBy === 'price-asc') orderBy = { price: 'asc' };
    else if (sortBy === 'price-desc') orderBy = { price: 'desc' };
    else if (sortBy === 'name-asc') orderBy = { name: 'asc' };

    const where = { status: 'active' };
    if (category && category !== 'all') {
      where.category = category;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    const selectFields = {
      id: true,
      name: true,
      slug: true,
      brand: true,
      category: true,
      price: true,
      marketPrices: true,
      status: true,
      featured: true,
      images: true,
      thumbnail: true,
      ...(allTranslations || locale !== 'es' ? { translations: true } : {}),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: selectFields,
      }),
      prisma.product.count({ where }),
    ]);

    const localizedProducts = products.map((p) =>
      allTranslations ? getLocalizedProduct(p, locale, { includeAllTranslations: true }) : getLocalizedProductCard(p, locale)
    );

    const publicPayload = {
      products: localizedProducts,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };

    publicCatalogCache.set(publicCacheKey, { data: publicPayload, timestamp: now });

    return NextResponse.json(publicPayload, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300', 'X-Cache': 'MISS' }
    });
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

    invalidateStatsCache();

    return NextResponse.json(product);
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
