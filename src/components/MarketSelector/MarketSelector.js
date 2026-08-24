'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MARKETS } from '@/lib/markets/config';
import { useMarket } from '@/context/MarketContext';
import { MapPin, ChevronDown, Check } from 'lucide-react';

export default function MarketSelector({ className = '', align = 'right' }) {
  const { market, marketCode, setMarketCode } = useMarket();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectMarket = (code) => {
    setMarketCode(code);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-secondary/60 transition-colors border border-border/60 focus:outline-none focus:ring-1 focus:ring-primary"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Seleccionar mercado / Select country and currency"
      >
        <MapPin size={13} className="text-muted-foreground" />
        <span className="text-xs uppercase font-bold tracking-wider">{market.countryCode}</span>
        <span className="text-xs text-muted-foreground font-normal">({market.currency})</span>
        <ChevronDown size={12} className={`text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className={`absolute ${align === 'left' ? 'left-0' : 'right-0'} mt-1.5 w-52 rounded-xl bg-white/95 backdrop-blur-md shadow-xl border border-border/80 py-1 z-50 animate-in fade-in-0 zoom-in-95 duration-150`}
          role="menu"
        >
          <div className="px-3 py-1.5 border-b border-border/50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Destino / Market & Currency
          </div>
          {Object.values(MARKETS).map((m) => {
            const isSelected = m.countryCode === marketCode;
            return (
              <button
                key={m.countryCode}
                onClick={() => handleSelectMarket(m.countryCode)}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-secondary/70 transition-colors ${
                  isSelected ? 'font-semibold text-primary bg-secondary/30' : 'text-foreground'
                }`}
                role="menuitem"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">{m.name}</span>
                  <span className="text-[10px] text-muted-foreground">
                    Moneda: {m.currency} · Entrega {m.delivery.minDays}–{m.delivery.maxDays}d
                  </span>
                </div>
                {isSelected && <Check size={14} className="text-primary shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
