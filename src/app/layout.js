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

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mura-homes.com';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "MuraHomes | Compra Muebles Online y Decoración de Diseño",
  description:
    "Compra muebles online en MuraHomes: sofás, sillones, mesas, sillas, dormitorios, armarios e iluminación. Descubre muebles de diseño y decoración para cada espacio.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MuraHomes | Compra Muebles Online y Decoración de Diseño",
    description:
      "Compra muebles online en MuraHomes: sofás, sillones, mesas, sillas, dormitorios, armarios e iluminación. Descubre muebles de diseño y decoración para cada espacio.",
    url: SITE_URL,
    siteName: "MuraHomes",
    type: "website",
  },
  verification: {
    google: "SM6VBtUlw2UgwgEEspqi4fnRFd2WjB3_p9M1TwNVYmw",
  },
};

export default async function RootLayout({ children }) {
  const session = await getSession();
  const dbRole = session?.role || "USER";
  const serverUserId = session?.userId || null;

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MuraHomes',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://mura-homes.com',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mura-homes.com'}/images/logo.png`,
    description: 'Curadores de muebles mediterráneos excepcionales y diseño de interiores atemporal.',
    telephone: '+34627080811',
    email: 'info@mura-homes.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Bo. Txiki-Erdi, 7',
      addressLocality: 'Usurbil',
      addressRegion: 'Gipuzkoa',
      postalCode: '20170',
      addressCountry: 'ES',
    },
    sameAs: [],
  };

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <Script
          id="org-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${dmSans.variable} ${cormorant.variable} antialiased selection:bg-primary selection:text-white`}
      >
        {/* Next.js Scripts belong here in <body>, not inside <head> */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RBMPMTNQNX"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-RBMPMTNQNX');
            `,
          }}
        />

        <Script src="/polyfill-listener.js" strategy="beforeInteractive" />

        {process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID && (
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
        )}

        <Script
          id="tiktok-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
                ttq.load('D885INBC77UDG683DQ9G');
                ttq.page();
              }(window, document, 'ttq');
            `,
          }}
        />

        <AuthProvider>
          <CartProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <LayoutShell dbRole={dbRole} serverUserId={serverUserId}>
                {children}
                <Analytics />
              </LayoutShell>
              <WhatsAppButton />
              <Toaster position="bottom-right" richColors />
            </ThemeProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}