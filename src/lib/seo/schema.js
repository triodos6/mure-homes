export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mura-homes.com';

export function generateOrganizationSchema(locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MuraHomes',
    url: `${SITE_URL}/${locale}`,
    logo: `${SITE_URL}/images/logo.png`,
    sameAs: [
      'https://www.facebook.com/murahomes',
      'https://www.instagram.com/murahomes',
      'https://www.pinterest.com/murahomes'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+34-900-123-456',
      contactType: 'customer service',
      availableLanguage: ['es', 'en', 'fr', 'de', 'it', 'pt', 'pl']
    }
  };
}

export function generateWebSiteSchema(locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'MuraHomes',
    url: `${SITE_URL}/${locale}`,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/${locale}/products?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
}

export function generateProductSchema({ product, locale, categoryName }) {
  const isAvailable = product.stock > 0;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images || [],
    description: product.description?.replace(/<[^>]*>?/gm, '') || `${product.name} - ${categoryName}`,
    sku: product.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'MuraHomes'
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/${locale}/products/${product.category}/${product.slug}`,
      priceCurrency: 'EUR',
      price: product.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability: isAvailable ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: product.price > 500 ? '0' : '50',
          currency: 'EUR'
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: ['ES', 'FR', 'DE', 'IT', 'PT', 'PL']
        }
      }
    }
  };
}

export function generateBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`
    }))
  };
}
