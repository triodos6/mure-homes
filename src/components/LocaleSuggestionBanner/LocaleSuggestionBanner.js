'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useI18n } from '@/context/I18nContext';
import { LOCALE_LABELS, SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/i18n/config';
import { X, Globe2, ArrowRight, Sparkles } from 'lucide-react';
import { COUNTRY_TO_LOCALE } from '@/lib/markets/config';

const SUGGESTION_TEXTS = {
  fr: { message: 'Préférez-vous naviguer sur MuraHomes en Français ?', action: 'Passer au Français' },
  de: { message: 'Möchten Sie MuraHomes auf Deutsch durchsuchen?', action: 'Zu Deutsch wechseln' },
  it: { message: 'Desideri consultare MuraHomes in Italiano?', action: 'Passa all\'Italiano' },
  pt: { message: 'Deseja navegar no MuraHomes em Português?', action: 'Mudar para Português' },
  nl: { message: 'Wilt u MuraHomes in het Nederlands bekijken?', action: 'Naar het Nederlands' },
  pl: { message: 'Czy chcesz przeglądać MuraHomes po polsku?', action: 'Przejdź na polski' },
  sv: { message: 'Föredrar du att utforska MuraHomes på svenska?', action: 'Byt till svenska' },
  da: { message: 'Vil du foretrække at udforske MuraHomes på dansk?', action: 'Skift til dansk' },
  no: { message: 'Vil du heller utforske MuraHomes på norsk?', action: 'Bytt til norsk' },
  fi: { message: 'Haluatko selata MuraHomesia suomeksi?', action: 'Vaihda suomeksi' },
  lt: { message: 'Ar norėtumėte naršyti MuraHomes lietuvių kalba?', action: 'Rodyti lietuviškai' },
  lv: { message: 'Vai vēlaties pārlūkot MuraHomes latviešu valodā?', action: 'Pāriet uz latviešu' },
  et: { message: 'Kas eelistate sirvida MuraHomesi eesti keeles?', action: 'Lülitu eesti keelele' },
  cs: { message: 'Přejete si procházet MuraHomes v češtině?', action: 'Přepnout do češtiny' },
  sk: { message: 'Želáte si prehliadať MuraHomes v slovenčine?', action: 'Prepnúť do slovenčiny' },
  hu: { message: 'Szeretné a MuraHomes webhelyet magyarul böngészni?', action: 'Váltás magyarra' },
  ro: { message: 'Doriți să navigați pe MuraHomes în limba română?', action: 'Schimbă în română' },
  bg: { message: 'Предпочитате ли да разглеждате MuraHomes на български?', action: 'Към български' },
  el: { message: 'Προτιμάτε να περιηγηθείτε στο MuraHomes στα Ελληνικά;', action: 'Αλλαγή σε Ελληνικά' },
  hr: { message: 'Želite li pregledavati MuraHomes na hrvatskom jeziku?', action: 'Prebaci na hrvatski' },
  en: { message: 'Would you prefer to explore MuraHomes in English?', action: 'Switch to English' },
};

/**
 * Extracts pure path without any localized language prefixes
 */
function getCleanPath(pathname) {
  if (!pathname || pathname === '/') return '/';
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && SUPPORTED_LOCALES.includes(segments[0]) && segments[0] !== DEFAULT_LOCALE) {
    const withoutLocale = segments.slice(1).join('/');
    return withoutLocale ? `/${withoutLocale}` : '/';
  }
  return pathname;
}

export default function LocaleSuggestionBanner({ detectedCountry }) {
  const { locale: currentLocale } = useI18n();
  const [suggestedLocale, setSuggestedLocale] = useState(null);
  const [dismissed, setDismissed] = useState(true);
  const router = useRouter();
  const pathname = usePathname() || '/';

  useEffect(() => {
    try {
      const savedDismissedCountry = localStorage.getItem('murahomes_locale_suggest_dismissed_country');
      
      let targetLocale = null;

      if (detectedCountry) {
        targetLocale = COUNTRY_TO_LOCALE[detectedCountry];
      }

      // If no target locale from Geo IP, fallback to navigator
      if (!targetLocale) {
        const navLangs = navigator.languages || [navigator.language || ''];
        for (const lang of navLangs) {
          const primaryCode = lang.split('-')[0].toLowerCase();
          if (SUPPORTED_LOCALES.includes(primaryCode)) {
            targetLocale = primaryCode;
            break;
          }
        }
      }

      if (targetLocale && targetLocale !== currentLocale) {
        // If they already dismissed it for this specific country, ignore.
        const trackingKey = detectedCountry || `NAVIGATOR_${targetLocale}`;
        if (savedDismissedCountry === trackingKey) {
          return; // Already dismissed for this exact region/language
        }

        setTimeout(() => {
          setSuggestedLocale(targetLocale);
          setDismissed(false);
        }, 0);
      } else {
        setTimeout(() => {
          setDismissed(true);
        }, 0);
      }
    } catch { }
  }, [currentLocale, detectedCountry]);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      const trackingKey = detectedCountry || `NAVIGATOR_${suggestedLocale}`;
      localStorage.setItem('murahomes_locale_suggest_dismissed_country', trackingKey);
    } catch { }
  };

  const handleAccept = () => {
    if (!suggestedLocale) return;
    try {
      const trackingKey = detectedCountry || `NAVIGATOR_${suggestedLocale}`;
      localStorage.setItem('murahomes_locale_suggest_dismissed_country', trackingKey);
      localStorage.setItem('murahomes_locale', suggestedLocale);
      document.cookie = `murahomes_locale=${suggestedLocale}; path=/; max-age=31536000; SameSite=Lax`;
    } catch { }
    handleDismiss();
    
    // Construct localized destination path
    const cleanPath = getCleanPath(pathname);
    const targetUrl = cleanPath === '/' ? `/${suggestedLocale}` : `/${suggestedLocale}${cleanPath}`;
    window.location.href = targetUrl;
  };

  if (dismissed || !suggestedLocale || !SUGGESTION_TEXTS[suggestedLocale]) {
    return null;
  }

  const text = SUGGESTION_TEXTS[suggestedLocale];
  const label = LOCALE_LABELS[suggestedLocale];

  return (
    <div className="w-full bg-[#0d0d0d]/95 backdrop-blur-md text-white border-b border-white/10 shadow-lg animate-in slide-in-from-top duration-500 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2.5 flex items-center justify-between gap-4">
        
        {/* Left Side: Globe Icon + Message */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="hidden sm:flex p-1.5 rounded-xl bg-white/10 text-amber-300 shrink-0 border border-white/10">
            <Globe2 size={15} />
          </div>
          
          <div className="flex items-center gap-2 truncate">
            <span className="text-base leading-none shrink-0">{label?.flag}</span>
            <span className="truncate text-xs text-white/90 font-medium">
              <span className="font-bold text-white mr-1.5">{label?.nativeName}:</span>
              {text.message}
            </span>
          </div>
        </div>

        {/* Right Side: Action Button + Close */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleAccept}
            className="inline-flex items-center gap-1.5 bg-white text-black font-bold px-3.5 py-1.5 rounded-xl text-xs hover:bg-amber-300 hover:text-black transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <span>{text.action}</span>
            <ArrowRight size={12} className="shrink-0" />
          </button>
          
          <button
            type="button"
            onClick={handleDismiss}
            className="p-1.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Cerrar sugerencia"
            title="Cerrar"
          >
            <X size={15} />
          </button>
        </div>

      </div>
    </div>
  );
}
