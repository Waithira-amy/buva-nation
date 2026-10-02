import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- UPDATING COMMUNITY CULTURE NOMINEES ---');

  // 1. Remove Amanda and Shirley safely
  const nomineesToRemove = ["Amanda Jennifer Shahonya", "Shirley Valarie Achieng"];
  
  for (const name of nomineesToRemove) {
    const nominee = await prisma.nominee.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } }
    });

    if (nominee) {
      // Delete their votes first to prevent foreign key constraint errors
      await prisma.vote.deleteMany({
        where: { nomineeId: nominee.id }
      });
      // Delete the nominee
      await prisma.nominee.delete({
        where: { id: nominee.id }
      });
      console.log(`🗑️ Successfully removed "${name}" and all associated votes.`);
    } else {
      console.log(`⚠️ "${name}" not found in database, skipping removal.`);
    }
  }

  // 2. Add Margaret Nduta
  const missCat = await prisma.category.findFirst({
    where: { name: { contains: 'Miss Community Culture', mode: 'insensitive' } }
  });

  if (missCat) {
    const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
    
    await prisma.nominee.upsert({
      where: { slug: 'margaret-nduta' },
      update: { categoryId: missCat.id },
      create: {
        name: 'Margaret Nduta',
        slug: 'margaret-nduta',
        categoryId: missCat.id,
        pinCode: randomPin
      }
    });
    console.log(`✅ Successfully added "Margaret Nduta" to the "Miss Community Culture" category. Her PIN is: ${randomPin}`);
  } else {
    console.log(`❌ Error: Could not find "Miss Community Culture" category to add Margaret.`);
  }

  console.log('\n--- UPDATE COMPLETE ---');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());