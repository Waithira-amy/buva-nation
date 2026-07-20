import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Setup database connection via the pg adapter (Prisma 7 strict requirement)
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const categoriesData = [
  {
    name: "Mr YWCA Nairobi Branch",
    nominees: [
      "Stanley Stanix Ochieng",
      "David Mbugua",
      "Simon Benedict Nyamwange",
      "Ronny Tonny",
      "Benson Barack",
      "Fadhili Amanda"
    ]
  },
  {
    name: "Miss YWCA Nairobi Branch",
    nominees: [
      "Kuria Nancy Njambi",
      "Ivon Njoki",
      "Anne Wangeci",
      "Darlin Imani",
      "Phoebe Kyalo",
      "Grace Wambui Mungai",
      "Dollar Mesaid Sharp",
      "Shirley Valarie Achieng",
      "Abigail Beline Otieno",
      "Christine Joy Mwangi",
      "Christine Awino Ojuka",
      "Muthoni Fidelis Nyambura",
      "Leonora Oloo",
      "Joan Wanjiru Njeri",
      "Mary Njoki Muchiri",
      "Lisha Sophie",
      "Amanda Jennifer Shahonya",
      "Valencia Mwaniga"
    ]
  }
];

async function main() {
  console.log('--- STARTING SEEDING PHASE ---');

  for (const cat of categoriesData) {
    const categorySlug = cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // 1. Create or update the Category
    const category = await prisma.category.upsert({
      where: { slug: categorySlug },
      update: {},
      create: {
        name: cat.name,
        slug: categorySlug,
      }
    });

    // 2. Create or update each Nominee within the Category
    for (const nomineeName of cat.nominees) {
      const nomineeSlug = nomineeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const randomPin = Math.floor(1000 + Math.random() * 9000).toString();

      await prisma.nominee.upsert({
        where: { slug: nomineeSlug },
        update: { categoryId: category.id }, // Ensures they belong to the right category
        create: {
          name: nomineeName,
          slug: nomineeSlug,
          categoryId: category.id,
          pinCode: randomPin
        }
      });
      
      console.log(`Added: ${nomineeName} -> PIN: ${randomPin}`);
    }
    
    console.log(`✅ Synced category: ${category.name} with ${cat.nominees.length} nominees.`);
  }

  console.log('\n🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });