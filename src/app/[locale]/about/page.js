import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, Award, Leaf, Users } from 'lucide-react';
import img13 from '@/../public/images/img13.png';
import img14 from '@/../public/images/img14.png';
import { getMessages, getMessage } from '@/i18n/get-messages';

import { generateLocalizedMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const t = (k, p) => getMessage(messages, k, p);

  const title = t('seo.aboutTitle') || `${t('navigation.about') || 'Nosotros'} | MuraHomes`;
  const description = t('seo.aboutDescription') || 'Descubre la historia de MuraHomes y nuestra pasión por el diseño de lujo.';

  return generateLocalizedMetadata({
    locale,
    path: '/about',
    translations: { title, description }
  });
}

export default async function LocalizedAboutPage({ params }) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const t = (k, p) => getMessage(messages, k, p);

  const getLocalizedHref = (path) => {
    if (locale === 'es') return path;
    return `/${locale}${path}`;
  };

  const stats = [
    { value: '2005',   label: t('about.foundedLabel') || 'Fundación' },
    { value: '500+',   label: t('about.curatedPieces') || 'Piezas Seleccionadas' },
    { value: '40+',    label: t('about.partnerBrands') || 'Marcas Asociadas' },
    { value: '3.000+', label: t('about.happyClients') || 'Clientes Satisfechos' },
  ];

  const values = [
    {
      icon: Star,
      title: t('about.value1Title') || 'Calidad Inquebrantable',
      desc: t('about.value1Desc') || 'Seleccionamos piezas no solo por su atractivo estético, sino por su integridad estructural y la durabilidad de sus materiales. El verdadero diseño debe perdurar.',
      bg: 'bg-amber-50',
      color: 'text-amber-600',
    },
    {
      icon: Leaf,
      title: t('about.value2Title') || 'Lujo Sostenible',
      desc: t('about.value2Desc') || 'Apoyamos a marcas que respetan su entorno, priorizando la extracción sostenible, el trabajo ético y los métodos de producción que minimizan el impacto.',
      bg: 'bg-emerald-50',
      color: 'text-emerald-600',
    },
    {
      icon: Users,
      title: t('about.value3Title') || 'Curaduría Personal',
      desc: t('about.value3Desc') || 'Nuestra relación con los clientes va más allá de una sola compra. Actuamos como curadores, ayudando a construir una estética coherente en todo el hogar.',
      bg: 'bg-blue-50',
      color: 'text-blue-600',
    },
    {
      icon: Award,
      title: t('about.value4Title') || 'Artesanía Tradicional',
      desc: t('about.value4Desc') || 'Cada marca de nuestra red está arraigada en el conocimiento artesanal multigeneracional — talleres que llevan más de un siglo perfeccionando su oficio.',
      bg: 'bg-violet-50',
      color: 'text-violet-600',
    },
  ];

  return (
    <>
      {/* ── PAGE HERO ─────────────────────────────────────────── */}
      <section className="relative bg-[#f9f7f4] overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#f0ece4]" style={{ clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 0% 100%)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-16 sm:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-10 bg-black" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/50">
                  {t('about.heroTag') || 'Fund. Usurbil, 2005'}
                </span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.05] tracking-tight mb-6">
                {t('about.heroTitlePrefix') || 'Nuestra'} <span className="text-amber-500">{t('about.heroTitleHighlight') || 'Historia'}</span>
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed mb-8 max-w-lg">
                {t('about.heroDescription') || 'Fundados con la convicción de que los muebles con los que vivimos deben elevar nuestra experiencia diaria. Lo que comenzó como una pequeña curaduría de piezas artesanales locales ha crecido hasta convertirse en una colección definitiva de diseño de lujo internacional.'}
              </p>
              <Link href={getLocalizedHref('/showroom')} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-black/80 transition-all group cursor-pointer">
                {t('about.bookConsultation') || 'Reservar una Consulta'} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="relative h-[320px] sm:h-[420px] lg:h-[520px] mt-4 lg:mt-0">
              <div
                className="absolute inset-0 rounded-2xl shadow-2xl bg-cover bg-center"
                style={{ backgroundImage: 'url("/images/img9.jpg")' }}
              />
              <div className="absolute -bottom-3 -left-3 sm:-bottom-6 sm:-left-6 bg-white rounded-2xl shadow-xl p-4 sm:p-5 z-10">
                <p className="text-2xl sm:text-3xl font-bold font-serif text-black">20+</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mt-1">
                  {t('about.yearsOfDesign') || 'Años en Diseño'}
                </p>
              </div>
              <div className="absolute top-3 -right-3 sm:top-6 sm:-right-6 bg-black text-white rounded-2xl shadow-xl px-4 py-3 sm:px-5 sm:py-4 z-10">
                <p className="text-xl sm:text-2xl font-bold font-serif">500+</p>
                <p className="text-[9px] sm:text-[10px] text-white/50 uppercase tracking-wider mt-0.5">
                  {t('about.curatedPieces') || 'Piezas Seleccionadas'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────────────── */}
      <section className="border-y border-border bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
            {stats.map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center justify-center py-10 px-6 text-center">
                <p className="font-serif text-4xl font-bold text-black mb-1">{value}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOUNDERS STORY ──────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[4/3] lg:h-[460px] w-full rounded-2xl overflow-hidden shadow-xl order-2 lg:order-1 bg-[#1a1a1a]">
              <Image
                src={img14}
                alt="Fundadores de MuraHomes"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 z-10">
                <p className="text-white font-serif text-xl">Mateo y Julián Santiago</p>
                <p className="text-white/60 text-xs uppercase tracking-wider mt-1">
                  {t('about.coFounders') || 'Co-Fundadores'}
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-10 bg-black" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/50">
                  {t('about.foundersTag') || 'Los Fundadores'}
                </span>
              </div>
              <h2 className="font-serif text-4xl font-semibold leading-tight mb-6">
                {t('about.legacyTitle1') || 'Un Legado de'} <span className="text-amber-500">{t('about.legacyTitle2') || 'Diseño'}</span>
              </h2>
              <div className="space-y-4 text-muted-foreground font-light leading-relaxed">
                <p>{t('about.foundersStoryP1') || 'Nuestros fundadores pasaron sus años formativos rodeados de la rica herencia arquitectónica del Mediterráneo. Aprendieron desde jóvenes que el verdadero lujo no se trata de ostentación, sino de la perfección de los materiales, la precisión de las proporciones y la honestidad del trabajo artesanal.'}</p>
                <p>{t('about.foundersStoryP2') || 'Hoy, MuraHomes colabora con los fabricantes más exigentes del mundo — desde talleres de cuero italiano multigeneracionales hasta estudios escandinavos de vanguardia — ofreciendo una selección inigualable a nuestros clientes más exigentes.'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OPERATIONS STRIP ────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0d0d0d] min-h-[340px] flex items-center">
        <div className="absolute inset-0">
          <Image
            src={img13}
            alt="Almacén y logística MuraHomes"
            fill
            className="object-cover opacity-30"
            sizes="100vw"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-16 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-amber-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-400">
                {t('about.logisticsTag') || 'Logística y Distribución'}
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-white leading-tight mb-4">
              {t('about.logisticsTitle1') || 'Detrás de Cada Pieza,'} <span className="text-amber-400">{t('about.logisticsTitle2') || 'Una Promesa'}</span>
            </h2>
            <p className="text-white/50 text-sm font-light leading-relaxed max-w-md">
              {t('about.logisticsDesc') || 'Nuestro almacén en Usurbil gestiona cientos de piezas de diseño en tránsito. Cada entrega está embalada con el mismo cuidado con el que fue fabricada — protegida hasta el último metro.'}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {[
              { value: '929 m²', label: t('about.warehouseSpace') || 'Espacio de Almacén' },
              { value: '48h',    label: t('about.expressDelivery') || 'Entrega Express' },
              { value: '100%',   label: t('about.securePackaging') || 'Embalaje Seguro' },
              { value: '0',      label: t('about.transitDamage') || 'Daños en Tránsito' },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                <p className="font-serif text-3xl font-bold text-white mb-1">{value}</p>
                <p className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES GRID ─────────────────────────────────────────── */}
      <section className="py-24 bg-[#f9f7f4]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground block mb-4">
              {t('about.valuesTag') || 'Nuestros Valores Fundamentales'}
            </span>
            <h2 className="font-serif text-4xl font-semibold">
              {t('about.valuesTitle1') || 'En Lo Que'} <span className="text-amber-500">{t('about.valuesTitle2') || 'Creemos'}</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc, bg, color }) => (
              <div key={title} className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group border border-border/50">
                <div className={`h-12 w-12 rounded-xl ${bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <Icon size={22} className={color} />
                </div>
                <h3 className="font-serif text-lg font-semibold mb-3">{title}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BLACK STRIP ─────────────────────────────────────── */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-400 block mb-4">
            {t('about.ctaTag') || 'Experimenta MuraHomes'}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-medium text-white mb-8">
            {t('about.ctaTitle') || 'Visita Nuestro Showroom en Usurbil'}
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={getLocalizedHref('/showroom')} className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-amber-400 transition-all group cursor-pointer">
              {t('about.ctaBookAppointment') || 'Reservar una Cita'} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href={getLocalizedHref('/products')} className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:border-white transition-all cursor-pointer">
              {t('about.ctaExploreProducts') || 'Explorar Productos'}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
