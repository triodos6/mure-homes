import prisma from '@/lib/prisma';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/i18n/config';

/**
 * Resolves a localized product view from a DB product entity.
 * If translation for requested locale is missing, seamlessly falls back to default Spanish fields.
 * Never returns null for an existing product.
 * Only retains the user-selected locale translation to avoid transferring unnecessary database translations over the network.
 * @param {object} product - Raw product document from Prisma
 * @param {string} locale - Target locale (es, fr, de, it, lt, en, etc.)
 * @param {object} [options] - Options: { includeAllTranslations: boolean }
 * @returns {object|null} Localized product object with fallback
 */
export function getLocalizedProduct(product, locale = DEFAULT_LOCALE, options = {}) {
  if (!product) return null;

  const { translations: rawTranslations, ...productFields } = product;
  const esTrans = rawTranslations?.es || {};
  const baseName = esTrans.name || product.name || '';
  const baseSlug = esTrans.slug || product.slug || '';
  const baseDesc = esTrans.description || product.description || '';
  const baseSeoTitle = esTrans.seoTitle || `${baseName} | MuraHomes`;
  const baseSeoDesc = esTrans.seoDescription || (baseDesc ? baseDesc.replace(/<[^>]*>?/gm, '').slice(0, 160) : '');

  // Only retain the translation for the user-selected language to avoid transferring 22 unused locales
  const userSelectedTranslation = locale !== 'es' && rawTranslations?.[locale]
    ? { [locale]: rawTranslations[locale] }
    : undefined;

  const finalTranslations = options.includeAllTranslations ? rawTranslations : userSelectedTranslation;

  // Spanish is primary baseline
  if (locale === 'es') {
    return {
      ...productFields,
      name: baseName,
      slug: baseSlug,
      description: baseDesc,
      seoTitle: baseSeoTitle,
      seoDescription: baseSeoDesc,
      ...(finalTranslations ? { translations: finalTranslations } : {}),
      isTranslated: true,
      isFallback: false,
      translationStatus: 'published',
    };
  }

  const translation = rawTranslations?.[locale];

  // If active translation exists with at least a name
  if (translation && (translation.status === 'published' || translation.name)) {
    return {
      ...productFields,
      name: translation.name || baseName,
      slug: translation.slug || baseSlug,
      description: translation.description || baseDesc,
      seoTitle: translation.seoTitle || `${translation.name || baseName} | MuraHomes`,
      seoDescription: translation.seoDescription || (translation.description ? translation.description.replace(/<[^>]*>?/gm, '').slice(0, 160) : baseSeoDesc),
      ...(finalTranslations ? { translations: finalTranslations } : {}),
      isTranslated: true,
      isFallback: false,
      translationStatus: translation.status || 'published',
    };
  }

  // Graceful fallback to default Spanish content
  return {
    ...productFields,
    name: baseName,
    slug: baseSlug,
    description: baseDesc,
    seoTitle: baseSeoTitle,
    seoDescription: baseSeoDesc,
    ...(finalTranslations ? { translations: finalTranslations } : {}),
    isTranslated: true,
    isFallback: true,
    translationStatus: 'fallback',
  };
}

/**
 * Lightweight transformer for product cards (catalog grid, category grid, related products).
 * Strips heavy unused fields (HTML descriptions, dimensions, materials, multi-locale blobs)
 * to keep RSC payloads and client memory minimal while preserving all card & cart requirements.
 * @param {object} product - Raw product document from Prisma
 * @param {string} locale - Target locale
 * @returns {object|null}
 */
export function getLocalizedProductCard(product, locale = DEFAULT_LOCALE) {
  if (!product) return null;
  const rawTranslations = product.translations;
  const trans = (locale !== 'es' && rawTranslations?.[locale]) || rawTranslations?.es || {};
  const baseName = trans.name || product.name || '';
  const baseSlug = trans.slug || product.slug || '';

  return {
    id: product.id,
    name: baseName,
    slug: baseSlug,
    category: product.category,
    price: product.price,
    marketPrices: product.marketPrices || null,
    brand: product.brand || '',
    images: Array.isArray(product.images) && product.images.length > 0 ? product.images.slice(0, 2) : [],
    thumbnail: product.thumbnail || product.images?.[0] || null,
    featured: Boolean(product.featured),
    status: product.status || 'active',
  };
}

// ── IN-MEMORY PROCESS CACHES (TTL 5 minutes) ──────────────────────────
const categoryCardsCache = new Map();
const catalogCardsCache = new Map();
const productSlugCache = new Map();
const inFlightProductSlugPromises = new Map();
const homepageFeaturedCache = new Map();
const homepageBrandsCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function invalidateAllProductCaches() {
  categoryCardsCache.clear();
  catalogCardsCache.clear();
  productSlugCache.clear();
  inFlightProductSlugPromises.clear();
  homepageFeaturedCache.clear();
  homepageBrandsCache.clear();
}

