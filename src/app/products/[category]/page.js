import LocalizedPage, { generateMetadata as localizedGenerateMetadata } from '@/app/[locale]/products/[category]/page';
import { categories } from '@/data/products';

export const revalidate = 3600;

export async function generateStaticParams() {
  return categories.map((c) => ({
    category: c.id,
  }));
}

export async function generateMetadata({ params }) {
  const resolved = await params;
  return localizedGenerateMetadata({ params: Promise.resolve({ locale: 'es', ...resolved }) });
}

export default async function Page({ params }) {
  const resolved = await params;
  return <LocalizedPage params={Promise.resolve({ locale: 'es', ...resolved })} />;
}
