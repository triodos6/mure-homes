import Link from 'next/link';
import Script from 'next/script';
import { Star, ArrowRight } from 'lucide-react';
import { getMessages, getMessage } from '@/i18n/get-messages';
import { generateLocalizedMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const t = (k, p) => getMessage(messages, k, p);

  const title = t('seo.resenasTitle') || `${t('navigation.resenas') || 'Reseñas'} | MuraHomes`;
  const description = t('seo.resenasDescription') || 'Descubre lo que dicen nuestros clientes sobre nuestros muebles de diseño y su experiencia con MuraHomes.';

  return generateLocalizedMetadata({
    locale,
    path: '/resenas',
    translations: { title, description }
  });
}

const stats = [
  { value: '4.9', label: 'Valoración Media', sub: 'Sobre 5 estrellas' },
  { value: '98%', label: 'Clientes Satisfechos', sub: 'Recomendarían MuraHomes' },
  { value: '3.000+', label: 'Pedidos Realizados', sub: 'Desde 2005' },
  { value: '30 días', label: 'Política de Devolución', sub: 'Sin preguntas' },
];

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          className={s <= rating ? 'fill-amber-400 text-amber-400' : 'text-border'}
        />
      ))}
    </div>
  );
}

export default async function LocalizedResenasPage({ params }) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const t = (k, p) => getMessage(messages, k, p);

  const reviews = [
    {
      id: 1,
      name: 'Alejandra Mártinez',
      location: t('reviewsData.r1.location') || 'Madrid',
      rating: 5,
      date: t('reviewsData.r1.date') || 'Marzo 2025',
      product: 'Sofá Modular Veneto',
      title: t('reviewsData.r1.title') || 'Superó todas mis expectativas',
      body: t('reviewsData.r1.body') || 'Llevaba meses buscando un sofá que combinara confort real con un diseño que no envejeciera. El Veneto es exactamente eso. La tapicería en bouclé es tan suave como se ve en las fotos. El equipo de MuraHomes me ayudó a elegir el color ideal para mi salón. Entrega puntual y montaje incluido. No podría estar más contenta.',
      avatar: 'AM',
      verified: true,
    },
    {
      id: 2,
      name: 'Carlos Ruiz Peñalver',
      location: t('reviewsData.r2.location') || 'Usurbil',
      rating: 5,
      date: t('reviewsData.r2.date') || 'Febrero 2025',
      product: 'Mesa de Comedor Giardino',
      title: t('reviewsData.r2.title') || 'Calidad de museo, precio razonable para lo que es',
      body: t('reviewsData.r2.body') || 'Compré la mesa Giardino para el comedor de nuestra casa en Sitges. La madera de teca es espectacular, cada veta es única. Tuve una duda sobre las dimensiones y me respondieron por WhatsApp en menos de una hora. La mesa llegó perfectamente embalada en madera contrachapada. Ya estamos pensando en las sillas.',
      avatar: 'CR',
      verified: true,
    },
    {
      id: 3,
      name: 'Isabel Fontaneda',
      location: t('reviewsData.r3.location') || 'Bilbao',
      rating: 5,
      date: t('reviewsData.r3.date') || 'Enero 2025',
      product: 'Sillón Usurbil Edition',
      title: t('reviewsData.r3.title') || 'El sillón que lleva años siendo mi favorito',
      body: t('reviewsData.r3.body') || 'He comprado muebles en muchos sitios pero MuraHomes tiene algo diferente: te tratan como a un cliente valioso, no como a un número. El sillón es simplemente perfecto. El cuero italiano mejora con el tiempo. Lo puse junto a la chimenea y es el rincón favorito de casa. 100% recomendado.',
      avatar: 'IF',
      verified: true,
    },
    {
      id: 4,
      name: 'Mikel Agirre',
      location: t('reviewsData.r4.location') || 'San Sebastián',
      rating: 5,
      date: t('reviewsData.r4.date') || 'Diciembre 2024',
      product: 'Lámpara de Pie Arco',
      title: t('reviewsData.r4.title') || 'Envío rapidísimo, producto impecable',
      body: t('reviewsData.r4.body') || 'Pedí la lámpara para un regalo de inauguración. Me confirmaron el pedido al momento y llegó en 3 días hábiles con un embalaje increíble. El diseño en latón mate es exactamente igual que en las fotos, nada de sorpresas desagradables. Mi amiga no se lo podía creer cuando le dije que lo había comprado online.',
      avatar: 'MA',
      verified: true,
    },
    {
      id: 5,
      name: 'Sofía Blanco-Herrera',
      location: t('reviewsData.r5.location') || 'Valencia',
      rating: 5,
      date: t('reviewsData.r5.date') || 'Noviembre 2024',
      product: 'Cómoda Japandi',
      title: t('reviewsData.r5.title') || 'Atención al cliente de primer nivel',
      body: t('reviewsData.r5.body') || 'Tuve un pequeño desperfecto en un cajón al llegar. Mandé un mensaje y en 24 horas ya habían enviado el recambio sin preguntar nada más. Eso dice mucho de una empresa. La cómoda en sí es preciosa, los acabados en madera de roble y latón son de una calidad altísima. Repetiré seguro.',
      avatar: 'SB',
      verified: true,
    },
    {
      id: 6,
      name: 'Javier Montoya',
      location: t('reviewsData.r6.location') || 'Sevilla',
      rating: 4,
      date: t('reviewsData.r6.date') || 'Octubre 2024',
      product: 'Conjunto Terraza Terrazza',
      title: t('reviewsData.r6.title') || 'Muy contento, pequeño retraso en la entrega',
      body: t('reviewsData.r6.body') || 'El conjunto de terraza es espectacular, teca de primera calidad y los cojines aguantan perfectamente el sol de Sevilla. Hubo un retraso de 5 días en la entrega por temas de stock, pero me avisaron con antelación y me ofrecieron descuento en el siguiente pedido. En general muy buena experiencia.',
      avatar: 'JM',
      verified: true,
    },
  ];

  // Review + AggregateRating JSON-LD
  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  const reviewJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'MuraHomes',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: avgRating,
      bestRating: '5',
      worstRating: '1',
      reviewCount: String(reviews.length),
    },
    review: reviews.map((r) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: r.name,
      },
      datePublished: r.date,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: String(r.rating),
        bestRating: '5',
      },
      name: r.title,
      reviewBody: r.body,
    })),
  };

  return (
    <>
      <Script
        id="resenas-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewJsonLd) }}
      />
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative bg-[#f9f7f4] overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#f0ece4]" style={{ clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 0% 100%)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-16 sm:py-24 lg:py-28">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-black" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/50">{t('reviews.heroTag') || 'Opiniones Verificadas'}</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.05] tracking-tight mb-6">
              {t('reviews.heroTitlePrefix') || 'Lo Que Dicen'} <span className="text-amber-500">{t('reviews.heroTitleHighlight') || 'Nuestros Clientes'}</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed max-w-lg">
              {t('reviews.heroDescription') || 'Más de 3.000 familias confían en MuraHomes para decorar sus hogares. Estas son algunas de sus historias.'}
            </p>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────── */}
      <section className="border-y border-border bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border">
            {stats.map(({ value, label, sub }) => (
              <div key={label} className="flex flex-col items-center justify-center py-6 sm:py-8 lg:py-10 px-4 sm:px-6 text-center">
                <p className="font-serif text-3xl sm:text-4xl font-bold text-black mb-1">{value}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-foreground font-semibold">{t(`reviews.stats.${label}`) || label}</p>
                <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">{t(`reviews.statsSub.${sub}`) || sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS GRID ─────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-[#f9f7f4] rounded-2xl p-5 sm:p-6 border border-border/50 flex flex-col gap-4 hover:shadow-md transition-all duration-300">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold shrink-0">
                      {review.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{review.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{review.location}</p>
                    </div>
                  </div>
                  {review.verified && (
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                      {t('reviews.verified') || 'Verificado'}
                    </span>
                  )}
                </div>

                {/* Rating + product */}
                <div className="flex items-center justify-between">
                  <StarRating rating={review.rating} />
                  <span className="text-[9px] text-muted-foreground uppercase tracking-wider">{review.date}</span>
                </div>

                {/* Product tag */}
                <div className="inline-flex w-fit items-center gap-1.5 bg-white border border-border px-3 py-1 rounded-full text-[10px] font-medium text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  {review.product}
                </div>

                {/* Title + body */}
                <div>
                  <p className="font-serif text-base font-semibold mb-2 text-foreground">&quot;{review.title}&quot;</p>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed line-clamp-4">{review.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 lg:py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-400 block mb-2">{t('reviews.ctaTag') || 'Únete a Nuestra Comunidad'}</span>
            <h3 className="font-serif text-2xl font-medium text-white">{t('reviews.ctaTitle') || 'Conviértete en el Próximo Cliente Satisfecho'}</h3>
          </div>
          <Link href="/products" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-amber-400 transition-all group shrink-0">
            {t('reviews.ctaButton') || 'Explorar Colecciones'} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </>
  );
}
