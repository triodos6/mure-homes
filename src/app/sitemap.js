import prisma from '@/lib/prisma';
import { categories } from '@/data/products';
import { SUPPORTED_LOCALES } from '@/i18n/config';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mura-homes.com';

export default async function sitemap() {
  const staticPaths = [
    '',
    '/about',
    '/products',
    '/brands',
    '/showroom',
    '/resenas',
    '/pedido-online',
  ];

  // 1. Static Routes with multilingual alternates
  const staticRoutes = staticPaths.map((route) => {
    const defaultUrl = `${SITE_URL}${route}`;
    const languages = {};

    for (const loc of SUPPORTED_LOCALES) {
      if (loc === 'es') {
        languages.es = defaultUrl;
      } else {
        languages[loc] = `${SITE_URL}/${loc}${route}`;
      }
    }
    languages['x-default'] = defaultUrl;

    return {
      url: defaultUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: route === '' ? 1.0 : 0.8,
      alternates: {
        languages,
      },
    };
  });

  // 2. Category Routes with multilingual alternates
  const categoryRoutes = categories.map((cat) => {
    const defaultUrl = `${SITE_URL}/products/${cat.id}`;
    const languages = {};

    for (const loc of SUPPORTED_LOCALES) {
      if (loc === 'es') {
        languages.es = defaultUrl;
      } else {
        languages[loc] = `${SITE_URL}/${loc}/products/${cat.id}`;
      }
    }
    languages['x-default'] = defaultUrl;

    return {
      url: defaultUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
      alternates: {
        languages,
      },
    };
  });

  // 3. Dynamic Product Routes from Prisma
  let productRoutes = [];
  try {
    const products = await prisma.product.findMany({
      where: {
        status: 'active',
      },
      select: {
        slug: true,
        category: true,
        translations: true,
        updatedAt: true,
      },
    });

    productRoutes = products.map((product) => {
      const defaultUrl = `${SITE_URL}/products/${product.category}/${product.slug}`;
      const languages = {
        es: defaultUrl,
      };

      // Check available published translations
      if (product.translations && typeof product.translations === 'object') {
        for (const loc of SUPPORTED_LOCALES) {
          if (loc === 'es') continue;
          const trans = product.translations[loc];
          if (trans && trans.status === 'published' && trans.slug) {
            languages[loc] = `${SITE_URL}/${loc}/products/${product.category}/${trans.slug}`;
          }
        }
      }

      languages['x-default'] = defaultUrl;

      return {
        url: defaultUrl,
        lastModified: product.updatedAt || new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
        alternates: {
          languages,
        },
      };
    });
  } catch (error) {
    console.error('Failed to fetch products for sitemap:', error.message);
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
