import { DM_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/Providers/ThemeProvider";
import LayoutShell from "@/components/LayoutShell/LayoutShell";
import WhatsAppButton from "@/components/WhatsAppButton/WhatsAppButton";
import { getSession } from "@/lib/auth";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans", weight: ["300", "400", "500", "600"] });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-serif", weight: ["300", "400", "500", "600"], style: ["normal", "italic"] });

export const metadata = {
  title: "MuraHomes | Muebles de Lujo y Diseño de Interiores",
  description: "Curadores de muebles mediterráneos excepcionales y diseño de interiores atemporal.",
};

export default async function RootLayout({ children }) {
  const session = await getSession();
  const dbRole = session?.role || 'USER';
  const serverUserId = session?.userId || null;

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script src="/polyfill-listener.js" async={false} />
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
              n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
              document,'script','https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}');
              fbq('track', 'PageView');
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className={`${dmSans.variable} ${cormorant.variable} antialiased selection:bg-primary selection:text-white`}>
        <AuthProvider>
          <CartProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
              <LayoutShell dbRole={dbRole} serverUserId={serverUserId}>
                {children}
              </LayoutShell>
              <WhatsAppButton />
              <Toaster position="bottom-right" richColors />
            </ThemeProvider>
          </CartProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
