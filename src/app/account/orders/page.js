'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useI18n } from '@/context/I18nContext';
import { useMarket } from '@/context/MarketContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import AccountHeader from '@/components/Account/AccountHeader';
import {
  Package, Calendar, MapPin, Phone, Mail, FileText,
  Download, Clock, CheckCircle2, XCircle, RefreshCw,
  ChevronDown, ChevronUp, ArrowRight, ShoppingBag, Globe, Coins
} from 'lucide-react';
import { formatPrice as formatCurrencyPrice, LOCALE_FORMAT_MAP } from '@/lib/currency/currency-service';
import { EUROPEAN_COUNTRIES } from '@/lib/markets/config';

const STATUS_STEPS = ['pending', 'contacted', 'completed'];

function getCountryMeta(code) {
  if (!code) return { code: 'ES', name: 'España', flag: '🇪🇸' };
  const match = EUROPEAN_COUNTRIES.find(c => c.code.toUpperCase() === code.toUpperCase());
  return match || { code: code.toUpperCase(), name: code.toUpperCase(), flag: '🌐' };
}

function StatusBadge({ status, t }) {
  const STATUS_CONFIG = {
    pending:   { label: t('account.statusPending') || 'En Revisión',  color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-200', icon: Clock },
    contacted: { label: t('account.statusContacted') || 'En Proceso',   color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200',  icon: Mail },
    completed: { label: t('account.statusCompleted') || 'Completado',   color: 'text-emerald-600',bg: 'bg-emerald-50',border: 'border-emerald-200',icon: CheckCircle2 },
    cancelled: { label: t('account.statusCancelled') || 'Cancelado',    color: 'text-rose-600',   bg: 'bg-rose-50',   border: 'border-rose-200',  icon: XCircle },
  };

  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
      <Icon size={11} />
      {cfg.label}
    </span>
  );
}

function ProgressBar({ status, t }) {
  if (status === 'cancelled') return (
    <div className="flex items-center gap-2 text-rose-500 text-xs font-medium py-1">
      <XCircle size={14} /> {t('account.statusCancelled') || 'Pedido Cancelado'}
    </div>
  );

  const currentStep = STATUS_STEPS.indexOf(status);
  const labels = [
    t('account.stepPlaced') || 'Pedido Realizado',
    t('account.stepProcessing') || 'En Proceso',
    t('account.stepCompleted') || 'Completado',
  ];

  return (
    <div className="flex items-center justify-between sm:justify-start gap-0 py-1">
      {STATUS_STEPS.map((step, i) => {
        const done = i <= currentStep;
        const active = i === currentStep;
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                done ? 'bg-black border-black' : 'bg-white border-border'
              }`}>
                {done
                  ? <CheckCircle2 size={12} className="text-white sm:w-3.5 sm:h-3.5" />
                  : <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-border" />
                }
              </div>
              <span className={`mt-1 sm:mt-1.5 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-center leading-tight whitespace-normal sm:whitespace-nowrap max-w-[75px] sm:max-w-none ${
                active ? 'text-foreground' : done ? 'text-foreground/60' : 'text-muted-foreground'
              }`}>
                {labels[i]}
              </span>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div className={`h-[2px] w-8 xs:w-12 sm:w-20 md:w-24 mx-1 sm:mx-2 mb-4 sm:mb-5 transition-all shrink-0 ${i < currentStep ? 'bg-black' : 'bg-border'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order, t, locale, currentMarketCode, currentCurrency }) {
  const [expanded, setExpanded] = useState(false);
  const ref = `#${order.id.slice(-8).toUpperCase()}`;
  
  // Strict Order Origin Binding: Order always uses its own stored purchase currency and market
  const orderCurrency = (order.currency || 'EUR').toUpperCase();
  const orderMarket = (order.market || order.country || 'ES').toUpperCase();
  const countryMeta = getCountryMeta(orderMarket);
  const items = Array.isArray(order.items) ? order.items : [];

  // Ponytail: Only show regional badge and telemetry if order was made outside the user's current browsing market/currency
  const isOutsideRegion = orderMarket !== (currentMarketCode || 'ES').toUpperCase() || orderCurrency !== (currentCurrency || 'EUR').toUpperCase();

  const fmt = (amount, itemCurrency = null) => {
    return formatCurrencyPrice(amount, itemCurrency || orderCurrency, locale);
  };

  return (
    <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden transition-all">
      {/* Card Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-6 cursor-pointer hover:bg-secondary/5 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex flex-col gap-1.5 sm:gap-1">
          <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2 sm:gap-3">
            <span className="font-serif text-base sm:text-lg font-medium text-foreground">
              {t('account.orderRef') || 'Pedido'} {ref}
            </span>
            <div className="flex items-center gap-2">
              {/* Only show badge if order is from outside the current user region */}
              {isOutsideRegion && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-secondary/80 text-foreground border border-border" title={`${t('account.targetMarket') || 'Región de Compra'}: ${countryMeta.name}`}>
                  <span>{countryMeta.flag}</span>
                  <span>{countryMeta.code}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-amber-700 font-bold">{orderCurrency}</span>
                </span>
              )}
              <StatusBadge status={order.status} t={t} />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-0.5">
            <span className="flex items-center gap-1">
              <Calendar size={11} className="shrink-0" />
              {new Date(order.createdAt).toLocaleDateString(LOCALE_FORMAT_MAP[locale] || 'es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1">
              <Package size={11} className="shrink-0" />
              {items.length} {items.length === 1 ? (t('account.itemSingular') || 'artículo') : (t('account.itemPlural') || 'artículos')}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-border/50 w-full sm:w-auto mt-1 sm:mt-0">
          <div className="text-left sm:text-right">
            <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
              {t('account.orderTotal') || 'Total'}
            </p>
            <p className="font-serif text-lg sm:text-xl font-semibold text-foreground">
              {fmt(order.totalPrice)}
            </p>
          </div>
          <button
            className="p-2 sm:p-2.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground shrink-0 flex items-center gap-1.5 text-xs font-semibold sm:font-normal active:scale-95 touch-manipulation cursor-pointer"
            aria-label={expanded ? (t('account.hideDetails') || 'Ocultar detalles') : (t('account.viewDetails') || 'Ver detalles')}
          >
            <span className="sm:hidden text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
              {expanded ? (t('account.hideDetails') || 'Ocultar') : (t('account.viewDetails') || 'Ver Detalle')}
            </span>
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-border px-4 sm:px-6 pb-5 sm:pb-6 pt-4 sm:pt-5 space-y-5 sm:space-y-6">

          {/* Progress Tracker */}
          <div className="overflow-x-auto no-scrollbar py-1 -mx-1 px-1 sm:mx-0 sm:px-0">
            <ProgressBar status={order.status} t={t} />
          </div>

          <div className="grid lg:grid-cols-3 gap-5 sm:gap-6">
            {/* Items */}
            <div className="lg:col-span-2 space-y-2.5 sm:space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground">
                  {t('account.yourSelection') || 'Tu Selección'}
                </h4>
                {isOutsideRegion && (
                  <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                    {orderCurrency}
                  </span>
                )}
              </div>
              
              {items.map((item, i) => (
                <div key={i} className="flex gap-2.5 sm:gap-3 items-center bg-secondary/30 rounded-xl p-2.5 sm:p-3 border border-border/40">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-secondary shrink-0">
                    {item.images?.[0]
                      ? <Image src={item.images[0]} alt={item.productNameSnapshot || item.name || 'Producto'} width={56} height={56} className="w-full h-full object-cover" unoptimized />
                      : <div className="w-full h-full flex items-center justify-center text-muted-foreground/30"><Package size={16} /></div>
                    }
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-foreground line-clamp-1 sm:line-clamp-none">
                      {item.productNameSnapshot || item.name}
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">
                      {item.brand} &nbsp;·&nbsp; {t('account.qty') || 'Cant.'}: {item.quantity}
                    </p>
                  </div>
                  <p className="font-serif text-xs sm:text-sm font-semibold shrink-0 ml-auto text-foreground">
                    {fmt((item.unitPriceSnapshot || item.price || 0) * item.quantity, item.currency)}
                  </p>
                </div>
              ))}

              {/* Total row */}
              <div className="flex justify-between items-center pt-2 sm:pt-3 border-t border-border">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                  {t('account.orderTotal') || 'Total del Pedido'}
                </span>
                <span className="font-serif text-lg sm:text-xl font-semibold text-foreground">
                  {fmt(order.totalPrice)}
                </span>
              </div>
            </div>

            {/* Right column: Delivery, Telemetry & Invoice */}
            <div className="space-y-4">
              {/* Region & Origin Telemetry — only shown if order was placed outside the user's current browsing region */}
              {isOutsideRegion && (
                <div className="bg-secondary/30 rounded-xl p-3.5 sm:p-4 border border-border/40 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="flex items-center gap-1 font-medium">
                      <Globe size={13} className="text-primary" /> {t('account.targetMarket') || 'Región de Compra'}:
                    </span>
                    <span className="font-bold text-foreground flex items-center gap-1">
                      <span>{countryMeta.flag}</span> {countryMeta.name} ({countryMeta.code})
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground pt-1 border-t border-border/40">
                    <span className="flex items-center gap-1 font-medium">
                      <Coins size={13} className="text-primary" /> {t('account.orderCurrency') || 'Moneda del Pedido'}:
                    </span>
                    <span className="font-bold text-amber-700 font-mono">
                      {orderCurrency}
                    </span>
                  </div>
                </div>
              )}

              {/* Delivery */}
              {order.address && (
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground border-b border-border pb-2 mb-2.5 sm:mb-3">
                    {t('account.deliveryAddress') || 'Dirección de Entrega'}
                  </h4>
                  <div className="bg-secondary/30 rounded-xl p-3.5 sm:p-4 border border-border/40 space-y-2 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex gap-2 items-start">
                      <MapPin size={13} className="text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-foreground font-medium">{order.address}</p>
                        {order.city && <p>{order.city}</p>}
                        <p>{order.state}{order.pinCode ? ` — ${order.pinCode}` : ''}</p>
                      </div>
                    </div>
                    {order.customerPhone && (
                      <div className="flex gap-2 items-center pt-1 border-t border-border/40">
                        <Phone size={13} className="text-primary shrink-0" />
                        <p>{order.customerPhone}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Invoice */}
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground border-b border-border pb-2 mb-2.5 sm:mb-3">
                  {t('account.invoice') || 'Factura'}
                </h4>
                {order.invoiceUrl ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-emerald-600 text-xs font-medium">
                      <CheckCircle2 size={13} className="shrink-0" />
                      {order.invoiceShared ? (t('account.invoiceEmailed') || 'Factura enviada a tu email') : (t('account.invoiceReady') || 'Factura lista')}
                    </div>
                    <a
                      href={order.invoiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full h-11 sm:h-10 bg-black text-white rounded-xl text-xs sm:text-[10px] font-bold uppercase tracking-widest hover:bg-black/80 transition-all active:scale-[0.99] touch-manipulation cursor-pointer"
                    >
                      <Download size={13} /> {t('account.downloadInvoice') || 'Descargar Factura'}
                    </a>
                  </div>
                ) : (
                  <div className="bg-secondary/30 rounded-xl p-3.5 sm:p-4 border border-border/40 text-center">
                    <FileText size={18} className="mx-auto text-muted-foreground/40 mb-1.5" />
                    <p className="text-xs text-muted-foreground">
                      {t('account.invoicePending') || 'La factura se compartirá una vez que tu pedido sea confirmado por nuestro equipo.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Support */}
              <a
                href={`mailto:info@mura-homes.com?subject=Order ${ref}`}
                className="flex items-center justify-center gap-2 w-full h-11 sm:h-10 border border-border bg-white rounded-xl text-xs sm:text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:border-black hover:text-foreground transition-all active:scale-[0.99] touch-manipulation"
              >
                <Mail size={13} /> {t('account.contactSupport') || 'Contactar Soporte'}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const { user, isLoaded } = useAuth();
  const { t, locale, getLocalizedHref } = useI18n();
  const { marketCode, currency } = useMarket();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !user) {
      const signInHref = getLocalizedHref ? getLocalizedHref('/sign-in') : '/sign-in';
      router.push(signInHref);
    }
  }, [isLoaded, user, router, getLocalizedHref]);

  useEffect(() => {
    if (!user) return;
    const controller = new AbortController();
    fetch('/api/orders', { signal: controller.signal })
      .then(r => r.json())
      .then(data => { setOrders(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(err => { if (err.name !== 'AbortError') setLoading(false); });
    return () => controller.abort();
  }, [user]);

  if (!isLoaded || loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f7f4]">
      <RefreshCw size={28} className="animate-spin text-muted-foreground" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f9f7f4]">
      <AccountHeader
        title={t('account.orders') || 'Mis Pedidos'}
        subtitle={user?.firstName ? `${t('account.welcomeUser') || 'Bienvenido de nuevo'}, ${user.firstName}.` : (t('account.subtitle') || 'Rastrea tus pedidos y consulta los detalles a continuación.')}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10">
        {orders.length === 0 ? (
          <div className="py-12 sm:py-24 px-4 flex flex-col items-center justify-center text-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-border flex items-center justify-center shadow-sm">
              <ShoppingBag size={28} className="text-muted-foreground/40 sm:w-8 sm:h-8" />
            </div>
            <div>
              <p className="font-serif text-lg sm:text-xl text-foreground mb-1">
                {t('account.noOrdersTitle') || 'Sin pedidos aún'}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {t('account.noOrdersDesc') || 'Cuando realices un pedido, aparecerá aquí.'}
              </p>
            </div>
            <Link
              href={getLocalizedHref ? getLocalizedHref('/products') : '/products'}
              className="inline-flex items-center gap-2 bg-black text-white px-7 sm:px-8 py-3.5 text-xs sm:text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black/80 transition-all rounded-sm active:scale-[0.99] touch-manipulation"
            >
              {t('account.exploreCollection') || 'Explorar Colección'} <ArrowRight size={13} />
            </Link>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            <p className="text-xs text-muted-foreground font-medium px-1">
              {orders.length} {orders.length === 1 ? (t('account.ordersCountSingular') || 'pedido registrado') : (t('account.ordersCountPlural') || 'pedidos registrados')}
            </p>
            {orders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                t={t} 
                locale={locale} 
                currentMarketCode={marketCode}
                currentCurrency={currency}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
