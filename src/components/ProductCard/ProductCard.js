'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useI18n } from '@/context/I18nContext';
import { useMarket } from '@/context/MarketContext';
import { ShoppingCart, Shield, ImageOff } from 'lucide-react';
import { getOptimizedImageUrl } from '@/lib/image-utils';

export default function ProductCard({ product, preload = false }) {
  const { addToCart } = useCart();
  const { t, locale } = useI18n();
  const { formatPrice, resolvePrice } = useMarket();
  const [imgError, setImgError] = useState(false);

  const priceInfo = resolvePrice(product);
  const displayPrice = priceInfo.price || product.price;

  const mainImage = getOptimizedImageUrl(product.images?.[0], 600);
  const hasValidImage = Boolean(mainImage) && !imgError;

  const getLocalizedHref = (path) => {
    if (locale === 'es') return path;
    return `/${locale}${path}`;
  };

  const productUrl = getLocalizedHref(`/products/${product.category}/${product.slug}`);
  const categoryUrl = getLocalizedHref(`/products/${product.category}`);

  return (
    <div className="group flex flex-col h-full overflow-hidden rounded-xl border border-border/50 hover:border-black/20 hover:shadow-lg transition-all duration-300 active:scale-[0.99] touch-manipulation bg-white">
      {/* Image area */}
      <Link
        href={productUrl}
        className="relative block w-full bg-[#f9f7f4] focus:outline-none h-44 sm:h-52 md:h-56 overflow-hidden shrink-0"
      >
        {!hasValidImage && (
          <div className="absolute inset-0 bg-muted/60 flex items-center justify-center">
            <div className="flex flex-col items-center gap-1.5 text-muted-foreground/40">
              <ImageOff size={24} className="stroke-[1.5]" />
              <span className="text-[10px] font-medium uppercase tracking-wider">No image</span>
            </div>
          </div>
        )}

        {hasValidImage && (
          <Image
            src={mainImage}
            alt={product.name || 'Producto'}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            quality={80}
            preload={preload}
            fetchPriority={preload ? 'high' : 'auto'}
            loading={preload ? 'eager' : 'lazy'}
            onError={() => setImgError(true)}
            className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
          />
        )}
        {product.featured && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-black/90 backdrop-blur-xs text-white text-[8px] sm:text-[9px] uppercase font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 tracking-widest rounded-full z-10 shadow-sm pointer-events-none">
            {t('products.featuredBadge')}
          </div>
        )}
      </Link>

      {/* Content section */}
      <div suppressHydrationWarning className="flex flex-col flex-grow bg-white p-3 sm:p-4">
        <Link
          href={categoryUrl}
          className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-muted-foreground hover:text-amber-600 transition-colors mb-0.5 sm:mb-1 line-clamp-1 block"
        >
          {product.brand} · {t(`categories.${product.category}`) || product.category}
        </Link>
        <Link href={productUrl} className="flex-grow flex flex-col focus:outline-none">
          <h3 className="font-serif text-sm sm:text-base font-medium leading-snug text-foreground mb-1.5 sm:mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs sm:text-sm font-semibold tracking-wide text-foreground mt-auto">
            {formatPrice(displayPrice)}
          </p>
          <div className="flex items-center gap-1 mt-1 sm:mt-1.5">
            <Shield size={10} className="text-emerald-600 shrink-0" />
            <span className="text-[8px] sm:text-[9px] text-emerald-600 font-semibold uppercase tracking-wider line-clamp-1">
              {t('product.warrantyBadge')}
            </span>
          </div>
        </Link>

        {/* Action Button Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2 mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-border/50">
          <Link
            href={productUrl}
            className="flex-1 text-center bg-secondary/50 hover:bg-secondary text-secondary-foreground text-[9px] sm:text-[10px] font-bold uppercase tracking-wider sm:tracking-widest h-9 sm:h-10 px-2 rounded-lg flex items-center justify-center transition-colors truncate active:bg-secondary/80"
          >
            {t('common.viewDetails')}
          </Link>
          <button
            onClick={() => addToCart(product)}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-black text-white rounded-lg hover:bg-black/80 transition-all shadow-md active:scale-95 shrink-0"
            aria-label={`${t('common.addToCart')}: ${product.name}`}
            title={t('common.addToCart')}
          >
            <ShoppingCart size={14} className="sm:w-[15px] sm:h-[15px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
