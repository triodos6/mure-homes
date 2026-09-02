'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

const slides = [
  { src: '/images/img3.jpg',  alt: 'Sofá tapizado de lujo' },
  { src: '/images/img2.jpg',  alt: 'Espacio de vida moderno' },
  { src: '/images/img9.jpg',  alt: 'Sillones elegantes' },
  { src: '/images/img10.jpg', alt: 'Sillón de acento contemporáneo' },
  { src: '/images/img11.jpg', alt: 'Colección de sofás de diseño' },
];

export default function HomeHero() {
  const i18n = useI18n();
  const t = i18n?.t || ((key) => key);
  const locale = i18n?.locale || 'es';
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => setCurrent(i => (i + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent(i => (i - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 4500);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  const getLocalizedHref = (path) => {
    if (!locale || locale === 'es') return path;
    return path === '/' ? `/${locale}` : `/${locale}${path}`;
  };

  return (
    <section className="relative w-full min-h-[90vh] sm:min-h-[92vh] bg-[#f9f7f4] overflow-hidden flex items-center">

      {/* Decorative background blobs */}
      <div className="absolute top-0 right-0 w-[55%] h-full bg-[#f0ece4] clip-right" style={{clipPath:'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)'}} />
      <div className="absolute bottom-8 left-[8%] w-32 h-32 rounded-full border border-black/5" />
      <div className="absolute top-16 right-[38%] w-6 h-6 rounded-full bg-amber-400/30" />
      <div className="absolute bottom-24 right-[12%] w-3 h-3 rounded-full bg-black/10" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-20 sm:pt-24 lg:pt-8 pb-10 sm:pb-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-0 lg:min-h-[80vh]">

          {/* Left — Text Content */}
          <div className="flex flex-col justify-center">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-4 sm:mb-6 animate-in fade-in slide-in-from-left-4 duration-700">
              <div className="h-px w-8 sm:w-10 bg-black" />
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-black/50">
                {t('home.heroBadge') || "Colección Destacada 2025"}
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-serif font-semibold leading-[1.08] sm:leading-[1.05] tracking-tight mb-4 sm:mb-6 animate-in fade-in slide-in-from-left-6 duration-700 delay-100 fill-mode-both">
              <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground">
                {t('home.heroTitleLine1') || "Espacios de Diseño."}
              </span>
              <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-amber-500">
                {t('home.heroTitleLine2') || "Vive Mejor."}
              </span>
            </h1>

            {/* Sub */}
            <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed max-w-md mb-6 sm:mb-10 animate-in fade-in slide-in-from-left-4 duration-700 delay-200 fill-mode-both">
              {t('home.heroSubtitle') || "Muebles de lujo mediterráneos seleccionados — cada pieza diseñada para elevar tu vida cotidiana a través del diseño atemporal y la calidad sin compromiso."}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 animate-in fade-in slide-in-from-left-4 duration-700 delay-300 fill-mode-both">
              <Link
                href={getLocalizedHref('/products')}
                className="group inline-flex items-center justify-center gap-2 bg-black text-white px-7 sm:px-8 py-3.5 sm:py-4 text-xs font-bold uppercase tracking-[0.18em] sm:tracking-[0.2em] hover:bg-black/80 transition-all duration-300 w-full sm:w-auto text-center shadow-sm active:scale-[0.99]"
              >
                {t('home.heroCta') || "Comprar Ahora"}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href={getLocalizedHref('/about')}
                className="group inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.18em] sm:tracking-[0.2em] text-black border-b border-black/20 pb-0.5 hover:border-black transition-all duration-300 py-2 sm:py-0 w-full sm:w-auto text-center"
              >
                {t('navigation.about') || "Nuestra Historia"}
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform opacity-60" />
              </Link>
            </div>

            {/* Social strip */}
            <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-black/10 flex items-center gap-4 sm:gap-6 flex-wrap animate-in fade-in duration-700 delay-500 fill-mode-both">
              <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                {t('common.followUs') || "Síguenos"}
              </span>
              {['Instagram', 'Pinterest', 'Houzz'].map(s => (
                <span key={s} className="text-xs font-medium text-muted-foreground hover:text-black transition-colors cursor-pointer">{s}</span>
              ))}
            </div>
          </div>

          {/* Right — Slideshow */}
          <div className="relative flex items-center justify-center h-[360px] sm:h-[480px] lg:h-[680px] mt-4 lg:mt-0">

            {/* Main slideshow container */}
            <div
              className="relative z-10 w-full h-full sm:h-[90%] max-w-lg group"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="w-full h-full rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden bg-[#f0ece4]">
                {slides.map((slide, i) => {
                  const isInitial = i === 0;
                  return (
                    <div
                      key={slide.src}
                      className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    >
                      <Image
                        src={slide.src}
                        alt={slide.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 512px"
                        quality={80}
                        preload={isInitial}
                        fetchPriority={isInitial ? 'high' : 'auto'}
                        loading={isInitial ? 'eager' : 'lazy'}
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </div>
                  );
                })}
              </div>

              {/* Navigation arrows */}
              <button
                type="button"
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-foreground hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                aria-label="Previous slide"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-foreground hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                aria-label="Next slide"
              >
                <ChevronRight size={16} />
              </button>

              {/* Slide indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrent(i)}
                    className={`h-1.5 rounded-full transition-all ${i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
