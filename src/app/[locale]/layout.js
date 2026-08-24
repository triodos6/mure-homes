import { notFound } from 'next/navigation';
import { SUPPORTED_LOCALES, isValidLocale } from '@/i18n/config';
import { getMessages } from '@/i18n/get-messages';
import { I18nProvider } from '@/context/I18nContext';
import { MarketProvider } from '@/context/MarketContext';
import { getMarketForLocale } from '@/lib/markets/config';

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

  const messages = await getMessages(locale);
  const market = getMarketForLocale(locale);

  return (
    <I18nProvider locale={locale} messages={messages}>
      <MarketProvider initialMarketCode={market.countryCode}>
        {children}
      </MarketProvider>
    </I18nProvider>
  );
}
