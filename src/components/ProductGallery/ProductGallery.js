'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getOptimizedImageUrl } from '@/lib/image-utils';

export default function ProductGallery({ images, title }) {
  const [api, setApi] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setActiveIndex(api.selectedScrollSnap());
    };

    onSelect();

    api.on('select', onSelect);
    api.on('reInit', onSelect);

    return () => {
      api.off('select', onSelect);
      api.off('reInit', onSelect);
    };
  }, [api]);

  const handleThumbnailClick = (idx) => {
    setActiveIndex(idx);
    api?.scrollTo(idx);
  };

  if (!images || images.length === 0) {
    return (
      <Card className="aspect-[4/3] bg-secondary flex items-center justify-center border-border/40">
        <span className="text-muted-foreground font-serif italic text-sm">Image unavailable</span>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Feature Image Container */}
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full relative"
      >
        <CarouselContent>
          {images.map((img, idx) => (
            <CarouselItem key={idx}>
              <div className="relative aspect-[4/3] w-full bg-secondary rounded-xl overflow-hidden shadow-sm">
                <Image
                  src={getOptimizedImageUrl(img, 1200)}
                  alt={`${title} view ${idx + 1}`}
                  fill
                  preload={idx === 0}
                  fetchPriority={idx === 0 ? 'high' : 'auto'}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  quality={80}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Navigation Buttons placed inside the image bounding box for elegance */}
        {images.length > 1 && (
          <>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 border-none hover:bg-white text-foreground" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 border-none hover:bg-white text-foreground" />
          </>
        )}
      </Carousel>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
          {images.map((img, idx) => (
            <button
              key={idx}
              className={`relative aspect-square rounded-lg overflow-hidden bg-secondary border-2 transition-all duration-300 ${
                activeIndex === idx 
                  ? 'border-primary shadow-[0_0_15px_rgba(201,169,110,0.3)] scale-[1.05] z-10' 
                  : 'border-transparent opacity-70 hover:opacity-100 hover:scale-[1.02]'
              }`}
              onClick={() => handleThumbnailClick(idx)}
              aria-label={`View ${title} image ${idx + 1}`}
            >
              <div className="relative aspect-square w-full h-full">
                <Image
                  src={getOptimizedImageUrl(img, 300)}
                  alt={`${title} thumbnail ${idx + 1}`}
                  fill
                  loading="lazy"
                  quality={75}
                  sizes="120px"
                  className="object-cover"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
