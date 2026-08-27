'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SUPPORTED_LOCALES, LOCALE_LABELS, DEFAULT_LOCALE } from '@/i18n/config';
import { useI18n } from '@/context/I18nContext';
import { getMarketForLocale } from '@/lib/markets/config';
import { ChevronDown, Check, Search, Globe2, X } from 'lucide-react';

const setLocaleCookie = (newLocale) => {
  try {
    if (typeof window !== 'undefined') {
      window.document.cookie = `murahomes_locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    }
  } catch { }
};

export default function LanguageSwitcher({ className = '', align = 'right' }) {
  const { locale: activeLocale, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearch('');
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 60);
    }
  }, [isOpen]);

  const filteredLocales = useMemo(() => {
    if (!search.trim()) return SUPPORTED_LOCALES;
    const q = search.toLowerCase().trim();
    return SUPPORTED_LOCALES.filter((loc) => {
      const info = LOCALE_LABELS[loc];
      return (
        loc.toLowerCase().includes(q) ||
        info?.name?.toLowerCase().includes(q) ||
        info?.nativeName?.toLowerCase().includes(q)
      );
    });
  }, [search]);

  const handleSelectLocale = (newLocale) => {
    if (newLocale === activeLocale) {
      setIsOpen(false);
      setSearch('');
      return;
    }

    // Safely extract pure path without any existing language prefix
    let cleanPath = '/';
    const rawPath = pathname || '/';
    const segments = rawPath.split('/').filter(Boolean);
    if (segments.length > 0 && SUPPORTED_LOCALES.includes(segments[0]) && segments[0] !== DEFAULT_LOCALE) {
      const rest = segments.slice(1).join('/');
      cleanPath = rest ? `/${rest}` : '/';
    } else {
      cleanPath = rawPath;
    }

    // Build destination path
    let targetPath = cleanPath;
    if (newLocale !== DEFAULT_LOCALE) {
      targetPath = cleanPath === '/' ? `/${newLocale}` : `/${newLocale}${cleanPath}`;
    }

    // Append search params if any
    const queryString = searchParams?.toString();
    const finalUrl = queryString ? `${targetPath}?${queryString}` : targetPath;

    setLocaleCookie(newLocale);

    setIsOpen(false);
    setSearch('');
    window.location.href = finalUrl;
  };

  const currentLabel = LOCALE_LABELS[activeLocale] || LOCALE_LABELS[DEFAULT_LOCALE];

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-foreground bg-white/80 hover:bg-white hover:border-black/30 transition-all border border-border/80 shadow-2xs focus:outline-none focus:ring-2 focus:ring-black/10 cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={t?.('common.selectLanguage', 'Seleccionar idioma') || 'Seleccionar idioma'}
      >
        <span className="text-base leading-none group-hover:scale-110 transition-transform">
          {currentLabel?.flag || '🇪🇸'}
        </span>
        <span className="font-bold tracking-wide uppercase text-[11px] text-foreground">
          {activeLocale}
        </span>
        <span className="hidden sm:inline text-xs text-muted-foreground font-normal">
          {currentLabel?.nativeName || 'Español'}
        </span>
        <ChevronDown 
          size={13} 
          className={`text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180 text-foreground' : 'group-hover:text-foreground'}`} 
        />
      </button>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <div
          className={`absolute ${align === 'left' ? 'left-0' : 'right-0'} mt-2 w-72 rounded-2xl bg-white shadow-2xl border border-border/80 py-2 z-50 animate-in fade-in-0 zoom-in-95 duration-150 font-sans`}
          role="menu"
          aria-orientation="vertical"
        >
          {/* Header */}
          <div className="px-4 py-2.5 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe2 size={14} className="text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                {t?.('common.selectLanguage', 'Seleccionar idioma') || 'Seleccionar idioma'}
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border/60">
              {SUPPORTED_LOCALES.length} {t?.('common.languages', 'Idiomas') || 'Idiomas'}
            </span>
          </div>

          {/* Search Input inside dropdown */}
          <div className="p-2.5 border-b border-border/40">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t?.('common.searchLanguages', 'Buscar idioma...') || 'Buscar idioma...'}
                className="w-full h-8.5 pl-8 pr-7 rounded-xl bg-secondary/25 text-xs text-foreground placeholder:text-muted-foreground/70 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black border border-border/60 transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Language Items List */}
          <div className="max-h-72 overflow-y-auto py-1.5 px-1.5 space-y-0.5 scrollbar-thin">
            {filteredLocales.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-muted-foreground italic">
                {t?.('common.noLanguageFound', 'No se encontraron idiomas') || 'No se encontraron idiomas'}
              </div>
            ) : (
              filteredLocales.map((loc) => {
                const info = LOCALE_LABELS[loc];
                const isSelected = loc === activeLocale;
                return (
                  <button
                    key={loc}
                    onClick={() => handleSelectLocale(loc)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-black text-white shadow-xs font-semibold' 
                        : 'text-foreground hover:bg-secondary/60'
                    }`}
                    role="menuitem"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg leading-none shrink-0">{info?.flag}</span>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-xs leading-tight">{info?.nativeName}</p>
                          <span className={`text-[9px] uppercase font-bold tracking-wider px-1 rounded ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-secondary text-muted-foreground'
                          }`}>
                            {loc}
                          </span>
                        </div>
                        <p className={`text-[10px] leading-tight ${isSelected ? 'text-white/80' : 'text-muted-foreground'}`}>
                          {info?.name}
                        </p>
                      </div>
                    </div>
                    {isSelected && <Check size={14} className="text-white shrink-0 ml-2" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
