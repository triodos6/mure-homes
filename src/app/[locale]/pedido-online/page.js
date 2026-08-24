import Link from 'next/link';
import { ArrowRight, ShoppingBag, ClipboardList, Truck, CheckCircle2, Shield, RotateCcw, Headphones, Lock } from 'lucide-react';
import { getMessages, getMessage } from '@/i18n/get-messages';
import { generateLocalizedMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const t = (k, p) => getMessage(messages, k, p);

  const title = t('seo.onlineOrderTitle') || `${t('navigation.onlineOrder') || 'Pedido Online'} | MuraHomes`;
  const description = t('seo.onlineOrderDescription') || 'Realiza tu pedido online de muebles de lujo en Mura Homes. Compra fácil y segura, con entrega a domicilio en toda España.';

  return generateLocalizedMetadata({
    locale,
    path: '/pedido-online',
    translations: { title, description }
  });
}

export default async function LocalizedPedidoOnlinePage({ params }) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const t = (k, p) => getMessage(messages, k, p);

  const getLocalizedHref = (path) => {
    if (locale === 'es') return path;
    return `/${locale}${path}`;
  };

  // 4 Steps Content with translations
  const steps = [
    {
      step: '01',
      icon: ShoppingBag,
      title: t('onlineOrder.step1Title') || 'Explora y Selecciona',
      desc: t('onlineOrder.step1Desc') || 'Navega por nuestras colecciones de muebles de lujo. Filtra por categoría, marca o estilo. Añade las piezas que desees a tu cesta.',
    },
    {
      step: '02',
      icon: ClipboardList,
      title: t('onlineOrder.step2Title') || 'Completa tu Solicitud',
      desc: t('onlineOrder.step2Desc') || 'Introduce tus datos de contacto y dirección de entrega. Revisamos tu pedido y te enviamos una propuesta personalizada en menos de 24 horas.',
    },
    {
      step: '03',
      icon: CheckCircle2,
      title: t('onlineOrder.step3Title') || 'Confirmación y Pago',
      desc: t('onlineOrder.step3Desc') || 'Recibirás una factura detallada por email. Confirma y realiza el pago de forma 100% segura mediante transferencia bancaria o tarjeta.',
    },
    {
      step: '04',
      icon: Truck,
      title: t('onlineOrder.step4Title') || 'Entrega a Domicilio',
      desc: t('onlineOrder.step4Desc') || 'Coordinamos la entrega a tu domicilio. Para piezas grandes, ofrecemos servicio de entrega en habitación e instalación incluida.',
    },
  ];

  // Guarantees Content with translations
  const guarantees = [
    {
      icon: Shield,
      title: t('product.warrantyBadge') || 'Garantía Estructural 2 Años',
      desc: t('product.warrantyNote') || 'Todas las piezas de nuestra colección incluyen garantía estructural de 2 años sobre marcos, soldaduras y estructuras principales.',
    },
    {
      icon: RotateCcw,
      title: t('product.returnBadge') || 'Devolución en 30 Días',
      desc: t('onlineOrder.returnsDesc') || 'Si no estás satisfecho, tienes 30 días para devolver tu compra. Gestionamos la recogida sin coste adicional en la Península.',
    },
    {
      icon: Lock,
      title: t('onlineOrder.securePaymentTitle') || 'Pago 100% Seguro',
      desc: t('onlineOrder.securePaymentDesc') || 'Todos los pagos están protegidos con cifrado SSL de 256 bits. Aceptamos transferencia bancaria, Visa, Mastercard y PayPal.',
    },
    {
      icon: Headphones,
      title: t('onlineOrder.supportTitle') || 'Soporte Personalizado',
      desc: t('onlineOrder.supportDesc') || 'Nuestro equipo de consultores está disponible por WhatsApp, email y teléfono para ayudarte en cada paso del proceso.',
    },
  ];

  // Localized FAQs
  const faqs = [
    {
      q: t('onlineOrder.faq1Q') || '¿Cuánto tarda la entrega?',
      a: t('onlineOrder.faq1A') || 'El plazo de entrega estándar es de 5 a 15 días laborables dependiendo del producto y tu ubicación en Europa. Piezas bajo pedido pueden tener plazos de 4 a 8 semanas.',
    },
    {
      q: t('onlineOrder.faq2Q') || '¿Realizáis envíos a toda Europa?',
      a: t('onlineOrder.faq2A') || 'Sí, realizamos envíos a todos los países de Europa (España, Francia, Alemania, Italia, Reino Unido, Lituania, Portugal, Países Bajos, Bélgica, Suiza, Austria, Polonia, Países Nórdicos y toda la Unión Europea). Todos los pedidos cuentan con seguro integral y seguimiento directo.',
    },
    {
      q: t('onlineOrder.faq3Q') || '¿Los muebles llegan montados?',
      a: t('onlineOrder.faq3A') || 'La mayoría de nuestras piezas llegan premontadas o requieren montaje mínimo (unión de patas, etc.). Para colecciones modulares, incluimos instrucciones detalladas. El servicio de montaje profesional está disponible bajo petición.',
    },
    {
      q: t('onlineOrder.faq4Q') || '¿Cómo funciona la devolución?',
      a: t('onlineOrder.faq4A') || 'Tienes 30 días desde la recepción para solicitar una devolución. El producto debe estar en su estado original. Contáctanos en info@mura-homes.com y gestionamos la recogida sin coste para ti.',
    },
    {
      q: t('onlineOrder.faq5Q') || '¿Puedo ver los productos en persona antes de comprar?',
      a: t('onlineOrder.faq5A') || 'Sí. Puedes visitar nuestro showroom en Usurbil, Gipuzkoa, o reservar una consulta privada con uno de nuestros diseñadores.',
    },
  ];

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative bg-[#f9f7f4] overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#f0ece4]" style={{ clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 0% 100%)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-black" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/50">
                {t('onlineOrder.secureTag') || 'Compra Online Segura'}
              </span>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-semibold leading-[1.05] tracking-tight mb-6">
              {t('onlineOrder.heroTitlePrefix') || 'Cómo Realizar Tu'} <span className="text-amber-500">{t('navigation.onlineOrder') || 'Pedido Online'}</span>
            </h1>
            <p className="text-base text-muted-foreground font-light leading-relaxed mb-8 max-w-lg">
              {t('onlineOrder.heroSubtitle') || 'Comprar muebles de lujo nunca ha sido tan sencillo. Proceso claro, pago seguro y entrega a domicilio en toda Europa.'}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href={getLocalizedHref('/products')} className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-black/80 transition-all group cursor-pointer">
                {t('navigation.collections') || 'Ver Colecciones'} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href={getLocalizedHref('/showroom')} className="inline-flex items-center gap-2 border border-black text-black px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all cursor-pointer">
                {t('home.showroomCTA') || 'Reservar Consulta'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STEPS ────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground block mb-4">
              {t('onlineOrder.stepsTag') || 'Proceso Simple'}
            </span>
            <h2 className="font-serif text-4xl font-semibold">
              {t('onlineOrder.stepsTitlePrefix') || 'Tu Pedido en'} <span className="text-amber-500">{t('onlineOrder.stepsTitleSuffix') || '4 Pasos'}</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map(({ step, icon: Icon, title, desc }, i) => (
              <div key={step} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-border -translate-x-1/2 z-0" />
                )}
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center shrink-0">
                      <Icon size={24} className="text-white" />
                    </div>
                    <span className="font-serif text-4xl font-bold text-black/10">{step}</span>
                  </div>
                  <h3 className="font-serif text-lg font-semibold">{title}</h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GUARANTEES ───────────────────────────────────────────── */}
      <section className="py-24 bg-[#f9f7f4]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground block mb-4">
              {t('onlineOrder.guaranteesTag') || 'Tu Tranquilidad es Nuestra Prioridad'}
            </span>
            <h2 className="font-serif text-4xl font-semibold">
              {t('onlineOrder.guaranteesTitlePrefix') || 'Compra con'} <span className="text-amber-500">{t('onlineOrder.guaranteesTitleSuffix') || 'Confianza'}</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {guarantees.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-border/50 hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Icon size={20} className="text-white" />
                </div>
                <h3 className="font-serif text-base font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PAYMENT LOGOS ────────────────────────────────────────── */}
      <section className="py-12 bg-white border-y border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-8">
            {t('onlineOrder.paymentMethods') || 'Métodos de Pago Aceptados'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {/* Visa */}
            <div className="h-10 px-4 bg-secondary/40 rounded-lg flex items-center justify-center border border-border/50">
              <svg viewBox="0 0 60 20" className="h-5 w-auto" fill="none">
                <text x="0" y="16" fontFamily="Arial" fontWeight="bold" fontSize="18" fill="#1A1F71">VISA</text>
              </svg>
            </div>
            {/* Mastercard */}
            <div className="h-10 px-3 bg-secondary/40 rounded-lg flex items-center justify-center gap-1 border border-border/50">
              <div className="w-7 h-7 rounded-full bg-[#EB001B] opacity-90" />
              <div className="w-7 h-7 rounded-full bg-[#F79E1B] opacity-90 -ml-3" />
            </div>
            {/* PayPal */}
            <div className="h-10 px-4 bg-secondary/40 rounded-lg flex items-center justify-center border border-border/50">
              <span className="font-bold text-sm text-[#003087]">Pay<span className="text-[#009cde]">Pal</span></span>
            </div>
            {/* Bizum */}
            <div className="h-10 px-4 bg-secondary/40 rounded-lg flex items-center justify-center border border-border/50">
              <span className="font-bold text-sm text-[#00B4F1]">Bizum</span>
            </div>
            {/* SSL */}
            <div className="h-10 px-4 bg-emerald-50 rounded-lg flex items-center gap-1.5 border border-emerald-200">
              <Lock size={13} className="text-emerald-600" />
              <span className="text-xs font-bold text-emerald-700">SSL 256-bit</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground block mb-4">
              {t('onlineOrder.faqTag') || 'Preguntas Frecuentes'}
            </span>
            <h2 className="font-serif text-4xl font-semibold">
              {t('onlineOrder.faqTitlePrefix') || '¿Tienes'} <span className="text-amber-500">{t('onlineOrder.faqTitleSuffix') || 'Dudas'}?</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map(({ q, a }) => (
              <details key={q} className="group border border-border rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none hover:bg-secondary/20 transition-colors">
                  <span className="font-medium text-sm pr-4">{q}</span>
                  <span className="shrink-0 w-6 h-6 rounded-full border border-border flex items-center justify-center text-muted-foreground group-open:rotate-45 transition-transform duration-200 text-lg leading-none">+</span>
                </summary>
                <div className="px-6 pb-5 pt-0 text-sm text-muted-foreground font-light leading-relaxed border-t border-border bg-secondary/10">
                  <p className="pt-4">{a}</p>
                </div>
              </details>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              {t('onlineOrder.noAnswerPrompt') || '¿No encuentras respuesta a tu pregunta?'}
            </p>
            <a
              href={`https://wa.me/34627080811?text=${encodeURIComponent(t('whatsapp.generalMessage') || 'Hola, me gustaría recibir más información.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#1ebe5a] transition-all cursor-pointer shadow-md rounded-full"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {t('whatsapp.buttonLabel') || 'Escríbenos por WhatsApp'}
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-400 block mb-4">
            {t('onlineOrder.ctaTag') || 'Listo para Empezar'}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-medium text-white mb-8">
            {t('onlineOrder.ctaTitle') || 'Encuentra tu Pieza Perfecta'}
          </h2>
          <Link href={getLocalizedHref('/products')} className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-amber-400 transition-all group cursor-pointer">
            {t('home.exploreCollections') || 'Explorar Colecciones'} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </>
  );
}
