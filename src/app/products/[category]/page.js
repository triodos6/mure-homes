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
import CategoryPixelTracker from '@/components/CategoryPixelTracker/CategoryPixelTracker';

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mura-homes.com';

export async function generateStaticParams() {
  return categories.map((c) => ({
    category: c.id,
  }));
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const categoryData = categories.find(c => c.id === category);

  if (!categoryData) return { title: 'Categoría no encontrada' };

  const canonicalPath = `/products/${categoryData.id}`;
  const pageTitle = categoryData.metaTitle || `${categoryData.name} | MuraHomes`;
  const pageDescription = categoryData.metaDescription || categoryData.description;

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `${SITE_URL}${canonicalPath}`,
      type: 'website',
    },
  };
}

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const categoryData = categories.find(c => c.id === category);

  if (!categoryData) {
    notFound();
  }

  const LIMIT = 12;

  const [categoryProducts, total] = await Promise.all([
    prisma.product.findMany({
      where: { category },
      orderBy: { createdAt: 'desc' },
      skip: 0,
      take: LIMIT,
    }),
    prisma.product.count({ where: { category } }),
  ]);

  const totalPages = Math.ceil(total / LIMIT);

  // BreadcrumbList JSON-LD
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Productos', item: `${SITE_URL}/products` },
      { '@type': 'ListItem', position: 3, name: categoryData.name, item: `${SITE_URL}/products/${category}` },
    ],
  };

  return (
    <>
      <Script
        id="category-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CategoryPixelTracker categoryName={categoryData.name} />
      <div className="relative pt-32 pb-24 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <Breadcrumb className="mb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/products">Productos</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{categoryData.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="max-w-3xl">
            <h1 className="font-serif text-5xl lg:text-6xl font-medium tracking-tight mb-6">
              {categoryData.name}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed font-light">
              {categoryData.description}
            </p>
          </div>
        </div>
      </div>

      <section className="py-24 bg-white min-h-[50vh]">
        <div className="container mx-auto px-4 lg:px-8">
          <ProductsGrid
            category={category}
            categoryName={categoryData.name}
            initialProducts={categoryProducts}
            initialTotal={total}
            initialTotalPages={totalPages}
          />

          {/* Category Cross-Links: Links to all other 7 categories with category icons */}
          <div className="mt-20 pt-16 border-t border-border/60">
            <div className="text-center mb-10">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-600 block mb-2">
                Explorar Más
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-medium text-foreground">
                Otras Colecciones de Lujo
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 max-w-6xl mx-auto">
              {categories
                .filter((c) => c.id !== categoryData.id)
                .map((c) => (
                  <Link
                    key={c.id}
                    href={`/products/${c.id}`}
                    className="group flex flex-col items-center justify-center p-4 rounded-xl border border-border/60 bg-[#f9f7f4] hover:bg-white hover:border-black/20 transition-all duration-300 hover:shadow-md text-center"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-white group-hover:bg-black group-hover:text-white transition-colors duration-300 shadow-xs mb-2.5">
                      <span className="text-xl sm:text-2xl">{getCategoryIcon(c.id)}</span>
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-foreground group-hover:text-amber-600 transition-colors line-clamp-1">
                      {c.name}
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
