import SignInView from '@/components/Auth/SignInView';
import { getMessages, getMessage } from '@/i18n/get-messages';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const title = getMessage(messages, 'auth.signInTitle') || 'Sign In';

  return {
    title: `${title} | MuraHomes`,
    description: getMessage(messages, 'auth.signInSubtitle') || 'Access your MuraHomes account.',
  };
}

export default function LocalizedSignInPage() {
  return <SignInView />;
}
