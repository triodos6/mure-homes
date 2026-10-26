'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useI18n } from '@/context/I18nContext';
import { useMarket } from '@/context/MarketContext';
import { event } from '@/lib/pixel';
import { ShoppingCart, Check } from 'lucide-react';
import { getOptimizedImageUrl } from '@/lib/image-utils';

export default function ProductActions({ product }) {
  const { addToCart } = useCart();
  const { t } = useI18n();
  const { formatPrice, resolvePrice } = useMarket();
  const [added, setAdded] = useState(false);

  const priceInfo = resolvePrice(product);
  const displayPrice = priceInfo.price || product?.price || 0;
  const mainImage = getOptimizedImageUrl(product?.images?.[0] || product?.thumbnail, 200);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);

    event('AddToCart', {
      content_ids: [product.id],
      content_name: product.name,
      content_category: product.category,
      value: product.price,
      currency: 'EUR',
    });
  };

  return (
    <>
      {/* Primary Action Button (in page layout, prominently placed near price) */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Button
          size="lg"
          className="flex-1 py-6 text-sm uppercase tracking-widest font-bold cursor-pointer bg-black text-white hover:bg-black/90 active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-2 rounded-xl"
          onClick={handleAddToCart}
        >
          {added ? (
            <>
              <Check size={18} className="text-emerald-400 stroke-[2.5]" />
              <span className="text-emerald-400">{t('cart.added') || '¡Añadido a la Cesta!'}</span>
            </>
          ) : (
            <>
              <ShoppingCart size={18} />
              <span>{t('product.addToCart') || t('common.addToCart') || 'Añadir a la Cesta'}</span>
            </>
          )}
        </Button>
      </div>

      {/* Mobile Sticky Bottom Bar (Always visible on mobile viewports) */}
      <aside
        aria-label={t('product.addToCart') || 'Añadir a la cesta'}
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-border shadow-[0_-4px_25px_rgba(0,0,0,0.08)] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden transition-transform duration-300"
      >
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          {/* Product Thumbnail & Details */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {mainImage ? (
              <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-secondary shrink-0 border border-border/50">
                <Image
                  src={mainImage}
                  alt={product?.name || 'Producto'}
                  fill
                  sizes="44px"
                  unoptimized={typeof mainImage === 'string' && mainImage.startsWith('http')}
                  className="object-cover"
                />
              </div>
            ) : null}
            <div className="min-w-0 flex-1">
              <p className="font-serif text-xs font-medium text-foreground truncate leading-snug">
                {product?.name}
              </p>
              <p className="text-xs font-bold text-foreground mt-0.5">
                {formatPrice(displayPrice)}
              </p>
            </div>
          </div>

          {/* Quick Action Button */}
          <Button
            size="default"
            className="h-10 px-4 text-xs font-bold uppercase tracking-wider bg-black text-white hover:bg-black/90 active:scale-95 shadow-sm flex items-center gap-1.5 shrink-0 rounded-lg cursor-pointer"
            onClick={handleAddToCart}
          >
            {added ? (
              <>
                <Check size={15} className="text-emerald-400 stroke-[2.5]" />
                <span className="text-emerald-400">¡Listo!</span>
              </>
            ) : (
              <>
                <ShoppingCart size={15} />
                <span>{t('product.addToCart') || 'Añadir'}</span>
              </>
            )}
          </Button>
        </div>
      </aside>
    </>
  );
}
