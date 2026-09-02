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
export const findProductByLocalizedSlug = cache(async function findProductByLocalizedSlug(slug, locale = DEFAULT_LOCALE, options = {}) {
  if (!slug) return null;

  try {
    // 1. Try finding by root unique slug (fast indexed query on MongoDB)
    const directMatch = await prisma.product.findUnique({
      where: { slug },
    });

    if (directMatch) {
      return getLocalizedProduct(directMatch, locale, options);
    }

    // 2. If not found by direct slug, query all products and match in-memory across all locales
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
      return getLocalizedProduct(localizedMatch, locale, options);
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
