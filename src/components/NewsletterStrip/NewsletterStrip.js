'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { useI18n } from '@/context/I18nContext';

export default function NewsletterStrip() {
  const { t } = useI18n();
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success(t('newsletter.toastTitle') || '¡Suscrito!', {
      description: t('newsletter.toastDesc') || 'Gracias por unirte a la comunidad MuraHomes.'
    });
    setEmail('');
  };

  return (
    <section className="py-16 bg-[#f9f7f4] border-t border-border">
      <div className="container mx-auto px-4 lg:px-12 max-w-2xl text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-3">
          {t('newsletter.badge') || "Mantente al día"}
        </p>
        <h3 className="font-serif text-3xl font-medium mb-2">
          {t('newsletter.title') || "Infórmate y Obtén Ofertas Exclusivas"}
        </h3>
        <p className="text-sm text-muted-foreground mb-8 font-light">
          {t('newsletter.subtitle') || "Novedades, inspiración de diseño y acceso a ventas privadas — directamente en tu bandeja de entrada."}
        </p>
        <form onSubmit={handleSubmit} className="flex max-w-md mx-auto shadow-md rounded-lg overflow-hidden">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={t('newsletter.placeholder') || "Introduce tu correo electrónico"}
            className="flex-1 px-5 py-4 text-sm border-0 outline-none bg-white focus:ring-0"
          />
          <button
            type="submit"
            className="bg-black text-white px-6 py-4 text-xs font-bold uppercase tracking-widest hover:bg-black/80 transition-all shrink-0"
          >
            {t('newsletter.subscribe') || "Suscribirse"}
          </button>
        </form>
      </div>
    </section>
  );
}
