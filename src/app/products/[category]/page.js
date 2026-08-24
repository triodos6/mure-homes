import LocalizedPage, { generateMetadata as localizedGenerateMetadata } from '@/app/[locale]/products/[category]/page';

export function generateMetadata({ params }) {
  return localizedGenerateMetadata({ params: params.then(p => ({ locale: 'es', ...p })) });
}

export default function Page({ params }) {
  return <LocalizedPage params={params.then(p => ({ locale: 'es', ...p }))} />;
}
