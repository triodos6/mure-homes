'use client';

import Link from 'next/link';
import { useI18n } from '@/context/I18nContext';

export default function CategoryCard({ category }) {
  const { t, locale } = useI18n();

  const getLocalizedHref = (path) => {
    if (locale === 'es') return path;
    return `/${locale}${path}`;
  };

  const localizedName = t(`categories.${category.id}`) || category.name;

  return (
    <Link
      href={getLocalizedHref(`/products/${category.id}`)}
      className="group block focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-xl transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm hover:shadow-md transition-all duration-300">
        {/* Image — flush to top corners */}
        <div className="relative aspect-[4/5] bg-secondary w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
            style={{
              backgroundImage: category.image ? `url(${category.image})` : undefined,
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="absolute inset-0 border-[0.5px] border-white/0 group-hover:border-white/20 transition-colors duration-500 m-4 pointer-events-none" />
        </div>

        {/* Text */}
        <div className="p-5 text-center">
          <h3 className="font-serif text-xl font-medium tracking-wide mb-2">
            {localizedName}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {category.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
