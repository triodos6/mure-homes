'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useI18n } from '@/context/I18nContext';
import { useMarket } from '@/context/MarketContext';
import { Eye, EyeOff, Loader2, Phone, User, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function SignUpView() {
  const router = useRouter();
  const { setUser } = useAuth();
  const { t, locale, getLocalizedHref } = useI18n();
  const { currency, marketCode } = useMarket();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error(t('auth.passwordsDoNotMatch') || 'Las contraseñas no coinciden');
      return;
    }
    if (form.password.length < 8) {
      toast.error(t('checkout.passwordRequiredError') || 'La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          password: form.password,
          locale: locale || 'es',
          currency: currency || 'EUR',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Error al crear la cuenta');
        return;
      }
      setUser(data);
      toast.success(t('auth.welcomeBack') ? `${t('auth.welcomeBack')}, ${data.firstName}!` : `¡Bienvenido, ${data.firstName}!`);
      window.location.href = getLocalizedHref ? getLocalizedHref('/') : '/';
    } catch {
      toast.error(t('common.error') || 'Algo salió mal');
    } finally {
      setLoading(false);
    }
  };

  const signInHref = getLocalizedHref ? getLocalizedHref('/sign-in') : '/sign-in';

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/20 px-4 py-16">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="bg-black px-8 py-8 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 mb-2">
              {t('navigation.register') || 'Únete a Nosotros'}
            </p>
            <h1 className="font-serif text-3xl text-white font-normal">
              {t('auth.signUpTitle') || 'Crear Cuenta'}
            </h1>
            <p className="text-white/40 text-xs mt-2">
              {t('auth.signUpSubtitle') || 'MuraHomes · Colección de Lujo'}
            </p>
          </div>

          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                    {t('auth.firstName') || 'Nombre'} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      autoFocus
                      value={form.firstName}
                      onChange={set('firstName')}
                      className="w-full h-11 pl-9 pr-3 border border-border rounded-xl text-sm focus:border-black focus:outline-none transition-all bg-white"
                      placeholder="Juan"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                    {t('auth.lastName') || 'Apellido'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.lastName}
                    onChange={set('lastName')}
                    className="w-full h-11 px-3 border border-border rounded-xl text-sm focus:border-black focus:outline-none transition-all bg-white"
                    placeholder="García"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                  {t('auth.email') || 'Email'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={set('email')}
                    className="w-full h-11 pl-9 pr-3 border border-border rounded-xl text-sm focus:border-black focus:outline-none transition-all bg-white"
                    placeholder="tu@ejemplo.com"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                  {t('auth.phone') || 'Número de Teléfono'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={set('phone')}
                    className="w-full h-11 pl-9 pr-3 border border-border rounded-xl text-sm focus:border-black focus:outline-none transition-all bg-white"
                    placeholder="+34 600 000 000"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                  {t('auth.password') || 'Contraseña'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={form.password}
                    onChange={set('password')}
                    className="w-full h-11 pl-9 pr-10 border border-border rounded-xl text-sm focus:border-black focus:outline-none transition-all bg-white"
                    placeholder="Mín. 8 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                  {t('auth.confirmPassword') || 'Confirmar Contraseña'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    required
                    value={form.confirmPassword}
                    onChange={set('confirmPassword')}
                    className="w-full h-11 pl-9 pr-3 border border-border rounded-xl text-sm focus:border-black focus:outline-none transition-all bg-white"
                    placeholder={t('auth.confirmPassword') || 'Repetir contraseña'}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-black text-white rounded-xl text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black/80 transition-all disabled:opacity-50 cursor-pointer shadow-md"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : (t('auth.signUpButton') || 'Crear Cuenta')}
              </button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              {t('auth.haveAccount') || '¿Ya tienes cuenta?'}{' '}
              <Link href={signInHref} className="text-foreground font-medium hover:underline">
                {t('auth.signInButton') || t('navigation.login') || 'Iniciar sesión'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
