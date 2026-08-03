import { categories } from '@/data/products';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mura-homes.com';

export async function GET() {
  const content = `# MuraHomes

> MuraHomes es una tienda de muebles de lujo y diseño de interiores contemporáneo con herencia mediterránea desde 2005.

## Core Sections

- [Inicio](${SITE_URL}/): Página principal con colecciones destacadas, productos populares y marcas asociadas.
- [Nosotros](${SITE_URL}/about): Herencia mediterránea, artesanía de lujo, valores de diseño y trayectoria desde 2005.
- [Productos & Colecciones](${SITE_URL}/products): Catálogo completo de mobiliario de lujo para el hogar.
- [Nuestras Marcas](${SITE_URL}/brands): Fabricantes y casas de diseño prestigiosas asociadas.
- [Pedido Online](${SITE_URL}/pedido-online): Guía paso a paso para realizar pedidos online y envíos a toda España.
- [Showroom](${SITE_URL}/showroom): Visita nuestro showroom de 929 m² en Usurbil, Gipuzkoa y reserva consultas privadas.
- [Reseñas](${SITE_URL}/resenas): Opiniones e historias verificadas de clientes.

## Categories

${categories.map(cat => `- [${cat.name}](${SITE_URL}/products/${cat.id}): ${cat.description}`).join('\n')}

## Contact & Location

- Dirección: Bo. Txiki-Erdi, 7, 20170 Usurbil, Gipuzkoa, España.
- Teléfono / WhatsApp: +34 627 080 811
- Email: info@mura-homes.com
- Horario: Lunes a Sábado: 10:00 – 20:00

## Technical & AI Resources

- [Sitemap](${SITE_URL}/sitemap.xml): Mapa del sitio XML dinámico.
- [Robots.txt](${SITE_URL}/robots.txt): Directivas para crawlers.
`;

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate',
    },
  });
}
