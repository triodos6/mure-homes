import { categories, getCategoryIcon } from '@/data/products';
import Script from 'next/script';
import ProductsGrid from '@/components/ProductsGrid/ProductsGrid';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import PixelTracker from '@/components/PixelTracker/PixelTracker';
import { getLocalizedProduct } from '@/lib/translations/translation-service';
import { getMessages, getMessage } from '@/i18n/get-messages';

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mura-homes.com';

export async function generateStaticParams() {
  return categories.map((c) => ({
    category: c.id,
  }));
}

import { generateLocalizedMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({ params }) {
  const { locale, category } = await params;
  const categoryData = categories.find(c => c.id === category);

  const messages = await getMessages(locale);
  const t = (k, p) => getMessage(messages, k, p);

  if (!categoryData) return { title: t('products.categoryNotFound') || 'Categoría no encontrada' };

  const localizedCategoryName = t(`categories.${categoryData.id}`) || categoryData.name;
  const localizedCategoryDesc = t(`categoryDescriptions.${categoryData.id}`) || categoryData.description;
  const pageTitle = `${localizedCategoryName} | MuraHomes`;

  return generateLocalizedMetadata({
    locale,
    path: `/products/${categoryData.id}`,
    translations: { title: pageTitle, description: localizedCategoryDesc }
  });
}

export default async function LocalizedCategoryPage({ params }) {
  const { locale, category } = await params;
  const categoryData = categories.find(c => c.id === category);

  if (!categoryData) {
    notFound();
  }

  const messages = await getMessages(locale);
  const t = (k, p) => getMessage(messages, k, p);
  const localizedCategoryName = t(`categories.${categoryData.id}`) || categoryData.name;
  const localizedCategoryDesc = t(`categoryDescriptions.${categoryData.id}`) || categoryData.description;

  const LIMIT = 12;

  const [rawProducts, total] = await Promise.all([
    prisma.product.findMany({
      where: { category, status: 'active' },
      orderBy: { createdAt: 'desc' },
      skip: 0,
      take: LIMIT,
    }),
    prisma.product.count({ where: { category, status: 'active' } }),
  ]);

  const categoryProducts = rawProducts.map((p) => getLocalizedProduct(p, locale));
  const totalPages = Math.ceil(total / LIMIT);

  // BreadcrumbList JSON-LD
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t('navigation.home') || 'Inicio', item: `${SITE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: t('navigation.products') || 'Productos', item: `${SITE_URL}/${locale}/products` },
      { '@type': 'ListItem', position: 3, name: localizedCategoryName, item: `${SITE_URL}/${locale}/products/${category}` },
    ],
  };

  const getLocalizedHref = (path) => {
    if (locale === 'es') return path;
    return `/${locale}${path}`;
  };

  return (
    <>
      <Script
        id="category-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PixelTracker name="ViewCategory" data={{ content_category: localizedCategoryName }} />
      <div className="relative pt-32 pb-24 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <Breadcrumb className="mb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={getLocalizedHref('/')}>{t('navigation.home') || 'Inicio'}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={getLocalizedHref('/products')}>{t('navigation.products') || 'Productos'}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{localizedCategoryName}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="max-w-3xl">
            <h1 className="font-serif text-5xl lg:text-6xl font-medium tracking-tight mb-6">
              {localizedCategoryName}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed font-light">
              {localizedCategoryDesc}
            </p>
          </div>
        </div>
      </div>

      <section className="py-24 bg-white min-h-[50vh]">
        <div className="container mx-auto px-4 lg:px-8">
          <ProductsGrid
            category={category}
            categoryName={localizedCategoryName}
            initialProducts={categoryProducts}
            initialTotal={total}
            initialTotalPages={totalPages}
          />

          {/* Category Cross-Links: Links to all other categories with category icons */}
          <div className="mt-20 pt-16 border-t border-border/60">
            <div className="text-center mb-10">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-600 block mb-2">
                {t('products.exploreMore') || 'Explorar Más'}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-medium text-foreground">
                {t('products.otherCollections') || 'Otras Colecciones de Lujo'}
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 max-w-6xl mx-auto">
              {categories
                .filter((c) => c.id !== categoryData.id)
                .map((c) => (
                  <Link
                    key={c.id}
                    href={getLocalizedHref(`/products/${c.id}`)}
                    className="group flex flex-col items-center justify-center p-4 rounded-xl border border-border/60 bg-[#f9f7f4] hover:bg-white hover:border-black/20 transition-all duration-300 hover:shadow-md text-center"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-white group-hover:bg-black group-hover:text-white transition-colors duration-300 shadow-xs mb-2.5">
                      <span className="text-xl sm:text-2xl">{getCategoryIcon(c.id)}</span>
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-foreground group-hover:text-amber-600 transition-colors line-clamp-1">
                      {t(`categories.${c.id}`) || c.name}
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
