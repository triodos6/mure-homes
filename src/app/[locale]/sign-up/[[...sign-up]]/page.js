import SignUpView from '@/components/Auth/SignUpView';
import { getMessages, getMessage } from '@/i18n/get-messages';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const title = getMessage(messages, 'auth.signUpTitle') || 'Sign Up';

  return {
    title: `${title} | MuraHomes`,
    description: getMessage(messages, 'auth.signUpSubtitle') || 'Create your MuraHomes account.',
  };
}

export default function LocalizedSignUpPage() {
  return <SignUpView />;
}
