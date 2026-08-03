import HomeHero from '@/components/HomeHero/HomeHero';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import CategoryCard from '@/components/CategoryCard/CategoryCard';
import ProductCard from '@/components/ProductCard/ProductCard';
import BrandCard from '@/components/BrandCard/BrandCard';
import NewsletterStrip from '@/components/NewsletterStrip/NewsletterStrip';
import { categories } from '@/data/products';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import img12 from '@/../public/images/img12.png';
import img17 from '@/../public/images/img17.jpg';
import img18 from '@/../public/images/img18.jpg';
import {
  Truck,
  RefreshCcw,
  ShieldCheck,
  Headphones,
  ArrowRight
} from 'lucide-react';

export default async function Home() {
  let [featuredProducts, brands] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true },
      take: 8,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.brand.findMany({
      take: 6,
      orderBy: { createdAt: 'asc' },
    }),
  ]);

  if (featuredProducts.length === 0) {
    featuredProducts = await prisma.product.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
    });
  }

  const trustItems = [
    { icon: Truck,       title: 'Envío Gratis',        sub: 'En pedidos superiores a €500' },
    { icon: RefreshCcw,  title: 'Devolución en 30 Días', sub: 'Devoluciones sin complicaciones' },
    { icon: ShieldCheck, title: 'Pagos Seguros',        sub: '100% Seguro' },
    { icon: Headphones,  title: 'Soporte 24/7',         sub: 'Asistencia dedicada' },
  ];

  return (
    <>
      {/* ── HERO (split layout) ─────────────────────────────────── */}
      <HomeHero />

      {/* ── TRUST BAR ───────────────────────────────────────────── */}
      <section className="border-y border-border bg-white">
        <div className="container mx-auto px-4 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y divide-border sm:divide-y-0 lg:divide-x">
            {trustItems.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-3 sm:gap-4 px-3 sm:px-6 py-4 sm:py-6 group hover:bg-secondary/30 transition-colors">
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-black flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Icon size={16} className="text-white sm:w-[18px] sm:h-[18px]" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-foreground">{title}</p>
                  <p className="text-[11px] sm:text-xs text-muted-foreground font-light">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COLLECTIONS BENTO GRID ──────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-12">
          <SectionHeading title="Nuestras Colecciones" subtitle="Descubre ocho mundos de diseño de lujo" align="center" />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10">
            {categories.slice(0, 8).map((category, i) => (
              <Link
                key={category.id}
                href={`/products/${category.id}`}
                className={`group relative overflow-hidden rounded-2xl bg-secondary/50
                  ${i === 0 ? 'col-span-2 row-span-2' : ''}
                  ${i === 3 ? 'col-span-2' : ''}
                `}
                style={{ minHeight: i === 0 ? 380 : 170 }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${category.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-serif text-lg font-medium leading-tight">{category.name}</h3>
                  <span className="inline-flex items-center gap-1 text-white/60 text-[10px] uppercase tracking-wider mt-1 group-hover:text-white transition-colors">
                    Ver <ArrowRight size={9} />
                  </span>
                </div>
                {i === 0 && (
                  <div className="absolute top-4 left-4 bg-amber-400 text-black px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-full">
                    Destacado
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ───────────────────────────────────── */}
      <section className="py-20 bg-[#f9f7f4]">
        <div className="container mx-auto px-4 lg:px-12">
          <div className="flex items-end justify-between mb-10">
            <SectionHeading title="Nuestros Productos" subtitle="Seleccionados por nuestros expertos de interiorismo" align="left" />
            <Link
              href="/products"
              className="hidden sm:inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black border-b border-black/20 pb-0.5 hover:border-black transition-all group"
            >
              Ver Todo <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {featuredProducts.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground italic">
              Los productos aparecerán aquí una vez añadidos desde el panel de administración.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-10 text-center sm:hidden">
            <Link href="/products" className={buttonVariants({ size: 'lg', className: 'px-10 uppercase tracking-widest text-sm' })}>
              Ver Todos los Productos
            </Link>
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHY STRIP ────────────────────────────────────── */}
      <section className="bg-[#0d0d0d] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[45fr_55fr] min-h-[520px]">
            {/* Image side */}
            <div className="relative overflow-hidden min-h-[320px]">
              <Image
                src="/images/img3.jpg"
                alt="Interiorismo mediterráneo MuraHomes"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
                quality={80}
              />
              <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.35)' }} />
              <div className="absolute bottom-8 left-8 right-8 z-10">
                <div className="h-px bg-white/20" />
                <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] mt-3 font-semibold">Fund. Barcelona, 2005</p>
              </div>
            </div>

            {/* Text side */}
            <div className="flex flex-col justify-center px-10 lg:px-20 py-20">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-10 bg-amber-400" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-400">Nuestra Filosofía</span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-medium leading-[1.1] text-white mb-6">
                Espacios que respiran el alma mediterránea y la sofisticación moderna.
              </h2>
              <p className="text-white/50 text-sm font-light leading-relaxed mb-10 max-w-sm">
                Cada pieza de nuestra colección se elige no solo por su belleza, sino por la forma en que transforma una habitación — y la vida que se vive en ella.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-amber-400 transition-all duration-300 group self-start"
              >
                Descubrir Nuestra Historia <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CRAFTSMANSHIP & TEAM ────────────────────────────────── */}
      <section className="py-24 bg-[#f9f7f4]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-10 bg-black" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/50">Nuestra Esencia</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-10">
            <h2 className="font-serif text-4xl md:text-5xl font-semibold leading-tight max-w-lg">
              Arte, Diseño y <span className="text-amber-500">Pasión</span>
            </h2>
            <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-sm">
              Detrás de cada pieza hay manos expertas y mentes creativas. Conoce a las personas que hacen posible MuraHomes.
            </p>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">

            {/* img12 — large landscape interior */}
            <div className="relative lg:col-span-2 rounded-2xl overflow-hidden min-h-[320px] group">
              <Image
                src={img12}
                alt="Salón mediterráneo de la colección MuraHomes"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 66vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white font-serif text-xl font-medium">Colección Mediterráneo-Escandinava</p>
                <p className="text-white/60 text-xs uppercase tracking-wider mt-1">MuraHomes · Barcelona</p>
              </div>
              <div className="absolute top-4 left-4 bg-amber-400 text-black px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full">
                Colección 2025
              </div>
            </div>

            {/* img17 + img18 stacked */}
            <div className="flex flex-col gap-4">
              <div className="relative rounded-2xl overflow-hidden flex-1 min-h-[220px] group">
                <Image
                  src={img17}
                  alt="Artesanos trabajando en el taller"
                  fill
                  className="object-cover object-[center_60%] transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-white font-serif text-base font-medium">Artesanía Tradicional</p>
                  <p className="text-white/60 text-[10px] uppercase tracking-wider mt-0.5">Taller de Producción</p>
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden flex-1 min-h-[220px] group">
                <Image
                  src={img18}
                  alt="Diseñadores con planos en el estudio"
                  fill
                  className="object-cover object-[center_30%] transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-white font-serif text-base font-medium">Los Diseñadores</p>
                  <p className="text-white/60 text-[10px] uppercase tracking-wider mt-0.5">Estudio de Diseño</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black border-b border-black/20 pb-0.5 hover:border-black transition-all group"
            >
              Conoce Nuestra Historia <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER STRIP ────────────────────────────────────── */}
      <NewsletterStrip />

      {/* ── BRANDS ──────────────────────────────────────────────── */}
      {brands.length > 0 && (
        <section className="py-12 sm:py-16 bg-white border-t border-border">
          <div className="container mx-auto px-4 lg:px-12">
            <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-8 sm:mb-10">Nuestras Marcas Asociadas</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
              {brands.map((brand) => (
                <BrandCard key={brand.id} brand={brand} />
              ))}
            </div>
            <div className="mt-8 sm:mt-10 text-center">
              <Link href="/brands" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-black transition-colors group">
                Todas las Marcas Asociadas <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
