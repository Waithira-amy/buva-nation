import 'dotenv/config'
import { defineConfig } from '@prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
  seed: 'yarn tsx prisma/seed.ts',
},
  datasource: {
    url: process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL as string, 
  }
})