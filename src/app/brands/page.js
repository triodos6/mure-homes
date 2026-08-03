import Link from 'next/link';
import Image from 'next/image';
import BrandCard from '@/components/BrandCard/BrandCard';
import prisma from '@/lib/prisma';
import { ArrowRight, Globe, Award, Handshake } from 'lucide-react';
import img16 from '@/../public/images/img16.png';

export const metadata = {
  title: 'Nuestras Marcas | MuraHomes',
  description: "Colaboramos con los fabricantes de muebles y casas de diseño más prestigiosos del mundo.",
  alternates: {
    canonical: '/brands',
  },
  openGraph: {
    title: 'Nuestras Marcas | MuraHomes',
    description: 'Colaboramos con los fabricantes de muebles y casas de diseño más prestigiosos del mundo.',
    url: 'https://mura-homes.com/brands',
    type: 'website',
  },
};

const pillars = [
  { icon: Award,     title: 'Diseño con Herencia',  desc: 'Talleres multigeneracionales con décadas de excelencia respaldando cada pieza.' },
  { icon: Globe,     title: 'Alcance Global',        desc: 'Seleccionando lo mejor de Italia, Escandinavia, España y más allá.' },
  { icon: Handshake, title: 'Acceso Exclusivo',      desc: 'Colecciones de etiqueta privada y ediciones limitadas disponibles solo a través de MuraHomes.' },
];

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({ orderBy: { createdAt: 'asc' } });

  return (
    <>
      {/* ── PAGE HERO ────────────────────────────────────────────── */}
      <section className="relative bg-[#f9f7f4] overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#f0ece4]" style={{ clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 0% 100%)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-16 sm:py-24 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-10 bg-black" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/50">Asociaciones Exclusivas</span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.05] tracking-tight mb-6">
                Nuestras <span className="text-amber-500">Marcas</span> Asociadas
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed mb-8 max-w-lg">
                Cada marca de nuestro portafolio es seleccionada mediante un riguroso proceso que evalúa el origen de los materiales, la artesanía tradicional, la responsabilidad medioambiental y el vocabulario de diseño atemporal.
              </p>
              <Link href="/showroom" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-black/80 transition-all group">
                Explorar Showroom <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="relative h-[300px] sm:h-[380px] lg:h-[420px] mt-4 lg:mt-0">
              <div className="absolute inset-0 rounded-2xl shadow-2xl overflow-hidden bg-[#0d0d0d]">
                <Image
                  src={img16}
                  alt="Red global de marcas de diseño asociadas a MuraHomes"
                  fill
                  className="object-cover object-center"
                  priority
                />
              </div>
              <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 bg-white rounded-2xl shadow-xl px-4 py-3 sm:px-5 sm:py-4 z-10">
                <p className="text-2xl sm:text-3xl font-bold font-serif">{brands.length || '40'}+</p>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Marcas Asociadas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PILLARS BAR ─────────────────────────────────────────── */}
      <section className="border-y border-border bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
            {pillars.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 px-8 py-8">
                <div className="h-11 w-11 rounded-xl bg-black flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">{title}</p>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BRAND GRID ──────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground block mb-3">Una Red de Excelencia</span>
            <h2 className="font-serif text-3xl font-semibold">Representando lo <span className="text-amber-500">Mejor</span> del Diseño</h2>
          </div>

          {brands.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground italic">Las marcas asociadas aparecerán aquí una vez añadidas desde el panel de administración.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {brands.map((brand) => (
                <BrandCard key={brand.id} brand={brand} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── PARTNER CTA ─────────────────────────────────────────── */}
      <section className="py-20 bg-[#f9f7f4]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="bg-black rounded-3xl px-10 py-14 text-center relative overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-5 rounded-3xl"
              style={{ backgroundImage: 'url("/images/img4.jpg")' }}
            />
            <div className="relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-400 block mb-4">Trabaja Con Nosotros</span>
              <h2 className="font-serif text-4xl font-medium text-white mb-4">Conviértete en Socio</h2>
              <p className="text-white/60 text-sm font-light max-w-xl mx-auto mb-10 leading-relaxed">
                Siempre estamos buscando nuevos artesanos excepcionales y casas de diseño consolidadas que compartan nuestra visión del lujo mediterráneo.
              </p>
              <Link href="/showroom" className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-amber-400 transition-all group">
                Contactar con Nuestros Compradores <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
