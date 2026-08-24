'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, ArrowRight, RefreshCw, MapPin, Phone, User, Mail, Building2, Hash, CheckCircle2, Package, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { event } from '@/lib/pixel';
import { useAuth } from '@/context/AuthContext';
import { useMarket } from '@/context/MarketContext';
import { useI18n } from '@/context/I18nContext';

export default function CheckoutModal({ open, onClose, cart, cartTotal, onSuccess }) {
  const router = useRouter();
  const { user } = useAuth();
  const { formatPrice, currency, resolvePrice } = useMarket();
  const { t } = useI18n();

  const dynamicCartTotal = cart.reduce((sum, item) => {
    const unitPrice = resolvePrice(item).price || item.price || 0;
    return sum + (unitPrice * item.quantity);
  }, 0);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderRef, setOrderRef] = useState(null);

  useEffect(() => {
    if (open && !orderRef) {
      let saved = {};
      try {
        const stored = localStorage.getItem('mure_checkout_info');
        if (stored) saved = JSON.parse(stored);
      } catch { }

      const fullName = user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : '';
      setForm({
        name: fullName || saved.name || '',
        email: user?.email || saved.email || '',
        phone: user?.phone || saved.phone || '',
        address: saved.address || '',
        city: saved.city || '',
        state: saved.state || '',
        pinCode: saved.pinCode || '',
      });
      event('InitiateCheckout', { value: dynamicCartTotal, currency: currency || 'EUR', num_items: cart.length });
    }
  }, [open, user, orderRef, cartTotal, cart.length, currency, dynamicCartTotal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const updated = { ...prev, [name]: value };
      try {
        localStorage.setItem('mure_checkout_info', JSON.stringify(updated));
      } catch { }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.address || !form.state || !form.pinCode) {
      toast.error(t('checkout.fillRequiredFields') || 'Por favor, completa todos los campos requeridos.');
      return;
    }
    if (!user && !form.password) {
      toast.error(t('checkout.enterPassword') || 'Por favor, crea o introduce tu contraseña para continuar.');
      return;
    }


    setIsSubmitting(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, ...form }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Checkout failed');

      const ref = data.inquiryId || data.id || data.consultationId;
      setIsSubmitting(false);
      setOrderRef(ref ? ref.slice(-8).toUpperCase() : 'ORD-' + Date.now().toString(36).toUpperCase());

      event('Purchase', {
        value: dynamicCartTotal,
        currency: currency || 'EUR',
        content_ids: cart.map(i => i.id),
        num_items: cart.length,
      });
      if (data.accountCreated) {
        event('CompleteRegistration', { status: true });
      }

      onSuccess?.();
    } catch (err) {
      setIsSubmitting(false);
      toast.error(t('checkout.submitError') || 'Error al enviar el pedido', { description: err.message });
    }
  };



  const handleViewOrders = () => {
    setOrderRef(null);
    onClose();
    router.push('/account/orders');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={orderRef ? undefined : onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-300">

        {/* Success Screen */}
        {orderRef ? (
          <div className="flex flex-col items-center justify-center px-8 py-16 text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="relative flex items-center justify-center">
              <div className="h-24 w-24 rounded-full bg-emerald-50 flex items-center justify-center animate-in zoom-in-50 duration-700">
                <CheckCircle2 size={48} className="text-emerald-500" strokeWidth={1.5} />
              </div>
            </div>
            <div className="space-y-4 max-w-md">
              <h2 className="font-serif text-2xl font-medium text-foreground">{t('checkout.orderConfirmed') || '¡Pedido Confirmado!'}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t('checkout.confirmationText') || 'Hemos recibido tu pedido. Te hemos enviado un correo electrónico de confirmación con los detalles.'}
              </p>
            </div>
            <div className="px-5 py-3 bg-secondary/40 rounded-lg text-xs font-mono text-muted-foreground tracking-widest border border-border">
              REF: {orderRef}
            </div>
            <button
              onClick={handleViewOrders}
              className="flex items-center gap-2 mt-4 bg-black text-white px-8 py-3.5 text-xs font-bold uppercase tracking-[0.2em] hover:bg-black/80 transition-all rounded-md"
            >
              <Package size={15} /> {t('checkout.viewMyOrders') || 'Ver Mis Pedidos'}
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="sticky top-0 bg-black text-white px-8 py-6 flex items-center justify-between z-10">
              <div>
                <h2 className="font-serif text-2xl font-medium">{t('checkout.completeOrder') || 'Completar Tu Pedido'}</h2>
                <p className="text-white/50 text-xs uppercase tracking-widest mt-1">{t('checkout.contactAndDelivery') || 'Datos de Entrega y Contacto'}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8">
              {/* Order Summary */}
              <div className="mb-8 p-5 bg-secondary/40 rounded-lg">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">{t('checkout.orderSummary') || 'Resumen del Pedido'}</h3>
                <div className="space-y-2">
                  {cart.map((item) => {
                    const unitPrice = resolvePrice(item).price || item.price || 0;
                    return (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-foreground font-medium">{item.name} <span className="text-muted-foreground font-normal">×{item.quantity}</span></span>
                        <span className="font-medium">{formatPrice(unitPrice * item.quantity)}</span>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-4 pt-4 border-t border-border flex justify-between items-baseline">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">{t('checkout.total') || 'Total'}</span>
                  <span className="font-serif text-xl font-medium">{formatPrice(dynamicCartTotal)}</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Contact Info */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                    <User size={12} />{t('checkout.contactInfo') || 'Información de Contacto'}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
                        {t('checkout.fullName') || 'Nombre Completo'} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          className="w-full h-11 pl-9 pr-3 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all bg-white"
                          placeholder={t('checkout.fullNamePlaceholder') || 'Tu nombre completo'}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          className="w-full h-11 pl-9 pr-3 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all bg-white"
                          placeholder="tu@ejemplo.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
                        {t('checkout.phoneNumber') || 'Número de Teléfono'}
                      </label>
                      <div className="relative">
                        <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          name="phone"
                          type="tel"
                          value={form.phone}
                          onChange={handleChange}
                          className="w-full h-11 pl-9 pr-3 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all bg-white"
                          placeholder="+34 600 000 000"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password — only shown to guest (not logged-in) users */}
                  {!user && (
                    <div className="mt-4">
                      <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
                        {t('checkout.password') || 'Contraseña'} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          name="password"
                          type="password"
                          value={form.password}
                          onChange={handleChange}
                          required
                          minLength={6}
                          className="w-full h-11 pl-9 pr-3 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all bg-white"
                          placeholder={t('checkout.min6Chars') || 'Mínimo 6 caracteres'}
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1.5">
                        {t('checkout.passwordHelp') || 'Si ya tienes cuenta, introduce tu contraseña para iniciar sesión. Si eres nuevo, crearemos tu cuenta automáticamente.'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                    <MapPin size={12} />{t('checkout.deliveryAddress') || 'Dirección de Entrega'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
                        {t('checkout.address') || 'Dirección'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        required
                        className="w-full h-11 px-3 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all bg-white"
                        placeholder={t('checkout.addressPlaceholder') || 'Calle Mayor 123, Piso 4B'}
                      />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
                          {t('checkout.city') || 'Ciudad'}
                        </label>
                        <div className="relative">
                          <Building2 size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <input
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            className="w-full h-11 pl-9 pr-3 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all bg-white"
                            placeholder={t('checkout.city') || 'Ciudad'}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
                          {t('checkout.state') || 'Provincia'} <span className="text-red-500">*</span>
                        </label>
                        <input
                          name="state"
                          value={form.state}
                          onChange={handleChange}
                          required
                          className="w-full h-11 px-3 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all bg-white"
                          placeholder={t('checkout.state') || 'Provincia'}
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
                          {t('checkout.postalCode') || 'Código Postal'} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Hash size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <input
                            name="pinCode"
                            value={form.pinCode}
                            onChange={handleChange}
                            required
                            className="w-full h-11 pl-9 pr-3 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all bg-white"
                            placeholder="28001"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  suppressHydrationWarning
                  className="w-full bg-black text-white h-14 text-xs font-bold uppercase tracking-[0.2em] hover:bg-black/80 transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <RefreshCw size={16} className="animate-spin" />
                      <span>{t('checkout.processing') || 'Procesando...'}</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Lock size={14} />
                      <span>{t('checkout.confirmOrder') || 'Confirmar Pedido'}</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </button>

                {/* Payment trust badges */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <div className="flex items-center gap-1 text-emerald-600">
                    <Lock size={11} />
                    <span className="text-[10px] font-semibold">SSL 256-bit</span>
                  </div>
                  <span className="text-border text-xs">·</span>
                  <div className="h-6 px-2 bg-secondary rounded flex items-center">
                    <span className="font-bold text-[11px] text-[#1A1F71] tracking-wider">VISA</span>
                  </div>
                  <div className="h-6 px-2 bg-secondary rounded flex items-center gap-0.5">
                    <div className="w-4 h-4 rounded-full bg-red-500/70" />
                    <div className="w-4 h-4 rounded-full bg-amber-400/70 -ml-2" />
                  </div>
                  <div className="h-6 px-2 bg-secondary rounded flex items-center">
                    <span className="font-bold text-[11px]"><span className="text-[#009cde]">Pay</span><span className="text-[#003087]">Pal</span></span>
                  </div>
                  {/* <div className="h-6 px-2 bg-[#FFB3C7]/20 rounded flex items-center">
                    <span className="font-bold text-[11px] text-[#17120E]">klarna</span>
                  </div> */}
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
