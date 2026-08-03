import Link from 'next/link';
import Script from 'next/script';
import { ArrowRight, MapPin, Clock, Phone, Calendar } from 'lucide-react';
import ShowroomBookingForm from '@/components/ShowroomBookingForm/ShowroomBookingForm';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mura-homes.com';

export const metadata = {
  title: 'Showroom en Usurbil, Gipuzkoa | MuraHomes',
  description:
    'Visita nuestro showroom de 929 m² en Usurbil, Gipuzkoa. Reserva una cita privada con nuestros diseñadores de interiores y experimenta nuestras colecciones de lujo en persona.',
  alternates: {
    canonical: '/showroom',
  },
  openGraph: {
    title: 'Showroom en Usurbil, Gipuzkoa | MuraHomes',
    description:
      'Showroom de mobiliario de lujo en Usurbil. 929 m² de colecciones exclusivas. Reserva tu consulta privada.',
    url: `${SITE_URL}/showroom`,
    type: 'website',
  },
};

const hours = [
  { day: 'Lunes – Viernes', time: '10:00 – 20:00' },
  { day: 'Sábado',          time: '10:00 – 18:00' },
  { day: 'Domingo',         time: 'Cerrado' },
];

export default function ShowroomPage() {
  // LocalBusiness JSON-LD
  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FurnitureStore',
    name: 'MuraHomes Showroom',
    description:
      'Showroom de mobiliario de lujo en Usurbil, Gipuzkoa. Más de 929 m² de colecciones exclusivas de muebles mediterráneos.',
    url: `${SITE_URL}/showroom`,
    telephone: '+34627080811',
    email: 'info@mura-homes.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Bo. Txiki-Erdi, 7',
      addressLocality: 'Usurbil',
      addressRegion: 'Gipuzkoa',
      postalCode: '20170',
      addressCountry: 'ES',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 43.2718,
      longitude: -2.0488,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '10:00',
        closes: '20:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '18:00',
      },
    ],
    priceRange: '€€€',
    image: `${SITE_URL}/images/img4.jpg`,
    sameAs: [],
  };

  return (
    <>
      <Script
        id="showroom-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />

      {/* ── PAGE HERO ────────────────────────────────────────────── */}
      <section className="relative bg-[#f9f7f4] overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#f0ece4]" style={{ clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 0% 100%)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-10 bg-black" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/50">Bo. Txiki-Erdi, 7 · Usurbil, Gipuzkoa</span>
              </div>
              <h1 className="font-serif text-5xl md:text-6xl font-semibold leading-[1.05] tracking-tight mb-6">
                Visita Nuestro <span className="text-amber-500">Showroom</span>
              </h1>
              <p className="text-base text-muted-foreground font-light leading-relaxed mb-8 max-w-lg">
                Nuestro showroom insignia en Usurbil ocupa más de 929 m² — diseñado como una galería viva donde cada habitación cuenta una historia. Experimenta la escala, textura y comodidad de nuestras piezas de primera mano.
              </p>
              <a href="#book" className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-black/80 transition-all group">
                Reservar una Cita <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
            <div className="relative h-[380px] rounded-2xl overflow-hidden shadow-2xl">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: 'url("/images/img4.jpg")' }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                <div>
                  <p className="text-white font-serif text-xl">Showroom de Barcelona</p>
                  <p className="text-white/60 text-xs uppercase tracking-wider mt-1">929 m²</p>
                </div>
                <div className="bg-amber-400 text-black rounded-full px-3 py-1.5 text-[9px] font-black uppercase tracking-wider">
                  Abierto Hoy
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INFO BAR ────────────────────────────────────────────── */}
      <section className="border-y border-border bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border">
            {[
              { icon: MapPin,    label: 'Ubicación',         value: 'Bo. Txiki-Erdi, 7 · Usurbil, Gipuzkoa' },
              { icon: Clock,     label: 'Días Laborables',   value: 'Lun–Vie: 10:00 – 20:00' },
              { icon: Calendar,  label: 'Sábado',            value: '10:00 – 18:00 · Dom Cerrado' },
              { icon: Phone,     label: 'WhatsApp / Tel',    value: '+34 627 080 811' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4 px-4 py-5 sm:px-6 sm:py-6">
                <div className="h-10 w-10 rounded-xl bg-black flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
                  <p className="text-sm font-medium text-foreground mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAP PREVIEW + FORM ───────────────────────────────────── */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 items-start">

            {/* Map + gallery */}
            <div className="space-y-5">
              <div
                className="w-full h-48 sm:h-64 rounded-2xl bg-cover bg-center shadow-lg border border-border/50"
                style={{ backgroundImage: 'url("/images/img3.jpg")' }}
              />
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div
                  className="h-28 sm:h-40 rounded-2xl bg-cover bg-center shadow-md"
                  style={{ backgroundImage: 'url("/images/img1.jpg")' }}
                />
                <div
                  className="h-28 sm:h-40 rounded-2xl bg-cover bg-center shadow-md"
                  style={{ backgroundImage: 'url("/images/img7.png")' }}
                />
              </div>
              <div className="bg-[#f9f7f4] rounded-2xl p-5 sm:p-6 border border-border/50">
                <h3 className="font-serif text-lg font-semibold mb-3">Cómo Llegar</h3>
                <div className="space-y-2.5 text-sm text-muted-foreground">
                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-2"><span className="font-semibold text-foreground min-w-20 shrink-0">Dirección:</span> Bo. Txiki-Erdi, 7, 20170 Usurbil, Gipuzkoa</div>
                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-2"><span className="font-semibold text-foreground min-w-20 shrink-0">En coche:</span> A-15, salida Usurbil · 10 min de Donostia</div>
                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-2"><span className="font-semibold text-foreground min-w-20 shrink-0">Aparcamiento:</span> Gratuito frente al local</div>
                </div>
              </div>
            </div>

            {/* Booking Form (Client Component) */}
            <ShowroomBookingForm />
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ───────────────────────────────────────────── */}
      <section className="py-14 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-400 mb-2">¿No puedes visitarnos en persona?</p>
            <h3 className="font-serif text-2xl font-medium text-white">Compra nuestras colecciones online</h3>
          </div>
          <Link href="/products" className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-amber-400 transition-all group shrink-0">
            Explorar Productos <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </>
  );
}
