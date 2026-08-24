import LocalizedPage, { generateMetadata as localizedGenerateMetadata } from '@/app/[locale]/resenas/page';

export function generateMetadata() {
  return localizedGenerateMetadata({ params: Promise.resolve({ locale: 'es' }) });
}

export default function Page() {
  return <LocalizedPage params={Promise.resolve({ locale: 'es' })} />;
}
