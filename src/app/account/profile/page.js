'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useI18n } from '@/context/I18nContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import AccountHeader from '@/components/Account/AccountHeader';
import {
  User, Mail, Phone, Lock, Camera, Shield,
  RefreshCw, Eye, EyeOff, Package, LogOut, ArrowRight,
  Sparkles, Calendar, Save, KeyRound
} from 'lucide-react';
import { toast } from 'sonner';
import { LOCALE_FORMAT_MAP } from '@/lib/currency/currency-service';

export default function ProfilePage() {
  const { user, isLoaded, refetch, signOut } = useAuth();
  const { t, locale, getLocalizedHref } = useI18n();
  const router = useRouter();
  const fileInputRef = useRef(null);

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Password Form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Stats state
  const [ordersCount, setOrdersCount] = useState(0);

  useEffect(() => {
    if (isLoaded && !user) {
      const signInHref = getLocalizedHref ? getLocalizedHref('/sign-in') : '/sign-in';
      router.push(signInHref);
    }
  }, [isLoaded, user, router, getLocalizedHref]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
      });

      // Fetch orders count for user stats
      fetch('/api/orders')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setOrdersCount(data.length);
        })
        .catch(() => {});
    }
  }, [user]);

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f7f4]">
        <RefreshCw size={28} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Handle Avatar Upload
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('common.error') || 'La imagen no debe superar los 5MB.');
      return;
    }

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'avatars');

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || 'Error al subir la imagen');

      // Update user image in DB
      const updateRes = await fetch('/api/user/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: uploadData.url }),
      });

      if (!updateRes.ok) throw new Error('Error al actualizar la foto de perfil');

      toast.success(t('account.savedSuccess') || 'Foto de perfil actualizada con éxito');
      await refetch();
    } catch (err) {
      toast.error(err.message || 'Error al subir la foto de perfil');
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  // Handle Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);

    try {
      const res = await fetch('/api/user/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al actualizar el perfil');

      toast.success(t('account.savedSuccess') || 'Perfil actualizado correctamente');
      await refetch();
    } catch (err) {
      toast.error(err.message || 'No se pudo actualizar el perfil');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Handle Password Update
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword.length < 6) {
      toast.error(t('checkout.passwordRequiredError') || 'La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error(t('auth.passwordsDoNotMatch') || 'Las contraseñas no coinciden.');
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const res = await fetch('/api/user/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al cambiar la contraseña');

      toast.success(t('account.savedSuccess') || 'Contraseña cambiada correctamente');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.message || 'No se pudo cambiar la contraseña');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Initials generator
  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U';

  const intlLocale = LOCALE_FORMAT_MAP[locale] || 'es-ES';
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(intlLocale, { month: 'long', year: 'numeric' })
    : (t('account.recently') || 'recientemente');

  const ordersHref = getLocalizedHref ? getLocalizedHref('/account/orders') : '/account/orders';

  return (
    <div className="min-h-screen bg-[#f9f7f4] pb-24">
      <AccountHeader
        title={`${t('account.welcomeUser') || 'Bienvenido'}, ${user.firstName || t('account.client') || 'Cliente'}`}
        subtitle={t('account.subtitle') || 'Administra tus datos personales, foto de perfil y seguridad de la cuenta.'}
      />

      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-10 space-y-8">
        
        {/* Profile Card Header */}
        <div className="bg-white rounded-2xl border border-border shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            
            {/* Avatar with Upload */}
            <div className="relative group shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-border bg-secondary flex items-center justify-center shadow-md relative">
                {user.image ? (
                  <Image src={user.image} alt={user.firstName || 'Avatar'} width={112} height={112} className="w-full h-full object-cover" unoptimized />
                ) : (
                  <span className="font-serif text-3xl font-bold text-foreground tracking-widest">{initials}</span>
                )}
                {isUploadingImage && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white">
                    <RefreshCw size={24} className="animate-spin" />
                  </div>
                )}
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImage}
                className="absolute bottom-0 right-0 p-2 bg-black text-white rounded-full shadow-lg hover:bg-black/80 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                title={t('account.profile') || 'Cambiar foto de perfil'}
                aria-label={t('account.profile') || 'Cambiar foto de perfil'}
              >
                <Camera size={14} />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            {/* Main Details */}
            <div className="flex-grow text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-serif text-2xl font-medium text-foreground">
                    {user.firstName ? `${user.firstName} ${user.lastName || ''}` : 'MuraHomes Member'}
                  </h2>
                  <p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
                    <Mail size={13} className="text-primary" />
                    {user.email}
                  </p>
                </div>

                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest self-center sm:self-start border ${
                  user.role === 'ADMIN'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  <Shield size={11} />
                  {user.role === 'ADMIN' ? (t('account.admin') || 'Administrador') : (t('account.registeredClient') || 'Cliente Registrado')}
                </span>
              </div>

              <div className="pt-3 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-muted-foreground border-t border-border/60">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} />
                  {t('account.memberSince') || 'Miembro desde'} <span className="capitalize text-foreground font-medium">{memberSince}</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5">
                  <Package size={13} />
                  <span className="text-foreground font-medium">{ordersCount}</span> {ordersCount === 1 ? (t('account.ordersCountSingular') || 'pedido registrado') : (t('account.ordersCountPlural') || 'pedidos registrados')}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Content Grid: Personal Info & Password */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: Personal Details Form */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Personal Information Card */}
            <div className="bg-white rounded-2xl border border-border shadow-sm p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                <div>
                  <h3 className="font-serif text-xl font-medium text-foreground flex items-center gap-2">
                    <User size={18} className="text-primary" /> {t('account.personalInfo') || 'Información Personal'}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t('account.personalDetailsDesc') || 'Actualiza tu nombre, apellidos y número de contacto.'}
                  </p>
                </div>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-1.5">
                      {t('account.firstName') || 'Nombre'} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                        required
                        placeholder={t('account.firstName') || 'Tu nombre'}
                        className="w-full h-11 pl-10 pr-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-1.5">
                      {t('account.lastName') || 'Apellidos'}
                    </label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                        placeholder={t('account.lastName') || 'Tus apellidos'}
                        className="w-full h-11 pl-10 pr-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-1.5">
                      {t('account.email') || 'Correo Electrónico'}
                    </label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                      <input
                        type="email"
                        value={user.email || ''}
                        disabled
                        className="w-full h-11 pl-10 pr-10 border border-border rounded-xl text-sm bg-secondary/40 text-muted-foreground cursor-not-allowed font-mono"
                      />
                      <Lock size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                    </div>
                    <p className="text-[10px] text-muted-foreground/70 mt-1">
                      {t('account.emailCannotBeChanged') || 'El email no se puede cambiar directamente.'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-1.5">
                      {t('account.phone') || 'Teléfono de Contacto'}
                    </label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        placeholder="+34 600 000 000"
                        className="w-full h-11 pl-10 pr-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="inline-flex items-center gap-2 bg-black text-white px-7 py-3 rounded-xl text-xs font-bold uppercase tracking-[0.15em] hover:bg-black/80 transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {isUpdatingProfile ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>{t('account.saving') || 'Guardando...'}</span>
                      </>
                    ) : (
                      <>
                        <Save size={14} />
                        <span>{t('account.saveChanges') || 'Guardar Cambios'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Security / Password Card */}
            <div className="bg-white rounded-2xl border border-border shadow-sm p-6 sm:p-8">
              <div className="border-b border-border pb-4 mb-6">
                <h3 className="font-serif text-xl font-medium text-foreground flex items-center gap-2">
                  <KeyRound size={18} className="text-primary" /> {t('account.securityTitle') || 'Seguridad y Contraseña'}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t('account.securityDesc') || 'Cambia tu contraseña periódicamente para mantener tu cuenta protegida.'}
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-1.5">
                    {t('account.currentPassword') || 'Contraseña Actual'}
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full h-11 pl-10 pr-10 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all bg-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      {showCurrentPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-1.5">
                      {t('account.newPassword') || 'Nueva Contraseña'}
                    </label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        placeholder="••••••••"
                        className="w-full h-11 pl-10 pr-10 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all bg-white font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-1.5">
                      {t('account.confirmNewPassword') || 'Confirmar Nueva Contraseña'}
                    </label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        placeholder="••••••••"
                        className="w-full h-11 pl-10 pr-10 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isUpdatingPassword || !passwordForm.newPassword}
                    className="inline-flex items-center gap-2 bg-secondary text-foreground hover:bg-secondary/80 border border-border px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-[0.15em] transition-all disabled:opacity-40 cursor-pointer"
                  >
                    {isUpdatingPassword ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>{t('account.updating') || 'Actualizando...'}</span>
                      </>
                    ) : (
                      <>
                        <KeyRound size={14} />
                        <span>{t('account.changePassword') || 'Cambiar Contraseña'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

          </div>

          {/* Right Col: Shortcuts & Support */}
          <div className="space-y-6">
            
            {/* Quick Orders Card */}
            <div className="bg-white rounded-2xl border border-border shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-3 border-b border-border pb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Package size={20} />
                </div>
                <div>
                  <h4 className="font-serif text-base font-medium">{t('account.orders') || 'Mis Pedidos'}</h4>
                  <p className="text-xs text-muted-foreground">{ordersCount} {ordersCount === 1 ? (t('account.ordersCountSingular') || 'pedido registrado') : (t('account.ordersCountPlural') || 'pedidos registrados')}</p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {t('account.subtitle') || 'Rastrea el estado de tus compras, consulta el historial de envíos y descarga tus facturas oficiales.'}
              </p>

              <Link
                href={ordersHref}
                className="flex items-center justify-center gap-2 w-full py-3 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black/80 transition-all cursor-pointer shadow-md"
              >
                {t('account.viewOrders') || t('account.orders') || 'Ver Mis Pedidos'} <ArrowRight size={14} />
              </Link>
            </div>

            {/* Concierge Support Card */}
            <div className="bg-gradient-to-br from-secondary/40 to-secondary/10 rounded-2xl border border-border p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                <Sparkles size={14} /> {t('account.exclusiveSupport') || 'Atención Exclusiva'}
              </div>

              <h4 className="font-serif text-lg font-medium text-foreground">
                {t('account.exclusiveSupportDesc') || '¿Necesitas ayuda con tu pedido o proyecto de interiorismo?'}
              </h4>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {t('checkout.subtitle') || 'Nuestro equipo de asesores está disponible para resolver cualquier consulta sobre tus piezas de diseño.'}
              </p>

              <div className="pt-2 space-y-2">
                <a
                  href="mailto:info@mura-homes.com"
                  className="flex items-center gap-2 text-xs font-medium text-foreground hover:text-primary transition-colors"
                >
                  <Mail size={14} /> info@mura-homes.com
                </a>
                <a
                  href="tel:+34627080811"
                  className="flex items-center gap-2 text-xs font-medium text-foreground hover:text-primary transition-colors"
                >
                  <Phone size={14} /> +34 627 080 811
                </a>
              </div>
            </div>

            {/* Sign Out Action */}
            <div className="bg-white rounded-2xl border border-rose-100 p-6 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-rose-700 flex items-center gap-2">
                <LogOut size={14} /> {t('account.sessionTitle') || 'Sesión de Usuario'}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t('account.sessionDesc') || '¿Deseas salir de tu cuenta en este dispositivo?'}
              </p>
              <button
                onClick={signOut}
                className="w-full flex items-center justify-center gap-2 py-3 border border-rose-200 text-rose-600 bg-rose-50/50 hover:bg-rose-100/70 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
              >
                <LogOut size={14} /> {t('account.logout') || t('navigation.logout') || 'Cerrar Sesión'}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
