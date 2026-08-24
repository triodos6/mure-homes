'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Coins, 
  RefreshCw, 
  Save, 
  Search, 
  CheckCircle2, 
  Globe2, 
  TrendingUp, 
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  Zap,
  Info,
  DollarSign,
  Lock,
  RotateCcw,
  Sparkles,
  ArrowUpRight,
  Percent,
  LayoutGrid,
  List
} from 'lucide-react';
import { toast } from 'sonner';
import { CURRENCY_METADATA, DEFAULT_EXCHANGE_RATES, formatPrice } from '@/lib/currency/currency-service';

export default function AdminCurrenciesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [samplePrice, setSamplePrice] = useState(2500);
  const [viewMode, setViewMode] = useState('table');

  const [settings, setSettings] = useState({
    baseCurrency: 'EUR',
    rates: { ...DEFAULT_EXCHANGE_RATES },
    enabledCurrencies: Object.keys(CURRENCY_METADATA),
    roundingStrategy: 'standard',
    lastUpdated: new Date().toISOString(),
  });

  useEffect(() => {
    fetchCurrencySettings();
  }, []);

  const fetchCurrencySettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/currencies');
      if (!res.ok) throw new Error('Failed to fetch currency settings');
      const data = await res.json();
      if (data.settings) {
        setSettings({
          ...data.settings,
          baseCurrency: 'EUR', // Guarantee Euro is always the base currency
        });
      }
    } catch (error) {
      toast.error('Error loading currency settings');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRateChange = (code, value) => {
    if (code === 'EUR') return; // Base currency cannot be altered
    const numeric = parseFloat(value);
    setSettings(prev => ({
      ...prev,
      rates: {
        ...prev.rates,
        [code]: isNaN(numeric) ? '' : numeric,
      }
    }));
  };

  const adjustRateByPercentage = (code, percent) => {
    if (code === 'EUR') return;
    setSettings(prev => {
      const currentRate = Number(prev.rates[code] ?? CURRENCY_METADATA[code]?.defaultRate ?? 1);
      const newRate = Math.round(currentRate * (1 + percent / 100) * 10000) / 10000;
      return {
        ...prev,
        rates: {
          ...prev.rates,
          [code]: newRate,
        }
      };
    });
    toast.success(`Adjusted ${code} by ${percent > 0 ? '+' : ''}${percent}%`);
  };

  const resetSingleRate = (code) => {
    if (code === 'EUR') return;
    const defaultRate = CURRENCY_METADATA[code]?.defaultRate;
    if (defaultRate) {
      setSettings(prev => ({
        ...prev,
        rates: {
          ...prev.rates,
          [code]: defaultRate,
        }
      }));
      toast.success(`Reset ${code} to ECB standard rate (${defaultRate})`);
    }
  };

  const toggleCurrency = (code) => {
    if (code === 'EUR') {
      toast.error('Base store currency (EUR €) is locked and cannot be disabled.');
      return;
    }
    setSettings(prev => {
      const current = prev.enabledCurrencies || [];
      const updated = current.includes(code)
        ? current.filter(c => c !== code)
        : [...current, code];
      return { ...prev, enabledCurrencies: updated };
    });
  };

  const handleSyncLiveRates = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/currencies/sync', { method: 'POST' });
      if (!res.ok) throw new Error('Sync failed');
      const data = await res.json();
      if (data.rates) {
        setSettings(prev => ({
          ...prev,
          baseCurrency: 'EUR',
          rates: { ...prev.rates, ...data.rates, EUR: 1.0 },
          lastUpdated: data.timestamp || new Date().toISOString(),
        }));
        toast.success('Live exchange rates updated from European Central Bank (ECB) feed');
      }
    } catch (error) {
      toast.error('Failed to sync live exchange rates');
    } finally {
      setSyncing(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const payload = {
        ...settings,
        baseCurrency: 'EUR', // Strict invariant: EUR is always base
      };

      const res = await fetch('/api/currencies', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Save failed');
      toast.success('Global currency matrix & exchange rates saved successfully');
    } catch (error) {
      toast.error('Failed to save currency configuration');
    } finally {
      setSaving(false);
    }
  };

  // Regions list
  const regions = useMemo(() => {
    const set = new Set(Object.values(CURRENCY_METADATA).map(m => m.region));
    return ['all', ...Array.from(set)];
  }, []);

  // Filtered currency list
  const filteredCurrencies = useMemo(() => {
    return Object.entries(CURRENCY_METADATA).filter(([code, meta]) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        code.toLowerCase().includes(q) ||
        meta.name.toLowerCase().includes(q) ||
        meta.symbol.toLowerCase().includes(q);

      const matchesRegion = selectedRegion === 'all' || meta.region === selectedRegion;
      return matchesSearch && matchesRegion;
    });
  }, [searchQuery, selectedRegion]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-28">
      
      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Central Financial Engine
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs font-semibold text-muted-foreground">EUR (€) Base Currency</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mt-1">
            Currencies & Exchange Rates
          </h1>
          <p className="text-xs text-muted-foreground font-light mt-0.5">
            Exchange rate and multi-currency conversion engine.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSyncLiveRates}
            disabled={syncing}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border/80 bg-white text-xs font-semibold text-foreground hover:bg-secondary/60 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw size={14} className={syncing ? 'animate-spin text-emerald-600' : ''} />
            <span>{syncing ? 'Syncing ECB...' : 'Sync Live ECB Rates'}</span>
          </button>

          <button
            type="button"
            onClick={handleSaveSettings}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-black px-8 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-lg hover:shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
          >
            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* ── Top 3 KPI Stat Cards ──────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Card 1: Base Anchor */}
        <div className="p-5 sm:p-6 rounded-2xl border border-border/80 bg-white shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">Base Store Anchor</span>
            <Lock size={15} className="text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <p className="font-serif text-3xl font-bold text-foreground">🇪🇺 EUR (€)</p>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-[10px] font-bold text-emerald-700 uppercase border border-emerald-200">
              Fixed 1.00
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground font-light">
            Base pricing currency for all catalog products
          </p>
        </div>

        {/* Card 2: Active Currencies */}
        <div className="p-5 sm:p-6 rounded-2xl border border-border/80 bg-white shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">Active Currencies</span>
            <Globe2 size={16} className="text-emerald-600" />
          </div>
          <p className="font-serif text-3xl font-bold text-foreground pt-1">
            {settings.enabledCurrencies?.length || 0} / {Object.keys(CURRENCY_METADATA).length}
          </p>
          <p className="text-[11px] text-muted-foreground font-light">
            Active supported currencies
          </p>
        </div>

        {/* Card 3: Synchronization Feed */}
        <div className="p-5 sm:p-6 rounded-2xl border border-border/80 bg-white shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">Exchange Sync Engine</span>
            <Zap size={16} className="text-primary" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-foreground pt-1 truncate">
            ECB Feed
          </p>
          <p className="text-[10px] font-mono text-muted-foreground font-light truncate">
            Last sync: {new Date(settings.lastUpdated).toLocaleDateString()} {new Date(settings.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

      </div>

      {/* ── Live Price Conversion & Simulator Studio ──────────── */}
      <div className="rounded-2xl border border-border/80 bg-white p-6 sm:p-8 shadow-2xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Info */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em]">
                <Lock size={10} className="text-amber-400" />
                <span>Single Source of Truth</span>
              </span>
            </div>

            <h2 className="font-serif text-2xl font-semibold text-foreground tracking-tight">
              Real-Time Multi-Currency Conversion
            </h2>

            <p className="text-xs text-muted-foreground font-light leading-relaxed max-w-xl">
              You only enter a single base price in <strong>EUR (€)</strong> when publishing products. MuraHomes dynamically converts and renders localized currencies with real-time accuracy.
            </p>

            <div className="flex items-center gap-6 pt-1 text-xs">
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>Automated Cart & Checkout Currency</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <ShieldCheck size={14} className="text-primary" />
                <span>Zero Conversion Discrepancies</span>
              </div>
            </div>
          </div>

          {/* Right Live Simulator */}
          <div className="lg:col-span-5 bg-secondary/15 p-5 rounded-2xl border border-border/70 space-y-3.5">
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <div className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Price Conversion Simulator
                </h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                Live Preview
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Test Base Catalog Price (EUR €)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-serif font-bold text-base text-foreground">€</span>
                <input
                  type="number"
                  value={samplePrice}
                  onChange={(e) => setSamplePrice(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full h-11 pl-8 pr-4 rounded-xl border border-border/80 bg-white font-serif font-bold text-base text-foreground focus:border-black focus:outline-none transition-colors"
                  placeholder="2500"
                />
              </div>
            </div>

            {/* Quick Conversion Grid */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {['GBP', 'USD', 'CHF', 'PLN'].map((code) => {
                const meta = CURRENCY_METADATA[code];
                const rate = settings.rates[code] ?? meta.defaultRate;
                const converted = samplePrice * Number(rate);

                return (
                  <div key={code} className="p-2 rounded-xl border border-border/60 bg-white flex items-center justify-between shadow-2xs">
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground">{meta.flag} {code}</span>
                      <p className="font-serif font-bold text-xs text-foreground mt-0.5">
                        {formatPrice(converted, code, 'es')}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground font-semibold">
                      ×{Number(rate).toFixed(3)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* ── Toolbar: Search, Region Filter & View Mode ─────────── */}
      <div className="flex flex-col gap-4 p-4 rounded-2xl border border-border/80 bg-white shadow-2xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text" 
              placeholder="Search by currency code (e.g. GBP, USD, PLN), country, or symbol..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-xl border border-border/80 bg-secondary/15 pl-10 pr-4 text-xs font-medium text-foreground focus:bg-white focus:border-black focus:outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground font-semibold px-3 py-1.5 rounded-xl bg-secondary/40 border border-border/60">
              Showing {filteredCurrencies.length} currencies
            </span>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-secondary/40 p-1 rounded-xl border border-border/60 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'table' ? 'bg-white text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Dense Table View"
              >
                <List size={15} />
                <span className="hidden sm:inline">Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Card Grid View"
              >
                <LayoutGrid size={15} />
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>
          </div>
        </div>

        {/* Region Filter Flex Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/40">
          {regions.map((reg) => {
            const isSelected = selectedRegion === reg;
            return (
              <button
                key={reg}
                type="button"
                onClick={() => setSelectedRegion(reg)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-black text-white border-black shadow-xs'
                    : 'bg-secondary/30 text-muted-foreground border-border/60 hover:bg-secondary hover:text-foreground hover:border-border'
                }`}
              >
                {reg === 'all' ? 'All European & Global Markets' : reg}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Table View Mode ───────────────────────────────────── */}
      {viewMode === 'table' && (
        <div className="rounded-2xl border border-border/80 bg-white shadow-2xs overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-secondary/30">
              <tr>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-muted-foreground">
                  Currency & Market
                </th>
                <th className="px-5 py-4 font-bold uppercase tracking-widest text-[10px] text-muted-foreground hidden md:table-cell">
                  Region & Symbol
                </th>
                <th className="px-5 py-4 font-bold uppercase tracking-widest text-[10px] text-muted-foreground">
                  Exchange Rate (1 EUR =)
                </th>
                <th className="px-5 py-4 font-bold uppercase tracking-widest text-[10px] text-muted-foreground hidden sm:table-cell">
                  Live Preview (€{samplePrice.toLocaleString()})
                </th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-muted-foreground text-right">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredCurrencies.map(([code, meta]) => {
                const isBase = code === 'EUR';
                const isEnabled = isBase || settings.enabledCurrencies?.includes(code);
                const rate = isBase ? 1.0 : (settings.rates?.[code] ?? meta.defaultRate);
                const converted = samplePrice * Number(rate);
                const formattedSample = formatPrice(converted, code, 'es');

                return (
                  <tr 
                    key={code} 
                    className={`group hover:bg-secondary/15 transition-colors ${!isEnabled ? 'opacity-40 bg-secondary/10' : ''}`}
                  >
                    
                    {/* Currency Code, Flag & Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl sm:text-3xl leading-none shrink-0">{meta.flag}</span>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm font-serif text-foreground">{code}</span>
                            {isBase && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black text-[9px] font-bold uppercase tracking-wider text-white shrink-0">
                                <Lock size={9} className="text-amber-400" /> Base
                              </span>
                            )}
                            <span className="md:hidden text-[10px] px-1.5 py-0.5 rounded bg-secondary/50 font-mono font-bold text-muted-foreground">
                              {meta.symbol}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground line-clamp-1">{meta.name}</span>
                        </div>
                      </div>
                    </td>

                    {/* Region & Symbol Badge */}
                    <td className="px-5 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded-lg border border-border/80 bg-white font-mono font-bold text-xs text-foreground shadow-2xs">
                          {meta.symbol}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {meta.region}
                        </span>
                      </div>
                    </td>

                    {/* Exchange Rate Input + Integrated Fine-Tuning */}
                    <td className="px-5 py-4">
                      {isBase ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-mono font-bold shadow-2xs">
                          <Lock size={12} className="text-emerald-700" />
                          <span>1.0000 EUR</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <input
                            type="number"
                            step="any"
                            value={rate}
                            onChange={(e) => handleRateChange(code, e.target.value)}
                            disabled={!isEnabled}
                            className="w-20 sm:w-24 h-9 px-2.5 rounded-lg border border-border/80 bg-secondary/15 text-xs font-mono font-bold text-foreground focus:bg-white focus:border-black focus:outline-none transition-colors"
                          />
                          {isEnabled && (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => adjustRateByPercentage(code, 1)}
                                className="h-8 px-1.5 rounded-lg border border-border/80 bg-white text-[10px] font-bold text-foreground hover:bg-secondary transition-all cursor-pointer"
                                title="Add +1% margin"
                              >
                                +1%
                              </button>
                              <button
                                type="button"
                                onClick={() => adjustRateByPercentage(code, -1)}
                                className="h-8 px-1.5 rounded-lg border border-border/80 bg-white text-[10px] font-bold text-foreground hover:bg-secondary transition-all cursor-pointer"
                                title="Subtract -1% margin"
                              >
                                -1%
                              </button>
                              <button
                                type="button"
                                onClick={() => resetSingleRate(code)}
                                className="h-8 w-7 rounded-lg border border-border/80 bg-white text-muted-foreground hover:text-foreground hover:bg-secondary flex items-center justify-center transition-all cursor-pointer"
                                title="Reset to ECB official rate"
                              >
                                <RotateCcw size={11} />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Live Preview Calculation */}
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <div className="space-y-0.5">
                        <span className="font-serif font-bold text-sm text-foreground block">
                          {formattedSample}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-light">
                          for €{samplePrice.toLocaleString()} EUR
                        </span>
                      </div>
                    </td>

                    {/* Status Toggle Switch */}
                    <td className="px-6 py-4 text-right">
                      {isBase ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                          <CheckCircle2 size={13} />
                          <span>Always Active</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toggleCurrency(code)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isEnabled
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-secondary text-muted-foreground border border-border hover:bg-secondary/70 hover:text-foreground'
                          }`}
                        >
                          {isEnabled ? 'Enabled' : 'Disabled'}
                        </button>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Card Grid View Mode ───────────────────────────────── */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCurrencies.map(([code, meta]) => {
            const isBase = code === 'EUR';
            const isEnabled = isBase || settings.enabledCurrencies?.includes(code);
            const rate = isBase ? 1.0 : (settings.rates?.[code] ?? meta.defaultRate);
            const converted = samplePrice * Number(rate);
            const formattedSample = formatPrice(converted, code, 'es');

            return (
              <div
                key={code}
                className={`p-6 rounded-2xl border bg-white shadow-2xs flex flex-col justify-between space-y-5 transition-all ${
                  isBase
                    ? 'border-black ring-1 ring-black'
                    : isEnabled
                    ? 'border-border/80 hover:border-black/30'
                    : 'border-border/50 opacity-40 bg-secondary/10'
                }`}
              >
                {/* Card Top */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl leading-none">{meta.flag}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-lg text-foreground">{code}</span>
                        <span className="px-2 py-0.5 rounded-md border border-border/80 bg-secondary/20 font-mono font-bold text-xs text-foreground">
                          {meta.symbol}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{meta.name}</p>
                    </div>
                  </div>

                  {isBase ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black text-white text-[9px] font-bold uppercase tracking-wider">
                      <Lock size={9} className="text-amber-400" /> Base
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => toggleCurrency(code)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isEnabled
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-secondary text-muted-foreground border border-border'
                      }`}
                    >
                      {isEnabled ? 'Active' : 'Disabled'}
                    </button>
                  )}
                </div>

                {/* Live Preview Display */}
                <div className="p-3.5 rounded-xl border border-border/60 bg-secondary/15 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Converted Sample Price
                    </span>
                    <p className="font-serif font-bold text-base text-foreground mt-0.5">
                      {formattedSample}
                    </p>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    for €{samplePrice.toLocaleString()} EUR
                  </span>
                </div>

                {/* Exchange Rate Input & Controls */}
                <div className="space-y-2 pt-1 border-t border-border/40">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      1 EUR Rate:
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground">
                      {meta.region}
                    </span>
                  </div>

                  {isBase ? (
                    <div className="h-10 px-3.5 rounded-xl border border-emerald-200 bg-emerald-50 flex items-center justify-between text-xs font-mono font-bold text-emerald-800">
                      <span>1.0000 EUR</span>
                      <span className="text-[10px] uppercase tracking-wider font-bold">Standard Anchor</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="any"
                        value={rate}
                        onChange={(e) => handleRateChange(code, e.target.value)}
                        disabled={!isEnabled}
                        className="flex-1 h-10 px-3.5 rounded-xl border border-border/80 bg-secondary/15 text-xs font-mono font-bold text-foreground focus:bg-white focus:border-black focus:outline-none transition-colors"
                      />
                      {isEnabled && (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => adjustRateByPercentage(code, 1)}
                            className="h-10 px-2 rounded-xl border border-border/80 bg-white text-xs font-bold text-foreground hover:bg-secondary transition-all cursor-pointer"
                          >
                            +1%
                          </button>
                          <button
                            type="button"
                            onClick={() => adjustRateByPercentage(code, -1)}
                            className="h-10 px-2 rounded-xl border border-border/80 bg-white text-xs font-bold text-foreground hover:bg-secondary transition-all cursor-pointer"
                          >
                            -1%
                          </button>
                          <button
                            type="button"
                            onClick={() => resetSingleRate(code)}
                            className="h-10 w-10 rounded-xl border border-border/80 bg-white text-muted-foreground hover:text-foreground hover:bg-secondary flex items-center justify-center transition-all cursor-pointer"
                            title="Reset to ECB official rate"
                          >
                            <RotateCcw size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