/**
 * Ultra-fast category products fetcher that retrieves lightweight card data and total count
 * in a single MongoDB aggregation round-trip with server-side projection and in-memory caching.
 * Avoids transferring full 22-locale descriptions, HTML, or dimension objects over Atlas WAN.
 * @param {string} category - Category slug
 * @param {string} locale - Target locale
 * @param {number} limit - Maximum number of products to return
 * @returns {Promise<{ products: Array, total: number, totalPages: number }>}
 */
export async function getCategoryProductCards(category, locale = DEFAULT_LOCALE, limit = 12) {
  const isEs = locale === 'es' || !locale;
  const cacheKey = `${category}:${locale}:${limit}`;
  const cached = categoryCardsCache.get(cacheKey);
  const now = Date.now();
  if (cached && (now - cached.timestamp < CACHE_TTL)) {
    return cached.data;
  }

  try {
    const pipeline = [
      { $match: { category, status: 'active' } },
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [
            { $sort: { createdAt: -1 } },
            { $limit: limit },
            {
              $project: {
                _id: 1,
                name: 1,
                slug: 1,
                category: 1,
                price: 1,
                marketPrices: 1,
                brand: 1,
                thumbnail: 1,
                featured: 1,
                status: 1,
                images: { $slice: ['$images', 2] },
                ...(!isEs ? {
                  localizedName: `$translations.${locale}.name`,
                  localizedSlug: `$translations.${locale}.slug`,
                } : {})
              }
            }
          ]
        }
      }
    ];

    const facetResults = await prisma.product.aggregateRaw({ pipeline });
    const facet = Array.isArray(facetResults) ? facetResults[0] : facetResults;
    const total = facet?.metadata?.[0]?.total || 0;
    const rawData = facet?.data || [];

    const products = rawData.map((p) => {
      const id = p._id?.$oid || String(p._id);
      return {
        id,
        name: p.localizedName || p.name || '',
        slug: p.localizedSlug || p.slug || '',
        category: p.category || '',
        price: p.price ?? 0,
        marketPrices: p.marketPrices || null,
        brand: p.brand || '',
        images: Array.isArray(p.images) ? p.images : [],
        thumbnail: p.thumbnail || p.images?.[0] || null,
        featured: Boolean(p.featured),
        status: p.status || 'active',
      };
    });

    const result = {
      products,
      total,
      totalPages: Math.ceil(total / limit),
    };

    categoryCardsCache.set(cacheKey, { data: result, timestamp: now });
    return result;
  } catch (err) {
    console.error(`Fallback to standard query for category ${category}:`, err);
    const [rawProducts, total] = await Promise.all([
      prisma.product.findMany({
        where: { category, status: 'active' },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          category: true,
          price: true,
          marketPrices: true,
          brand: true,
          images: true,
          thumbnail: true,
          featured: true,
          status: true,
          ...(isEs ? {} : { translations: true }),
        },
      }),
      prisma.product.count({ where: { category, status: 'active' } }),
    ]);

    const result = {
      products: rawProducts.map((p) => getLocalizedProductCard(p, locale)),
      total,
      totalPages: Math.ceil(total / limit),
    };

    categoryCardsCache.set(cacheKey, { data: result, timestamp: now });
    return result;
  }
}

/**
 * Ultra-fast catalog initial products fetcher for /products route with in-memory caching.
 * @param {string} locale - Target locale
 * @param {number} limit - Maximum number of products to return
 * @returns {Promise<{ products: Array, total: number, totalPages: number }>}
 */
