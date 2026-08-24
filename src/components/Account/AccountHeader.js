'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Package, Shield, ExternalLink } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useI18n } from '@/context/I18nContext';

export default function AccountHeader({ title, subtitle }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { t, getLocalizedHref } = useI18n();

  const tabs = [
    { label: t('account.profile') || 'Mi Perfil', href: '/account/profile', icon: User },
    { label: t('account.orders') || 'Mis Pedidos', href: '/account/orders', icon: Package },
  ];

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : user?.email || (t('common.client') || 'Cliente');

  return (
    <div className="bg-white border-b border-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 pt-6 sm:pt-10 pb-0">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 pb-6 sm:pb-8">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <div className="h-px w-8 bg-black/30" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                {t('account.title') || 'Mi Cuenta'}
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium text-foreground">
              {title || `${t('account.hello') || 'Hola'}, ${displayName}`}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {subtitle || (t('account.subtitle') || 'Gestiona tu información personal, seguridad y pedidos.')}
            </p>
          </div>

          {user?.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-secondary/80 hover:bg-secondary text-foreground text-xs font-semibold rounded-lg transition-colors border border-border shrink-0 self-start md:self-auto"
            >
              <Shield size={14} className="text-amber-600" />
              <span>{t('navigation.admin') || 'Panel Admin'}</span>
              <ExternalLink size={12} className="text-muted-foreground" />
            </Link>
          )}
        </div>

        {/* Account Tabs Navigation */}
        <div className="flex items-center gap-1.5 sm:gap-2 border-b border-transparent -mb-px overflow-x-auto no-scrollbar pb-0.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const localizedPath = getLocalizedHref(tab.href);
            const isActive = pathname === localizedPath || pathname === tab.href || (tab.href === '/account/profile' && (pathname === '/account' || pathname === getLocalizedHref('/account')));
            return (
              <Link
                key={tab.href}
                href={localizedPath}
                className={`flex items-center gap-2 px-3.5 sm:px-5 py-3 sm:py-3.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'border-black text-foreground bg-secondary/30 rounded-t-xl'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/10 rounded-t-xl'
                }`}
              >
                <Icon size={15} className={isActive ? 'text-black' : 'text-muted-foreground'} />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
