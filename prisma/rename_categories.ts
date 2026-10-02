import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- RENAMING CATEGORIES & ADDING MARGARET ---');

  // 1. Rename "Mr YWCA Nairobi Branch" to "Mr Community Culture"
  const mrYwca = await prisma.category.findFirst({
    where: { name: { contains: 'Mr YWCA', mode: 'insensitive' } }
  });

  if (mrYwca) {
    await prisma.category.update({
      where: { id: mrYwca.id },
      data: { name: 'Mr Community Culture', slug: 'mr-community-culture' }
    });
    console.log('✅ Successfully renamed "Mr YWCA Nairobi Branch" to "Mr Community Culture"');
  } else {
    console.log('⚠️ "Mr YWCA" not found (it might already be renamed).');
  }

  // 2. Rename "Miss YWCA Nairobi Branch" to "Miss Community Culture"
  const missYwca = await prisma.category.findFirst({
    where: { name: { contains: 'Miss YWCA', mode: 'insensitive' } }
  });

  let missCatId = null;

  if (missYwca) {
    const updatedMiss = await prisma.category.update({
      where: { id: missYwca.id },
      data: { name: 'Miss Community Culture', slug: 'miss-community-culture' }
    });
    missCatId = updatedMiss.id;
    console.log('✅ Successfully renamed "Miss YWCA Nairobi Branch" to "Miss Community Culture"');
  } else {
    // Fallback just in case it was already renamed
    const existing = await prisma.category.findFirst({
      where: { name: { contains: 'Miss Community Culture', mode: 'insensitive' } }
    });
    if (existing) {
        missCatId = existing.id;
    }
  }

  // 3. Now that the category is renamed, add Margaret!
  if (missCatId) {
    const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
    
    await prisma.nominee.upsert({
      where: { slug: 'margaret-nduta' },
      update: { categoryId: missCatId },
      create: {
        name: 'Margaret Nduta',
        slug: 'margaret-nduta',
        categoryId: missCatId,
        pinCode: randomPin
      }
    });
    console.log(`✅ Successfully added "Margaret Nduta" to the database. Her PIN is: ${randomPin}`);
  } else {
    console.log(`❌ Error: Could not find the category to add Margaret.`);
  }

  console.log('\n--- UPDATE COMPLETE ---');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());