export async function getCatalogInitialProductCards(locale = DEFAULT_LOCALE, limit = 12) {
  const isEs = locale === 'es' || !locale;
  const cacheKey = `${locale}:${limit}`;
  const cached = catalogCardsCache.get(cacheKey);
  const now = Date.now();
  if (cached && (now - cached.timestamp < CACHE_TTL)) {
    return cached.data;
  }

  try {
    const pipeline = [
      { $match: { status: 'active' } },
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [
            { $sort: { createdAt: -1 } },
            { $limit: limit },
            {
              $project: {
                _id: 1,
                name: 1,
                slug: 1,
                category: 1,
                price: 1,
                marketPrices: 1,
                brand: 1,
                thumbnail: 1,
                featured: 1,
                status: 1,
                images: { $slice: ['$images', 2] },
                ...(!isEs ? {
                  localizedName: `$translations.${locale}.name`,
                  localizedSlug: `$translations.${locale}.slug`,
                } : {})
              }
            }
          ]
        }
      }
    ];

    const facetResults = await prisma.product.aggregateRaw({ pipeline });
    const facet = Array.isArray(facetResults) ? facetResults[0] : facetResults;
    const total = facet?.metadata?.[0]?.total || 0;
    const rawData = facet?.data || [];

    const products = rawData.map((p) => {
      const id = p._id?.$oid || String(p._id);
      return {
        id,
        name: p.localizedName || p.name || '',
        slug: p.localizedSlug || p.slug || '',
        category: p.category || '',
        price: p.price ?? 0,
        marketPrices: p.marketPrices || null,
        brand: p.brand || '',
        images: Array.isArray(p.images) ? p.images : [],
        thumbnail: p.thumbnail || p.images?.[0] || null,
        featured: Boolean(p.featured),
        status: p.status || 'active',
      };
    });

    const result = {
      products,
      total,
      totalPages: Math.ceil(total / limit),
    };

    catalogCardsCache.set(cacheKey, { data: result, timestamp: now });
    return result;
  } catch (err) {
    console.error('Fallback in getCatalogInitialProductCards:', err);
    const [rawProducts, total] = await Promise.all([
      prisma.product.findMany({
        where: { status: 'active' },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          category: true,
          price: true,
          marketPrices: true,
          brand: true,
          images: true,
          thumbnail: true,
          featured: true,
          status: true,
          ...(isEs ? {} : { translations: true }),
        },
      }),
      prisma.product.count({ where: { status: 'active' } }),
    ]);

    const result = {
      products: rawProducts.map((p) => getLocalizedProductCard(p, locale)),
      total,
      totalPages: Math.ceil(total / limit),
    };

    catalogCardsCache.set(cacheKey, { data: result, timestamp: now });
    return result;
  }
}

/**
 * Resolves a localized brand entity with fallback, keeping ONLY the user-selected language.
 * @param {object} brand - Raw brand document from Prisma
 * @param {string} locale - Target locale
 * @param {object} [options] - Options: { includeAllTranslations: boolean }
 * @returns {object|null}
 */
export function getLocalizedBrand(brand, locale = DEFAULT_LOCALE, options = {}) {
  if (!brand) return null;
  const { translations: rawTranslations, ...brandFields } = brand;
  const selectedTrans = rawTranslations?.[locale];
  const finalTranslations = options.includeAllTranslations
    ? rawTranslations
    : (locale !== 'es' && selectedTrans ? { [locale]: selectedTrans } : undefined);

  return {
    ...brandFields,
    description: selectedTrans?.description || brand.description,
    ...(finalTranslations ? { translations: finalTranslations } : {}),
  };
}

import { cache } from 'react';

/**
 * Find a product by slug in a given locale.
 * Searches direct slug first (fast & indexed), then checks localized translations.
 * Never returns null if the product exists in the catalog.
 * @param {string} slug - The slug requested
 * @param {string} locale - The locale being browsed
 * @returns {Promise<object|null>}
 */
export const findProductByLocalizedSlug = cache(async function findProductByLocalizedSlug(slug, locale = DEFAULT_LOCALE, options = { includeAllTranslations: true }) {
  if (!slug) return null;

  const cacheKey = `${slug}:${locale}:${options?.includeAllTranslations ? 'all' : 'single'}`;
  const cached = productSlugCache.get(cacheKey);
  const now = Date.now();
  if (cached && (now - cached.timestamp < CACHE_TTL)) {
    return cached.data;
  }

  // Deduplicate concurrent in-flight requests (e.g. generateMetadata and Page executing concurrently)
  if (inFlightProductSlugPromises.has(cacheKey)) {
    return inFlightProductSlugPromises.get(cacheKey);
  }

  const queryPromise = (async () => {
    try {
      // 1. Try finding by root unique slug (fast indexed query on MongoDB)
      const directMatch = await prisma.product.findUnique({
        where: { slug },
      });

      if (directMatch) {
        const res = getLocalizedProduct(directMatch, locale, options);
        productSlugCache.set(cacheKey, { data: res, timestamp: Date.now() });
        return res;
      }

      // 2. Targeted query in MongoDB by localized slug across requested locale & supported locales
      const localeFilters = SUPPORTED_LOCALES.map((loc) => ({ [`translations.${loc}.slug`]: slug }));
      const rawMatches = await prisma.product.findRaw({
        filter: {
          status: 'active',
          $or: [
            { slug },
            ...localeFilters,
          ],
        },
        options: {
          projection: { _id: 1 },
          limit: 1,
        },
      });

      if (rawMatches && rawMatches.length > 0) {
        const matchedId = rawMatches[0]._id?.$oid || rawMatches[0]._id?.toString();
        if (matchedId) {
          const localizedProduct = await prisma.product.findUnique({
            where: { id: matchedId },
          });
          if (localizedProduct) {
            const res = getLocalizedProduct(localizedProduct, locale, options);
            productSlugCache.set(cacheKey, { data: res, timestamp: Date.now() });
            return res;
          }
        }
      }

      return null;
    } catch (error) {
      console.error(`Error looking up product by slug [${locale}:${slug}]:`, error.message);
      return null;
    } finally {
      inFlightProductSlugPromises.delete(cacheKey);
    }
  })();

  inFlightProductSlugPromises.set(cacheKey, queryPromise);
  return queryPromise;
});

