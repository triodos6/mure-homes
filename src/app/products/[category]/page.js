import { categories, getCategoryIcon } from '@/data/products';
import Script from 'next/script';
import ProductCard from '@/components/ProductCard/ProductCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import CategoryPixelTracker from '@/components/CategoryPixelTracker/CategoryPixelTracker';
import CategorySearch from '@/components/CategorySearch/CategorySearch';

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

  return {
    title: `${categoryData.name} | MuraHomes`,
    description: categoryData.description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: `${categoryData.name} | MuraHomes`,
      description: categoryData.description,
      url: `${SITE_URL}${canonicalPath}`,
      type: 'website',
    },
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const { category } = await params;
  const sParams = await searchParams;
  const categoryData = categories.find(c => c.id === category);

  if (!categoryData) {
    notFound();
  }

  const LIMIT = 12;
  const page = Math.max(1, parseInt(sParams?.page || '1', 10));
  const search = sParams?.search || '';
  const skip = (page - 1) * LIMIT;

  // Build Prisma where clause — category is always applied, search is optional
  const where = search
    ? {
        category,
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { brand: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }
    : { category };

  const [categoryProducts, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: LIMIT,
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / LIMIT);

  // Build pagination URLs preserving the current search param
  const getPageUrl = (p) => {
    const params = new URLSearchParams();
    if (p > 1) params.set('page', String(p));
    if (search) params.set('search', search);
    const qs = params.toString();
    return qs ? `/products/${category}?${qs}` : `/products/${category}`;
  };

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
          {/* Search form — client component that updates URL params */}
          <CategorySearch initialSearch={search} />

          {/* Header: count + active search indicator */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
              {total} artículo{total !== 1 ? 's' : ''}
              {search ? ` para "${search}"` : ` en ${categoryData.name}`}
              {totalPages > 1 ? ` · Página ${page} de ${totalPages}` : ''}
            </h2>
            {search && (
              <Link
                href={`/products/${category}`}
                className="text-xs text-black underline underline-offset-2 hover:text-muted-foreground transition-colors"
              >
                Limpiar búsqueda
              </Link>
            )}
          </div>

          {categoryProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Server-rendered Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-16">
                  {page > 1 ? (
                    <Link
                      href={getPageUrl(page - 1)}
                      className="h-10 w-10 flex items-center justify-center border border-border rounded-lg hover:bg-secondary transition-colors"
                      aria-label="Página anterior"
                    >
                      <ChevronLeft size={16} />
                    </Link>
                  ) : (
                    <span className="h-10 w-10 flex items-center justify-center border border-border rounded-lg opacity-30 cursor-not-allowed">
                      <ChevronLeft size={16} />
                    </span>
                  )}

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                    const isEllipsis =
                      totalPages > 7 &&
                      p !== 1 &&
                      p !== totalPages &&
                      (p < page - 2 || p > page + 2);
                    const isPrevEllipsis = totalPages > 7 && p === 2 && page > 4;
                    const isNextEllipsis = totalPages > 7 && p === totalPages - 1 && page < totalPages - 3;

                    if (isEllipsis && !isPrevEllipsis && !isNextEllipsis) return null;
                    if (isEllipsis) {
                      return (
                        <span key={p} className="h-10 w-10 flex items-center justify-center text-muted-foreground text-sm">
                          …
                        </span>
                      );
                    }

                    return (
                      <Link
                        key={p}
                        href={getPageUrl(p)}
                        className={`h-10 w-10 flex items-center justify-center border rounded-lg text-sm font-medium transition-colors ${
                          page === p
                            ? 'bg-black text-white border-black'
                            : 'border-border hover:bg-secondary'
                        }`}
                      >
                        {p}
                      </Link>
                    );
                  })}

                  {page < totalPages ? (
                    <Link
                      href={getPageUrl(page + 1)}
                      className="h-10 w-10 flex items-center justify-center border border-border rounded-lg hover:bg-secondary transition-colors"
                      aria-label="Página siguiente"
                    >
                      <ChevronRight size={16} />
                    </Link>
                  ) : (
                    <span className="h-10 w-10 flex items-center justify-center border border-border rounded-lg opacity-30 cursor-not-allowed">
                      <ChevronRight size={16} />
                    </span>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-secondary/20 rounded-xl border border-border">
              <h2 className="font-serif text-2xl font-medium mb-4">
                {search ? 'Sin resultados' : 'Colección Próximamente'}
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                {search
                  ? `No se encontraron productos para "${search}" en ${categoryData.name}.`
                  : 'Actualmente estamos seleccionando nuevas piezas para esta colección. Por favor, vuelve más tarde.'}
              </p>
              {search && (
                <Link
                  href={`/products/${category}`}
                  className="inline-block mt-6 text-xs font-bold uppercase tracking-widest text-black border-b border-black/20 hover:border-black transition-all"
                >
                  Ver todos los productos →
                </Link>
              )}
            </div>
          )}

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
