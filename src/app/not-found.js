import NotFoundClient from './not-found-client';
import { headers } from 'next/headers';
import { getMessages } from '@/i18n/get-messages';

export async function generateMetadata() {
  let locale = 'es';
  try {
    const headersList = await headers();
    locale = headersList.get('x-locale') || 'es';
  } catch { }
  
  const messages = await getMessages(locale);
  const t = (key) => messages[key.split('.')[0]]?.[key.split('.')[1]];

  return {
    title: t('seo.notFoundTitle') || '404 - Página no encontrada | MuraHomes',
    description: t('seo.notFoundDescription') || 'La página que buscas no está disponible o ha sido movida.',
    alternates: {
      canonical: '/not-found',
    },
  };
}

export default function NotFound() {
  return <NotFoundClient />;
}
