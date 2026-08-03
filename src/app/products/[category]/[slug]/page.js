import { notFound } from 'next/navigation';
import Script from 'next/script';
import Link from 'next/link';
import { categories, products as staticProducts, getProductBySlug } from '@/data/products';
import prisma from '@/lib/prisma';
import ProductGallery from '@/components/ProductGallery/ProductGallery';
import ProductCard from '@/components/ProductCard/ProductCard';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import ProductActions from '@/components/ProductActions/ProductActions';
import ProductPixelTracker from '@/components/ProductPixelTracker/ProductPixelTracker';
import { RefreshCw, Shield, Truck, Wrench } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mura-homes.com';

async function fetchWithTimeout(promise, ms = 2500) {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('DB Query Timeout')), ms);
  });
  try {
    const result = await Promise.race([promise, timeoutPromise]);
    return result;
  } finally {
    clearTimeout(timer);
  }
}

export async function generateMetadata({ params }) {
  const { category, slug } = await params;

  let product = null;
  try {
    product = await fetchWithTimeout(prisma.product.findUnique({
      where: { slug },
    }));
  } catch (error) {
    console.error('Prisma metadata lookup error:', error.message);
  }

  if (!product) {
    product = getProductBySlug(slug);
  }

  if (!product) {
    return {
      title: 'Producto no encontrado | MuraHomes',
    };
  }

  const categoryName = categories.find((c) => c.id === category)?.name || product.category;
  const plainDescription = product.description
    ? product.description.replace(/<[^>]*>?/gm, '').slice(0, 160)
    : `${product.name} de ${product.brand} — ${categoryName} de lujo desde ${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(product.price)} en MuraHomes.`;
  const canonicalUrl = `${SITE_URL}/products/${category}/${slug}`;

  return {
    title: `${product.name} | MuraHomes`,
    description: plainDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${product.name} | MuraHomes`,
      description: plainDescription,
      url: canonicalUrl,
      type: 'website',
      images: product.images?.[0] ? [{ url: product.images[0], width: 1200, height: 900, alt: product.name }] : [],
    },
  };
}

export async function generateStaticParams() {
  try {
    const products = await fetchWithTimeout(prisma.product.findMany({
      select: { category: true, slug: true },
    }));

    if (products && products.length > 0) {
      return products.map((p) => ({
        category: p.category,
        slug: p.slug,
      }));
    }
  } catch (error) {
    console.error('Failed to generate static params for products from DB:', error.message);
  }

  return staticProducts.map((p) => ({
    category: p.category,
    slug: p.slug,
  }));
}

export default async function ProductPage({ params }) {
  const { category, slug } = await params;

  let product = null;
  try {
    product = await fetchWithTimeout(prisma.product.findUnique({
      where: { slug },
    }));
  } catch (error) {
    console.error('Prisma product lookup error:', error.message);
  }

  if (!product) {
    product = getProductBySlug(slug);
  }

  if (!product) {
    notFound();
  }

  let relatedProducts = [];
  try {
    relatedProducts = await fetchWithTimeout(prisma.product.findMany({
      where: {
        category: product.category,
        slug: { not: product.slug },
      },
      take: 4,
    }));
  } catch (error) {
    console.error('Prisma related products lookup error:', error.message);
  }

  if (!relatedProducts || relatedProducts.length === 0) {
    relatedProducts = staticProducts
      .filter((p) => p.category === product.category && p.slug !== product.slug)
      .slice(0, 4);
  }

  const categoryName = categories.find((c) => c.id === category)?.name || product.category;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(price);
  };

  const canonicalUrl = `${SITE_URL}/products/${category}/${slug}`;

  // Product JSON-LD
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description?.replace(/<[^>]*>?/gm, '').slice(0, 500) || '',
    image: product.images || [],
    brand: {
      '@type': 'Brand',
      name: product.brand || 'MuraHomes',
    },
    offers: {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: 'EUR',
      price: product.price,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'MuraHomes',
      },
    },
  };

  // BreadcrumbList JSON-LD
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Productos', item: `${SITE_URL}/products` },
      { '@type': 'ListItem', position: 3, name: categoryName, item: `${SITE_URL}/products/${category}` },
      { '@type': 'ListItem', position: 4, name: product.name, item: canonicalUrl },
    ],
  };

  return (
    <div className="bg-white min-h-screen">
      <Script
        id="product-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Script
        id="product-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductPixelTracker product={product} />

      <div className="container mx-auto px-4 lg:px-8 py-24">
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-12">
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
              <BreadcrumbLink href={`/products/${category}`}>{categoryName}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24">
          {/* Gallery */}
          <div className="lg:sticky lg:top-32 h-fit">
            <ProductGallery images={product.images} title={product.name} />
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <Link href="/brands" className="text-sm font-semibold tracking-widest text-primary hover:underline uppercase mb-4 inline-block w-fit">
              {product.brand}
            </Link>
            <h1 className="font-serif text-4xl lg:text-5xl font-medium tracking-tight mb-6">
              {product.name}
            </h1>
            <p className="text-2xl font-medium text-foreground mb-8">
              {formatPrice(product.price)}
            </p>

            <div
              className="prose prose-lg prose-zinc font-light leading-relaxed mb-10 text-muted-foreground border-b border-border pb-10"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
                <Shield size={12} className="text-emerald-600" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Garantía 2 años</span>
              </div>
              <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-full px-3 py-1">
                <Truck size={12} className="text-blue-600" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Entrega 5–15 días</span>
              </div>
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">↩ 30 días devolución</span>
              </div>
            </div>

            {/* Interactive Actions */}
            <ProductActions product={product} />

            {/* Specifications Accordion */}
            <Accordion type="single" collapsible="true" className="w-full">
              <AccordionItem value="dimensions">
                <AccordionTrigger className="font-serif text-lg py-5 hover:text-primary">
                  Dimensiones
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {product.dimensions || "Las dimensiones varían según la configuración modular. Por favor, contáctenos para medidas específicas."}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="materials">
                <AccordionTrigger className="font-serif text-lg py-5 hover:text-primary">
                  Materiales y Acabados
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    {product.materials?.map((mat, idx) => (
                      <li key={idx}>{mat}</li>
                    )) || <li>Materiales premium seleccionados por artesanos.</li>}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="shipping">
                <AccordionTrigger className="font-serif text-lg py-5 hover:text-primary">
                  <span className="flex items-center gap-2"><Truck size={16} /> Envío y Entrega</span>
                </AccordionTrigger>
                <AccordionContent className="pb-5 space-y-2 text-muted-foreground text-sm leading-relaxed">
                  <p><strong className="text-foreground">Plazo estándar:</strong> 5–15 días laborables a toda España peninsular.</p>
                  <p><strong className="text-foreground">Servicio premium:</strong> Entrega en habitación + retirada de embalaje disponible bajo petición.</p>
                  <p><strong className="text-foreground">Seguimiento:</strong> Recibirás un email con número de seguimiento en cuanto tu pedido sea enviado.</p>
                  <p><strong className="text-foreground">Coste:</strong> Envío gratuito en pedidos superiores a €500.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="assembly">
                <AccordionTrigger className="font-serif text-lg py-5 hover:text-primary">
                  <span className="flex items-center gap-2"><Wrench size={16} /> Montaje e Instalación</span>
                </AccordionTrigger>
                <AccordionContent className="pb-5 space-y-2 text-muted-foreground text-sm leading-relaxed">
                  <p><strong className="text-foreground">Estado de entrega:</strong> La mayoría de piezas llegan premontadas o requieren montaje mínimo (unión de patas, colocación de cojines).</p>
                  <p><strong className="text-foreground">Instrucciones:</strong> Todas las piezas incluyen instrucciones ilustradas paso a paso.</p>
                  <p><strong className="text-foreground">Servicio de montaje:</strong> Disponible en Gipuzkoa y alrededores. Consúltanos por WhatsApp.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="warranty">
                <AccordionTrigger className="font-serif text-lg py-5 hover:text-primary">
                  <span className="flex items-center gap-2"><Shield size={16} /> Garantía y Devoluciones</span>
                </AccordionTrigger>
                <AccordionContent className="pb-5 space-y-2 text-muted-foreground text-sm leading-relaxed">
                  <p><strong className="text-foreground">Garantía estructural:</strong> 2 años sobre marcos, soldaduras y estructura principal de todos nuestros productos.</p>
                  <p><strong className="text-foreground">Tapicería y acabados:</strong> 1 año de garantía contra defectos de fabricación.</p>
                  <p><strong className="text-foreground">Devoluciones:</strong> 30 días desde la recepción. El producto debe estar en su estado original. Gestionamos la recogida sin coste adicional.</p>
                  <p><strong className="text-foreground">Contacto:</strong> info@mura-homes.com · +34 627 080 811</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="bg-secondary/30 py-24 border-t border-border">
          <div className="container mx-auto px-4 lg:px-8">
            <SectionHeading title="Completa el Look" align="center" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
