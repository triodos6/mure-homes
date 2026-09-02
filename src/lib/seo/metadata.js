import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/i18n/config';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mura-homes.com';


/**
 * Centralized SEO Metadata Factory
 * Generates title, description, bidirectional hreflang tags, canonicals, and duplicate content guards.
 *
 * @param {string} locale - The current request locale (e.g., 'es', 'fr')
 * @param {string} path - The localized path (e.g., '', '/about', '/products')
 * @param {object} translations - An object with { title, description } for the current locale
 * @param {object} openGraph - Optional OG overrides { title, description, images }
 * @param {object} localeSlugs - Optional map of localized slugs for this page { fr: 'chaussures', de: 'schuhe' }
 * @returns {import('next').Metadata}
 */
export function generateLocalizedMetadata({
  locale,
  path = '',
  translations = {},
  openGraph = {},
  localeSlugs = {},
}) {

  // 1. Build bidirectional hreflang alternates
  const languages = {};
  SUPPORTED_LOCALES.forEach((loc) => {
    // If a specific localized slug is provided for a locale, use it. Otherwise, fallback to the base path.
    // Ensure the path always starts with a slash, unless it's empty
    const locPath = localeSlugs[loc] || path;
    const formattedPath = locPath && !locPath.startsWith('/') ? `/${locPath}` : locPath;
    
    if (loc === DEFAULT_LOCALE) {
      languages[loc] = `${SITE_URL}${formattedPath}`;
    } else {
      languages[loc] = `${SITE_URL}/${loc}${formattedPath}`;
    }
  });

  // x-default fallback for unmatched locales (points to Spanish)
  const defaultFormattedPath = (localeSlugs[DEFAULT_LOCALE] || path) && !(localeSlugs[DEFAULT_LOCALE] || path).startsWith('/') ? `/${(localeSlugs[DEFAULT_LOCALE] || path)}` : (localeSlugs[DEFAULT_LOCALE] || path);
  languages['x-default'] = `${SITE_URL}${defaultFormattedPath}`;

  // 2. Canonical URL & Multi-lingual Indexing
  const currentLocPath = localeSlugs[locale] || path;
  const currentFormattedPath = currentLocPath && !currentLocPath.startsWith('/') ? `/${currentLocPath}` : currentLocPath;
  const canonicalUrl = locale === DEFAULT_LOCALE 
    ? `${SITE_URL}${currentFormattedPath}` 
    : `${SITE_URL}/${locale}${currentFormattedPath}`;

  const robots = {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  };

  return {
    title: translations.title,
    description: translations.description,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    robots,
    openGraph: {
      title: openGraph.title || translations.title,
      description: openGraph.description || translations.description,
      locale: locale,
      alternateLocale: SUPPORTED_LOCALES.filter((l) => l !== locale),
      ...openGraph,
    },
  };
}
