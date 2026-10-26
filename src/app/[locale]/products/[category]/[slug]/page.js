import { notFound } from 'next/navigation';
import Script from 'next/script';
import Link from 'next/link';
import { categories } from '@/data/products';
import ProductGallery from '@/components/ProductGallery/ProductGallery';
import ProductCard from '@/components/ProductCard/ProductCard';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import ProductActions from '@/components/ProductActions/ProductActions';
import PixelTracker from '@/components/PixelTracker/PixelTracker';
import ProductPrice from '@/components/ProductPrice/ProductPrice';
import { getLocalizedProduct, findProductByLocalizedSlug, getLocalizedProductCard, getCategoryProductCards } from '@/lib/translations/translation-service';
import { getMessages, getMessage } from '@/i18n/get-messages';
import { generateProductSchema, generateBreadcrumbSchema } from '@/lib/seo/schema';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/i18n/config';
import { Shield, Truck, Wrench, Clock, RotateCcw, ShieldCheck } from 'lucide-react';
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

import { generateLocalizedMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({ params }) {
  const { locale, category, slug } = await params;

  const product = await findProductByLocalizedSlug(slug, locale);

  if (!product) {
    return {
      title: 'Producto no encontrado | MuraHomes',
    };
  }

  const categoryName = categories.find((c) => c.id === category)?.name || product.category;
  const plainDescription = product.seoDescription || (product.description
    ? product.description.replace(/<[^>]*>?/gm, '').slice(0, 160)
    : `${product.name} de ${product.brand} — ${categoryName} de lujo en MuraHomes.`);
  const pageTitle = product.seoTitle || `${product.name} | MuraHomes`;

  const localeSlugs = {
    es: `products/${product.category}/${product.slug}`
  };

  if (product.translations) {
    for (const loc of SUPPORTED_LOCALES) {
      if (loc === 'es') continue;
      const trans = product.translations[loc];
      if (trans && (trans.status === 'published' || trans.name)) {
        localeSlugs[loc] = `products/${product.category}/${trans.slug || product.slug}`;
      } else {
        localeSlugs[loc] = `products/${product.category}/${product.slug}`;
      }
    }
  }

  return generateLocalizedMetadata({
    locale,
    path: `/products/${category}/${slug}`,
    translations: { title: pageTitle, description: plainDescription },
    localeSlugs,
    openGraph: {
      images: product.images?.length > 0 ? [{ url: product.images[0] }] : [],
    }
  });
}

export default async function LocalizedProductPage({ params }) {
  const { locale, category, slug } = await params;

  const product = await findProductByLocalizedSlug(slug, locale);

  if (!product) {
    notFound();
  }

  const messages = await getMessages(locale);
  const t = (k, p) => getMessage(messages, k, p);

  // Fetch related products (ultra-fast cached category cards)
  let relatedProducts = [];
  try {
    const categoryCards = await getCategoryProductCards(product.category, locale, 8);
    relatedProducts = (categoryCards?.products || [])
      .filter((p) => p.id !== product.id)
      .slice(0, 4);
  } catch (err) {
    console.warn(`[PDP DB Degradation] Related products fallback: ${err.message}`);
  }

  const categoryData = categories.find((c) => c.id === category);
  const categoryName = t(`categories.${category}`) || categoryData?.name || product.category;
  const canonicalUrl = `${SITE_URL}/${locale}/products/${category}/${slug}`;


  // Product Schema JSON-LD
  const productJsonLd = generateProductSchema({ product, locale, categoryName });

  // BreadcrumbList JSON-LD
  const breadcrumbJsonLd = generateBreadcrumbSchema([
    { name: t('navigation.home') || 'Inicio', path: `/${locale}` },
    { name: t('navigation.products') || 'Productos', path: `/${locale}/products` },
    { name: categoryName, path: `/${locale}/products/${category}` },
    { name: product.name, path: `/${locale}/products/${category}/${slug}` },
  ]);

  const getLocalizedHref = (path) => {
    if (locale === 'es') return path;
    return `/${locale}${path}`;
  };

  return (
    <div className="bg-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PixelTracker name="ViewContent" data={{ content_ids: [product.id], content_name: product.name, content_category: product.category, value: product.price, currency: 'EUR' }} />

      <div className="container mx-auto px-4 lg:px-8 pt-16 sm:pt-24 pb-28 sm:pb-24">
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-12">
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
              <BreadcrumbLink href={getLocalizedHref(`/products/${category}`)}>{categoryName}</BreadcrumbLink>
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
            <Link href={getLocalizedHref('/brands')} className="text-sm font-semibold tracking-widest text-primary hover:underline uppercase mb-4 inline-block w-fit">
              {product.brand}
            </Link>
            <h1 className="font-serif text-4xl lg:text-5xl font-medium tracking-tight mb-4">
              {product.name}
            </h1>
            
            <ProductPrice product={product} />

            {/* High-Trust Shipping, Returns & Delivery Card near Price */}
            <div className="bg-[#fbf9f6] border border-[#e8e2d8] rounded-2xl p-4 sm:p-5 mb-8 shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-3 divide-y sm:divide-y-0 sm:divide-x divide-[#e8e2d8]">
                {/* 1. Shipping */}
                <div className="flex items-start gap-3 sm:pr-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center shrink-0">
                    <Truck size={18} className="stroke-[2.2]" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-foreground block">
                      {t('product.shipping') || 'Envío y Entrega'}
                    </span>
                    <span className="text-xs text-muted-foreground font-light leading-snug block mt-0.5">
                      {t('delivery.freeAbove', { amount: '€500' }) || 'Envío gratis a partir de €500'}
                    </span>
                  </div>
                </div>

                {/* 2. Delivery Time */}
                <div className="flex items-start gap-3 sm:px-3 pt-3.5 sm:pt-0">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center shrink-0">
                    <Clock size={18} className="stroke-[2.2]" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-foreground block">
                      {t('product.deliveryBadge') || 'Entrega 5–15 días'}
                    </span>
                    <span className="text-xs text-muted-foreground font-light leading-snug block mt-0.5">
                      {t('delivery.standardNote', { min: 5, max: 15 }) || '5–15 días laborables'}
                    </span>
                  </div>
                </div>

                {/* 3. Returns & Guarantee */}
                <div className="flex items-start gap-3 sm:pl-3 pt-3.5 sm:pt-0">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
                    <RotateCcw size={18} className="stroke-[2.2]" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-foreground block">
                      {t('product.returnBadge')?.replace('↩ ', '') || '30 días devolución'}
                    </span>
                    <span className="text-xs text-muted-foreground font-light leading-snug block mt-0.5">
                      {t('product.warrantyBadge') || '2 años de garantía'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Actions (Primary Add to Cart button prominently placed before description) */}
            <ProductActions product={product} />

            {/* Product Description */}
            <div
              className="prose prose-lg prose-zinc font-light leading-relaxed mb-10 text-muted-foreground border-b border-border pb-10"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />

            {/* Specifications Accordion */}
            <Accordion type="single" collapsible="true" className="w-full">
              <AccordionItem value="dimensions">
                <AccordionTrigger className="font-serif text-lg py-5 hover:text-primary">
                  {t('product.dimensions') || 'Dimensiones'}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {product.dimensions || t('product.dimensionsDefault') || "Las dimensiones varían según la configuración modular. Por favor, contáctenos para medidas específicas."}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="materials">
                <AccordionTrigger className="font-serif text-lg py-5 hover:text-primary">
                  {t('product.materials') || 'Materiales y Acabados'}
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    {product.materials?.map((mat, idx) => (
                      <li key={idx}>{mat}</li>
                    )) || <li>{t('product.materialsDefault') || 'Materiales premium seleccionados por artesanos.'}</li>}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="shipping">
                <AccordionTrigger className="font-serif text-lg py-5 hover:text-primary">
                  <span className="flex items-center gap-2"><Truck size={16} /> {t('product.shipping') || 'Envío y Entrega'}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-5 space-y-2 text-muted-foreground text-sm leading-relaxed">
                  <p><strong className="text-foreground">{t('delivery.estimate', { min: 5, max: 15 }) || 'Plazo estándar:'}</strong> {t('product.standardDeliveryNote', { min: 5, max: 15 }) || '5–15 días laborables a toda Europa.'}</p>
                  <p><strong className="text-foreground">{t('product.shipping')}:</strong> {t('product.premiumDeliveryNote') || 'Entrega en habitación + retirada de embalaje disponible bajo petición.'}</p>
                  <p><strong className="text-foreground">{t('common.readMore')}:</strong> {t('product.trackingNote') || 'Recibirás un email con número de seguimiento en cuanto tu pedido sea enviado.'}</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="assembly">
                <AccordionTrigger className="font-serif text-lg py-5 hover:text-primary">
                  <span className="flex items-center gap-2"><Wrench size={16} /> {t('product.assembly') || 'Montaje e Instalación'}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-5 space-y-2 text-muted-foreground text-sm leading-relaxed">
                  <p>{t('product.assemblyNote') || 'La mayoría de piezas llegan premontadas o requieren montaje mínimo.'}</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="warranty">
                <AccordionTrigger className="font-serif text-lg py-5 hover:text-primary">
                  <span className="flex items-center gap-2"><Shield size={16} /> {t('product.warranty') || 'Garantía y Devoluciones'}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-5 space-y-2 text-muted-foreground text-sm leading-relaxed">
                  <p>{t('product.warrantyNote') || '2 años de garantía sobre la estructura principal de todos nuestros productos.'}</p>
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
            <SectionHeading title={t('product.relatedProducts') || "Completa el Look"} align="center" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {relatedProducts.map(relProduct => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
