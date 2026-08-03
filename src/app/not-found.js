import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Home, Compass, Search } from 'lucide-react';
import { categories } from '@/data/products';

export const metadata = {
  title: '404 - Página no encontrada | MuraHomes',
  description: 'La página que buscas no está disponible o ha sido movida.',
  alternates: {
    canonical: '/not-found',
  },
};

export default function NotFound() {
  const featuredCategories = categories.slice(0, 4);

  return (
    <div className="bg-white min-h-screen flex flex-col justify-between">
      {/* ── HERO SECTION ────────────────────────────────────────── */}
      <section className="relative bg-[#f9f7f4] overflow-hidden py-24 sm:py-32">
        {/* Background polygon blob matching homepage design */}
        <div
          className="absolute top-0 right-0 w-1/2 h-full bg-[#f0ece4] hidden md:block"
          style={{ clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 0% 100%)' }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div>
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-10 bg-amber-500" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-600">
                  Error 404
                </span>
              </div>

              {/* Display 404 Number */}
              <p className="font-serif text-7xl sm:text-8xl md:text-9xl font-bold tracking-tight text-black/10 select-none mb-2">
                404
              </p>

              {/* Main Headline */}
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.1] text-foreground mb-6 -mt-8 sm:-mt-12">
                Página <span className="text-amber-500">no encontrada</span>
              </h1>

              {/* Subtext */}
              <p className="text-base sm:text-lg text-muted-foreground font-light leading-relaxed mb-8 max-w-lg">
                La dirección que has introducido no existe o el contenido ha sido reubicado. Te sugerimos explorar nuestro catálogo de piezas mediterráneas o regresar a la página principal.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  href="/"
                  className="group inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-black/80 transition-all duration-300 shadow-sm"
                >
                  <Home size={14} /> Volver al Inicio
                </Link>
                <Link
                  href="/products"
                  className="group inline-flex items-center justify-center gap-2 border border-black/20 text-black px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:border-black transition-all duration-300"
                >
                  <Compass size={14} /> Catálogo Completo
                </Link>
              </div>
            </div>

            {/* Right Visual Image Showcase */}
            <div className="relative h-[340px] sm:h-[420px] rounded-2xl overflow-hidden shadow-2xl group bg-secondary/30 hidden sm:block">
              <Image
                src="/images/img5.jpg"
                alt="Diseño de interiores mediterráneo MuraHomes"
                fill
                priority
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={85}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-amber-400 block mb-1">
                  MuraHomes Interiorismo
                </span>
                <p className="font-serif text-2xl font-medium">
                  Elegancia mediterránea para tu hogar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── RECOMMENDED CATEGORIES ───────────────────────────────── */}
      <section className="py-20 bg-white border-t border-border/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground block mb-2">
                Explora Nuestro Catálogo
              </span>
              <h2 className="font-serif text-3xl font-semibold">
                Categorías <span className="text-amber-500">Destacadas</span>
              </h2>
            </div>
            <Link
              href="/products"
              className="hidden sm:inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black border-b border-black/20 pb-0.5 hover:border-black transition-all group"
            >
              Ver Todas <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredCategories.map((category) => (
              <Link
                key={category.id}
                href={`/products/${category.id}`}
                className="group relative overflow-hidden rounded-xl bg-secondary/50 h-52 block"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${category.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-serif text-lg font-medium leading-tight">
                    {category.name}
                  </p>
                  <span className="inline-flex items-center gap-1 text-white/60 text-[10px] uppercase tracking-wider mt-1 group-hover:text-white transition-colors">
                    Explorar <ArrowRight size={10} />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black border-b border-black/20 pb-0.5"
            >
              Ver Todo el Catálogo <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SHOWROOM PROMO STRIP ─────────────────────────────────── */}
      <section className="py-14 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-400 block mb-2">
              ¿Buscas algo específico?
            </span>
            <h3 className="font-serif text-2xl font-medium">
              Visita nuestro showroom en Gipuzkoa o solicita una consulta privada
            </h3>
          </div>
          <Link
            href="/showroom"
            className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-amber-400 transition-all group shrink-0"
          >
            Reservar Cita <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
