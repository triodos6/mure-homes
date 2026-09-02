import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'murahomes_dev_secret_change_in_production');
const COOKIE_NAME = 'auth_token';

const PUBLIC_PATHS = [
  '/',
  '/about',
  '/products',
  '/brands',
  '/showroom',
  '/pedido-online',
  '/resenas',
  '/sign-in',
  '/sign-up',
  '/api/auth/signin',
  '/api/auth/signup',
];

function isPublic(pathname) {
  return PUBLIC_PATHS.some(p =>
    pathname === p ||
    pathname.startsWith(p + '/') ||
    pathname.startsWith('/api/auth/signin') ||
    pathname.startsWith('/api/auth/signup') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/logo')
  );
}

async function getSession(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

import { SUPPORTED_LOCALES } from '@/i18n/config';
import { COUNTRY_TO_LOCALE } from '@/lib/markets/config';

function extractLocale(pathname) {
  for (const loc of SUPPORTED_LOCALES) {
    if (loc === 'es') continue; // Spanish is default without prefix
    if (pathname === `/${loc}`) {
      return { locale: loc, cleanPath: '/' };
    }
    if (pathname.startsWith(`/${loc}/`)) {
      return { locale: loc, cleanPath: pathname.replace(`/${loc}`, '') || '/' };
    }
  }
  return { locale: 'es', cleanPath: pathname };
}

/**
 * Extracts Vercel Geolocation headers according to official specification:
 * https://vercel.com/kb/guide/geo-ip-headers-geolocation-vercel-functions
 * Supports query params (?geo=RO, ?country=DE, ?region=Bavaria, ?city=Munich) & cookie (murahomes_market) for effortless dev testing.
 */
function getVercelGeoHeaders(request) {
  // 1. Query parameter override (?geo=XX or ?country=XX)
  const devGeoOverride = request.nextUrl.searchParams.get('geo') || request.nextUrl.searchParams.get('country');
  const devRegionOverride = request.nextUrl.searchParams.get('region');
  const devCityOverride = request.nextUrl.searchParams.get('city');

  const rawCountry = (
    devGeoOverride ||
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-country') ||
    ''
  ).toUpperCase();

  const country = rawCountry || '';
  const region = devRegionOverride || request.headers.get('x-vercel-ip-country-region') || '';
  const city = devCityOverride || decodeURIComponent(request.headers.get('x-vercel-ip-city') || '');
  const latitude = request.headers.get('x-vercel-ip-latitude') || '';
  const longitude = request.headers.get('x-vercel-ip-longitude') || '';
  const timezone = request.headers.get('x-vercel-ip-timezone') || '';

  return { country, region, city, latitude, longitude, timezone };
}

function detectLocaleFromRequest(request) {
  // 1. Explicit user cookie preference
  const cookieLocale = request.cookies.get('murahomes_locale')?.value;
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) {
    return cookieLocale;
  }

  // 2. Vercel Geo-IP Country Header (x-vercel-ip-country)
  const { country } = getVercelGeoHeaders(request);

  if (country && COUNTRY_TO_LOCALE[country]) {
    return COUNTRY_TO_LOCALE[country];
  }

  // 3. Accept-Language header fallback
  const acceptLang = request.headers.get('accept-language') || '';
  for (const loc of SUPPORTED_LOCALES) {
    if (acceptLang.toLowerCase().includes(loc)) {
      return loc;
    }
  }

  return 'es';
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const { locale, cleanPath } = extractLocale(pathname);
  const geo = getVercelGeoHeaders(request);

  // Automatic Locale Redirection (Skip API routes)
  if (locale === 'es' && !pathname.startsWith('/api/')) {
    const cookieLocale = request.cookies.get('murahomes_locale')?.value;
    if (cookieLocale && cookieLocale !== 'es' && SUPPORTED_LOCALES.includes(cookieLocale)) {
      const redirectUrl = new URL(`/${cookieLocale}${pathname === '/' ? '' : pathname}`, request.url);
      return NextResponse.redirect(redirectUrl);
    }

    if (!cookieLocale) {
      const detectedLocale = detectLocaleFromRequest(request);
      if (detectedLocale !== 'es') {
        const redirectUrl = new URL(`/${detectedLocale}${pathname === '/' ? '' : pathname}`, request.url);
        const response = NextResponse.redirect(redirectUrl);
        response.cookies.set('murahomes_locale', detectedLocale, { path: '/', maxAge: 31536000, sameSite: 'lax' });
        return response;
      }
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);
  requestHeaders.set('x-locale', locale);
  requestHeaders.set('x-clean-pathname', cleanPath);

  // Forward all Vercel Geolocation attributes downstream
  requestHeaders.set('x-country', geo.country);
  requestHeaders.set('x-region', geo.region);
  requestHeaders.set('x-city', geo.city);
  requestHeaders.set('x-latitude', geo.latitude);
  requestHeaders.set('x-longitude', geo.longitude);
  requestHeaders.set('x-timezone', geo.timezone);

  // Admin routes — require ADMIN role (Always un-prefixed)
  if (pathname.startsWith('/admin')) {
    const session = await getSession(request);
    if (!session) return Response.redirect(new URL('/sign-in', request.url));
    if (session.role !== 'ADMIN') return Response.redirect(new URL('/', request.url));
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Account routes — require any authenticated user (both /account and /[locale]/account)
  if (cleanPath.startsWith('/account')) {
    const session = await getSession(request);
    const signInPath = locale === 'es' ? '/sign-in' : `/${locale}/sign-in`;
    if (!session) return Response.redirect(new URL(signInPath, request.url));
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Protected API routes
  if (pathname.startsWith('/api/') && !isPublic(pathname)) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export default proxy;

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
