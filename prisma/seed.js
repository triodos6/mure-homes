import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import { brandsData, rawProducts, buildProductTranslations, SUPPORTED_LOCALES } from './seed-data.js';

const prisma = new PrismaClient();

async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🏛️  MURAHOMES PAN-EUROPEAN CATALOG SYNCHRONIZER (22 LOCALES)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`ℹ️  Supported Locales (${SUPPORTED_LOCALES.length}): ${SUPPORTED_LOCALES.join(', ')}`);
  console.log(`🛡️  Safe Mode: NON-DESTRUCTIVE UPSERT (Existing records preserved, zero data reset)\n`);

  // 1. Synchronize Artisan Brands
  console.log(`▶ 1/2 Synchronizing ${brandsData.length} Artisan Brands with 22-language translations...`);
  let brandCount = 0;
  for (const b of brandsData) {
    await prisma.brand.upsert({
      where: { slug: b.slug },
      update: {
        name: b.name,
        description: b.description,
        logo: b.logo,
        translations: b.translations,
      },
      create: {
        slug: b.slug,
        name: b.name,
        description: b.description,
        logo: b.logo,
        translations: b.translations,
      },
    });
    brandCount++;
    console.log(`  ✓ [Brand] ${b.name} (${b.slug}) -> Synced across ${Object.keys(b.translations).length} languages`);
  }
  console.log(`✨ Brands Synced: ${brandCount}/${brandsData.length}\n`);

  // 2. Synchronize Master Products
  console.log(`▶ 2/2 Synchronizing ${rawProducts.length} Products with 22-language matrix & multi-currency pricing...`);
  let productCount = 0;
  for (const item of rawProducts) {
    const { translations, marketPrices } = buildProductTranslations(item);

    await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        category: item.category,
        price: parseFloat(item.price),
        marketPrices: marketPrices,
        brand: item.brand,
        description: item.description,
        dimensions: item.dimensions || null,
        materials: item.materials || [],
        images: item.images || [],
        thumbnail: item.images?.[0] || null,
        featured: Boolean(item.featured),
        status: 'active',
        translations: translations,
      },
      create: {
        slug: item.slug,
        name: item.name,
        category: item.category,
        price: parseFloat(item.price),
        marketPrices: marketPrices,
        brand: item.brand,
        description: item.description,
        dimensions: item.dimensions || null,
        materials: item.materials || [],
        images: item.images || [],
        thumbnail: item.images?.[0] || null,
        featured: Boolean(item.featured),
        status: 'active',
        translations: translations,
      },
    });
    productCount++;
    console.log(`  ✓ [Product] ${item.name} (€${item.price.toLocaleString()}) -> Synced across 22 locales & 12 currencies`);
  }
  console.log(`✨ Products Synced: ${productCount}/${rawProducts.length}\n`);

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
  console.log(`   • ${brandCount} Brands with 22-language translation dictionaries`);
  console.log(`   • ${productCount} Master Products with 22-language matrices & multi-currency pricing`);
  console.log('   • 0 Database wipes / Existing custom data fully preserved');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