// Removed over-engineered isSlugAvailable logic that downloaded the entire DB.

/**
 * Centralized upsert for product translations.
 * Safely updates `translations[locale]` without modifying root legacy fields.
 * @param {string} productId - Product ID
 * @param {string} locale - Locale to update
 * @param {object} translationData - { name, slug, description, seoTitle, seoDescription, status }
 * @returns {Promise<object>}
 */
export async function upsertProductTranslation(productId, locale, translationData) {
  if (!productId || !SUPPORTED_LOCALES.includes(locale)) {
    throw new Error('Invalid product ID or unsupported locale.');
  }

  const currentProduct = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!currentProduct) {
    throw new Error(`Product ${productId} not found.`);
  }

  const slug = (translationData.slug || translationData.name || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const existingTranslations = currentProduct.translations || {};
  const updatedTranslations = {
    ...existingTranslations,
    [locale]: {
      name: translationData.name?.trim() || currentProduct.name,
      slug: slug,
      description: translationData.description || currentProduct.description,
      seoTitle: translationData.seoTitle?.trim() || '',
      seoDescription: translationData.seoDescription?.trim() || '',
      status: translationData.status || 'published',
      updatedAt: new Date().toISOString(),
    },
  };

  const updated = await prisma.product.update({
    where: { id: productId },
    data: {
      translations: updatedTranslations,
    },
  });

  invalidateAllProductCaches();

  return updated;
}

/**
 * Ultra-fast cached featured products fetcher for homepage.
 * Queries active products with lightweight projection (no 22 translation descriptions)
 * and caches results in memory for 5 minutes.
 * @param {string} locale - Target locale
 * @param {number} limit - Maximum products to retrieve
 * @returns {Promise<Array>}
 */
export async function getHomepageFeaturedProducts(locale = DEFAULT_LOCALE, limit = 8) {
  const isEs = locale === 'es' || !locale;
  const cacheKey = `${locale}:${limit}`;
  const cached = homepageFeaturedCache.get(cacheKey);
  const now = Date.now();
  if (cached && (now - cached.timestamp < CACHE_TTL)) {
    return cached.data;
  }

  try {
    const rawProducts = await prisma.product.findMany({
      where: { status: 'active' },
      take: limit,
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
      select: {
        id: true,
        name: true,
        slug: true,
        category: true,
        price: true,
        marketPrices: true,
        brand: true,
        images: true,
        thumbnail: true,
        featured: true,
        status: true,
        ...(isEs ? {} : { translations: true }),
      },
    });

    const cards = rawProducts.map((p) => getLocalizedProductCard(p, locale));
    homepageFeaturedCache.set(cacheKey, { data: cards, timestamp: now });
    return cards;
  } catch (err) {
    console.error('Error fetching homepage featured products:', err.message);
    return [];
  }
}

/**
 * Ultra-fast cached brands fetcher for homepage.
 * @param {string} locale - Target locale
 * @param {number} limit - Maximum brands to retrieve
 * @returns {Promise<Array>}
 */
export async function getHomepageBrands(locale = DEFAULT_LOCALE, limit = 6) {
  const cacheKey = `${locale}:${limit}`;
  const cached = homepageBrandsCache.get(cacheKey);
  const now = Date.now();
  if (cached && (now - cached.timestamp < CACHE_TTL)) {
    return cached.data;
  }

  try {
    const rawBrands = await prisma.brand.findMany({
      take: limit,
      orderBy: { createdAt: 'asc' },
    });
    const brands = rawBrands.map((b) => getLocalizedBrand(b, locale));
    homepageBrandsCache.set(cacheKey, { data: brands, timestamp: now });
    return brands;
  } catch (err) {
    console.error('Error fetching homepage brands:', err.message);
    return [];
  }
}
