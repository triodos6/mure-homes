'use client';

import Link from 'next/link';
import Image from 'next/image';
import { categories } from '@/data/products';
import { useI18n } from '@/context/I18nContext';

export default function Footer() {
  const { t, locale } = useI18n();

  const getLocalizedHref = (path) => {
    if (locale === 'es') return path;
    return path === '/' ? `/${locale}` : `/${locale}${path}`;
  };

  return (
    <footer className="bg-black border-t border-white/10">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="py-12 sm:py-16 lg:py-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 lg:gap-16">
          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <Link href={getLocalizedHref('/')} className="flex items-center">
              <Image src="/logo.png" alt="MuraHomes" width={160} height={48} className="h-12 w-auto object-contain brightness-0 invert" style={{ width: 'auto', height: 'auto' }} />
            </Link>
            <p className="text-sm leading-relaxed text-white/50 max-w-xs">
              {t('footer.description')}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-serif text-xs font-semibold uppercase tracking-widest text-white mb-6">{t('footer.companyTitle')}</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href={getLocalizedHref('/about')} className="text-sm text-white/50 hover:text-white transition-colors">{t('navigation.about')}</Link></li>
              <li><Link href={getLocalizedHref('/products')} className="text-sm text-white/50 hover:text-white transition-colors">{t('navigation.products')}</Link></li>
              <li><Link href={getLocalizedHref('/brands')} className="text-sm text-white/50 hover:text-white transition-colors">{t('navigation.brands')}</Link></li>
              <li><Link href={getLocalizedHref('/pedido-online')} className="text-sm text-white/50 hover:text-white transition-colors">{t('navigation.onlineOrder')}</Link></li>
              <li><Link href={getLocalizedHref('/showroom')} className="text-sm text-white/50 hover:text-white transition-colors">{t('navigation.showroom')}</Link></li>
              <li><Link href={getLocalizedHref('/resenas')} className="text-sm text-white/50 hover:text-white transition-colors">{t('navigation.reviews')}</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-serif text-xs font-semibold uppercase tracking-widest text-white mb-6">{t('footer.collectionsTitle')}</h4>
            <ul className="flex flex-col gap-3">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link href={getLocalizedHref(`/products/${cat.id}`)} className="text-sm text-white/50 hover:text-white transition-colors">
                    {t(`categories.${cat.id}`) || cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-xs font-semibold uppercase tracking-widest text-white mb-6">{t('footer.contactTitle')}</h4>
            <ul className="flex flex-col gap-5">
              <li className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">Showroom</span>
                <span className="text-sm text-white/50">Bo. Txiki-Erdi, 7</span>
                <span className="text-sm text-white/50">20170 Usurbil, Gipuzkoa</span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">WhatsApp / Tel</span>
                <a href="tel:+34627080811" className="text-sm text-white/80 hover:text-white transition-colors">+34 627 080 811</a>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">Email</span>
                <a href="mailto:info@mura-homes.com" className="text-sm text-white/80 hover:text-white transition-colors">info@mura-homes.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Trust Bar */}
        <div className="py-6 border-t border-white/10">
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 mb-4 sm:mb-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 mr-1 sm:mr-2">Secure European Payment & Invoicing</span>
            <div className="h-8 px-3 bg-white/10 rounded flex items-center justify-center">
              <span className="font-bold text-white text-sm tracking-wider">VISA</span>
            </div>
            <div className="h-8 px-3 bg-white/10 rounded flex items-center justify-center gap-1">
              <div className="w-5 h-5 rounded-full bg-red-500/80" />
              <div className="w-5 h-5 rounded-full bg-amber-400/80 -ml-2.5" />
            </div>
            <div className="h-8 px-3 bg-white/10 rounded flex items-center justify-center">
              <span className="font-bold text-sm"><span className="text-[#009cde]">Pay</span><span className="text-[#003087]">Pal</span></span>
            </div>
            <div className="h-8 px-3 bg-white/10 rounded flex items-center justify-center">
              <span className="font-bold text-sm text-[#00B4F1]">Bizum / SEPA</span>
            </div>
            <div className="h-8 px-3 bg-emerald-900/40 rounded flex items-center gap-1.5 border border-emerald-700/40">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-emerald-400"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              <span className="text-[10px] font-bold text-emerald-400">SSL 256-bit</span>
            </div>
          </div>
        </div>
      </div>

      <div className="py-6 border-t border-white/10">
        <div className="container mx-auto px-4 lg:px-8 flex justify-center text-center">
          <p className="text-xs text-white/40">© {new Date().getFullYear()} MuraHomes. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
}
