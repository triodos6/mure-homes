import { notFound } from 'next/navigation';
import { SUPPORTED_LOCALES, isValidLocale } from '@/i18n/config';

export function generateStaticParams() {
  // Only non-default locales are under [locale]
  return SUPPORTED_LOCALES.filter((loc) => loc !== 'es').map((locale) => ({
    locale,
  }));
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  return <>{children}</>;
}
