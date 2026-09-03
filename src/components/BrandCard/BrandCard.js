'use client';

import { Card } from "@/components/ui/card";
import Image from 'next/image';

function isUrl(str) {
  return typeof str === "string" && (str.startsWith("http://") || str.startsWith("https://") || str.startsWith("/"));
}

export default function BrandCard({ brand }) {
  const logoIsUrl = isUrl(brand.logo);

  return (
    <Card className="group h-36 sm:h-40 md:h-48 flex flex-col items-center justify-center p-3 sm:p-5 md:p-6 border-border/40 hover:border-primary/30 transition-all duration-300 hover:shadow-md bg-card focus-within:ring-2 focus-within:ring-ring overflow-hidden">
      <div className="mb-2 sm:mb-3 md:mb-4 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 shrink-0">
        {logoIsUrl ? (
          <Image
            src={brand.logo}
            alt={brand.name || 'Marca'}
            width={64}
            height={64}
            unoptimized={logoIsUrl}
            className="max-w-full max-h-full object-contain"
            loading="lazy"
            onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
          />
        ) : null}
        <div
          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-secondary/50 items-center justify-center text-lg sm:text-xl md:text-2xl font-serif text-foreground"
          style={{ display: logoIsUrl ? 'none' : 'flex' }}
        >
          {brand.name?.charAt(0)?.toUpperCase()}
        </div>
      </div>
      <h3 className="font-serif text-base sm:text-lg md:text-xl font-medium tracking-wide text-foreground group-hover:text-primary transition-colors duration-300 text-center truncate w-full">
        {brand.name}
      </h3>
    </Card>
  );
}
