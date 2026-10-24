'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function NavigationProgressBar() {
  const pathname = usePathname();
  const barRef = useRef(null);
  const containerRef = useRef(null);
  const timerRef = useRef(null);

  // Complete progress bar when pathname changes
  useEffect(() => {
    if (!barRef.current || !containerRef.current) return;

    // Fast finish animation
    barRef.current.style.width = '100%';
    const hideTimeout = setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.style.opacity = '0';
      }
      setTimeout(() => {
        if (barRef.current) {
          barRef.current.style.width = '0%';
        }
      }, 300);
    }, 200);

    return () => clearTimeout(hideTimeout);
  }, [pathname]);

  // Global click listener for internal links to start progress animation immediately
  useEffect(() => {
    const handleClick = (e) => {
      const anchor = e.target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      const target = anchor.getAttribute('target');

      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || target === '_blank') {
        return;
      }

      const currentUrl = window.location.pathname;
      if (href === currentUrl || href === window.location.pathname + window.location.search) return;

      if (containerRef.current && barRef.current) {
        containerRef.current.style.opacity = '1';
        barRef.current.style.width = '30%';

        if (timerRef.current) clearInterval(timerRef.current);
        let currentWidth = 30;
        timerRef.current = setInterval(() => {
          currentWidth += 15;
          if (currentWidth >= 85) {
            currentWidth = 85;
            clearInterval(timerRef.current);
          }
          if (barRef.current) {
            barRef.current.style.width = `${currentWidth}%`;
          }
        }, 120);
      }
    };

    document.addEventListener('click', handleClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleClick, { capture: true });
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      role="progressbar"
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2.5px] z-[99999] pointer-events-none transition-opacity duration-300 opacity-0"
    >
      <div
        ref={barRef}
        className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 shadow-[0_0_10px_rgba(245,158,11,0.7)] transition-all duration-200 ease-out"
        style={{ width: '0%' }}
      />
    </div>
  );
}
