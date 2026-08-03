import CategoryCard from '@/components/CategoryCard/CategoryCard';
import ProductsGrid from '@/components/ProductsGrid/ProductsGrid';
import { categories } from '@/data/products';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export const revalidate = 3600;

export const metadata = {
  title: 'Nuestros Productos | MuraHomes',
  description: 'Explora nuestras colecciones de muebles de lujo excepcionales.',
  alternates: {
    canonical: '/products',
  },
  openGraph: {
    title: 'Nuestros Productos | MuraHomes',
    description: 'Explora nuestras colecciones de muebles de lujo excepcionales.',
    url: 'https://mura-homes.com/products',
    type: 'website',
  },
};

export default async function ProductsPage() {
  const LIMIT = 12;
  const [initialProducts, initialTotal] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      skip: 0,
      take: LIMIT,
    }),
    prisma.product.count(),
  ]);

  const initialTotalPages = Math.ceil(initialTotal / LIMIT);

  return (
    <>
      {/* ── PAGE HERO ─────────────────────────────────────────── */}
      <section className="relative bg-[#f9f7f4] overflow-hidden">
        {/* Background polygon blob */}
        <div
          className="absolute top-0 right-0 w-1/2 h-full bg-[#f0ece4] clip-right hidden md:block"
          style={{ clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 0% 100%)' }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-20 sm:pt-24 lg:py-24 pb-12 lg:pb-24">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left — Hero Content */}
            <div className="flex flex-col justify-center">
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-4 sm:mb-6 animate-in fade-in slide-in-from-left-4 duration-700">
                <div className="h-px w-8 sm:w-10 bg-black" />
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-black/50">
                  500+ Piezas Seleccionadas
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-serif font-semibold leading-[1.08] sm:leading-[1.05] tracking-tight mb-4 sm:mb-6 animate-in fade-in slide-in-from-left-6 duration-700 delay-100 fill-mode-both">
                <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground">Explora Nuestras</span>
                <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-amber-500">Colecciones.</span>
              </h1>

              {/* Subtext */}
              <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed mb-6 sm:mb-8 max-w-lg animate-in fade-in slide-in-from-left-4 duration-700 delay-200 fill-mode-both">
                Ocho mundos de muebles de lujo — desde salones hasta terrazas exteriores. Cada pieza seleccionada por su artesanía, materiales nobles y diseño atemporal.
              </p>

              {/* Trust badges */}
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 flex-wrap text-xs text-muted-foreground font-medium animate-in fade-in duration-700 delay-300 fill-mode-both">
                <span className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-black/5 shadow-sm">
                  <ShieldCheck size={14} className="text-amber-500" /> Garantía de 5 Años
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-black/5 shadow-sm">
                  <Sparkles size={14} className="text-amber-500" /> Asesoramiento Privado
                </span>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 animate-in fade-in slide-in-from-left-4 duration-700 delay-400 fill-mode-both">
                <a
                  href="#products"
                  className="group inline-flex items-center justify-center gap-2 bg-black text-white px-7 sm:px-8 py-3.5 sm:py-4 text-xs font-bold uppercase tracking-[0.18em] sm:tracking-[0.2em] hover:bg-black/80 transition-all duration-300 w-full sm:w-auto text-center shadow-sm active:scale-[0.99]"
                >
                  Ver Todo <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#categories"
                  className="group inline-flex items-center justify-center gap-2 border border-black/20 text-black px-7 sm:px-8 py-3.5 sm:py-4 text-xs font-bold uppercase tracking-[0.18em] sm:tracking-[0.2em] hover:border-black transition-all duration-300 w-full sm:w-auto text-center"
                >
                  Por Categoría
                </a>
              </div>
            </div>

            {/* Right — Image Grid Showcase */}
            <div className="relative h-[340px] sm:h-[420px] lg:h-[480px] mt-4 lg:mt-0 animate-in fade-in slide-in-from-right-8 duration-1000 delay-200 fill-mode-both">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 h-full">
                {/* Large Main Image */}
                <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-xl group bg-secondary/30">
                  <Image
                    src="/images/img5.jpg"
                    alt="Salón de diseño de la colección MuraHomes"
                    fill
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    quality={85}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                </div>

                {/* Stacked Secondary Images */}
                <div className="flex flex-col gap-3 sm:gap-4">
                  <div className="relative flex-1 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl group bg-secondary/30">
                    <Image
                      src="/images/img4.jpg"
                      alt="Detalle de mueble de lujo"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      quality={85}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  </div>
                  <div className="relative flex-1 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl group bg-secondary/30">
                    <Image
                      src="/images/img1.jpg"
                      alt="Espacio interiorismo mediterráneo"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      quality={85}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  </div>
                </div>
              </div>

              {/* Floating Stat Badge */}
              <div className="absolute -bottom-3 -left-2 sm:-bottom-4 sm:left-4 z-20 bg-white/95 sm:bg-white backdrop-blur-md sm:backdrop-blur-none rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700 fill-mode-both border border-black/5">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-amber-400/20 flex items-center justify-center shrink-0 text-amber-600">
                  <Sparkles size={20} className="sm:w-[22px] sm:h-[22px]" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold font-serif leading-tight">8</p>
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Colecciones</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ──────────────────────────────────────────── */}
      <section id="categories" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground block mb-2">Explorar por</span>
              <h2 className="font-serif text-3xl font-semibold">Nuestras <span className="text-amber-500">Categorías</span></h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* ── ALL PRODUCTS ────────────────────────────────────────── */}
      <section id="products" className="py-20 bg-[#f9f7f4]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground block mb-2">El Catálogo Completo</span>
            <h2 className="font-serif text-3xl font-semibold">Todos los <span className="text-amber-500">Productos</span></h2>
          </div>
          <ProductsGrid
            initialProducts={initialProducts}
            initialTotal={initialTotal}
            initialTotalPages={initialTotalPages}
          />
        </div>
      </section>

      {/* ── CTA STRIP ───────────────────────────────────────────── */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-400 mb-2">¿Necesitas ayuda para elegir?</p>
            <h3 className="font-serif text-2xl font-medium text-white">Reserva una consulta de diseño privada</h3>
          </div>
          <Link href="/showroom" className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-amber-400 transition-all group shrink-0">
            Reservar Ahora <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </>
  );
}
