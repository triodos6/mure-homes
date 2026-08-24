import prisma from '@/lib/prisma';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/i18n/config';

/**
 * Resolves a localized product view from a DB product entity.
 * If translation for requested locale is missing, seamlessly falls back to default Spanish fields.
 * Never returns null for an existing product.
 * @param {object} product - Raw product document from Prisma
 * @param {string} locale - Target locale (es, fr, de, it, lt, en)
 * @returns {object|null} Localized product object with fallback
 */
export function getLocalizedProduct(product, locale = DEFAULT_LOCALE) {
  if (!product) return null;

  const esTrans = product.translations?.es || {};
  const baseName = esTrans.name || product.name || '';
  const baseSlug = esTrans.slug || product.slug || '';
  const baseDesc = esTrans.description || product.description || '';
  const baseSeoTitle = esTrans.seoTitle || `${baseName} | MuraHomes`;
  const baseSeoDesc = esTrans.seoDescription || (baseDesc ? baseDesc.replace(/<[^>]*>?/gm, '').slice(0, 160) : '');

  // Spanish is primary baseline
  if (locale === 'es') {
    return {
      ...product,
      name: baseName,
      slug: baseSlug,
      description: baseDesc,
      seoTitle: baseSeoTitle,
      seoDescription: baseSeoDesc,
      isTranslated: true,
      isFallback: false,
      translationStatus: 'published',
    };
  }

  const translation = product.translations?.[locale];

  // If active translation exists with at least a name
  if (translation && (translation.status === 'published' || translation.name)) {
    return {
      ...product,
      name: translation.name || baseName,
      slug: translation.slug || baseSlug,
      description: translation.description || baseDesc,
      seoTitle: translation.seoTitle || `${translation.name || baseName} | MuraHomes`,
      seoDescription: translation.seoDescription || (translation.description ? translation.description.replace(/<[^>]*>?/gm, '').slice(0, 160) : baseSeoDesc),
      isTranslated: true,
      isFallback: false,
      translationStatus: translation.status || 'published',
    };
  }

  // Graceful fallback to default Spanish content
  return {
    ...product,
    name: baseName,
    slug: baseSlug,
    description: baseDesc,
    seoTitle: baseSeoTitle,
    seoDescription: baseSeoDesc,
    isTranslated: true,
    isFallback: true,
    translationStatus: 'fallback',
  };
}

/**
 * Resolves a localized brand entity with fallback.
 * @param {object} brand - Raw brand document from Prisma
 * @param {string} locale - Target locale
 * @returns {object|null}
 */
export function getLocalizedBrand(brand, locale = DEFAULT_LOCALE) {
  if (!brand) return null;
  if (locale === 'es' || !brand.translations?.[locale]) {
    return brand;
  }
  const t = brand.translations[locale];
  return {
    ...brand,
    description: t.description || brand.description,
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
export const findProductByLocalizedSlug = cache(async function findProductByLocalizedSlug(slug, locale = DEFAULT_LOCALE) {
  if (!slug) return null;

  try {
    // 1. Try finding by root unique slug (fast indexed query on MongoDB)
    const directMatch = await prisma.product.findUnique({
      where: { slug },
    });

    if (directMatch) {
      return getLocalizedProduct(directMatch, locale);
    }

    // 2. If not found by direct slug, query all products and match in-memory across all 22 locales
    const allProducts = await prisma.product.findMany({
      where: { status: 'active' },
    });

    const localizedMatch = allProducts.find((p) => {
      if (p.slug === slug) return true;
      const trans = p.translations || {};
      if (trans[locale]?.slug === slug) return true;
      for (const loc of Object.keys(trans)) {
        if (trans[loc]?.slug === slug) return true;
      }
      return false;
    });

    if (localizedMatch) {
      return getLocalizedProduct(localizedMatch, locale);
    }

    return null;
  } catch (error) {
    console.error(`Error looking up product by slug [${locale}:${slug}]:`, error.message);
    return null;
  }
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

  return updated;
}
