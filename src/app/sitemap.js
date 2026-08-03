import prisma from '@/lib/prisma';
import { categories } from '@/data/products';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mura-homes.com';

export default async function sitemap() {
  // Static routes
  const staticRoutes = [
    '',
    '/about',
    '/products',
    '/brands',
    '/showroom',
    '/resenas',
    '/pedido-online',
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Category routes
  const categoryRoutes = categories.map((cat) => ({
    url: `${SITE_URL}/products/${cat.id}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  // Dynamic product routes from Prisma
  let productRoutes = [];
  try {
    const products = await prisma.product.findMany({
      select: {
        slug: true,
        category: true,
        updatedAt: true,
      },
    });

    productRoutes = products.map((product) => ({
      url: `${SITE_URL}/products/${product.category}/${product.slug}`,
      lastModified: product.updatedAt || new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Failed to fetch products for sitemap:', error);
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
