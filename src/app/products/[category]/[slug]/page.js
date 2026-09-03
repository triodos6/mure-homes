import LocalizedPage, { generateMetadata as localizedGenerateMetadata } from '@/app/[locale]/products/[category]/[slug]/page';

export async function generateMetadata({ params }) {
  const resolved = await params;
  return localizedGenerateMetadata({ params: Promise.resolve({ locale: 'es', ...resolved }) });
}

export default async function Page({ params }) {
  const resolved = await params;
  return <LocalizedPage params={Promise.resolve({ locale: 'es', ...resolved })} />;
}
