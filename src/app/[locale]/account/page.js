import { redirect } from 'next/navigation';

export default async function LocalizedAccountIndexPage({ params }) {
  const { locale } = await params;
  if (locale === 'es') {
    redirect('/account/profile');
  } else {
    redirect(`/${locale}/account/profile`);
  }
}
