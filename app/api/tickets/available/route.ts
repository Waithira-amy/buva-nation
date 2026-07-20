import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL as string });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const flashSold = await prisma.ticket.count({
      where: {
        ticketType: "FLASH",
        status: { in: ["PAID", "SCANNED", "PENDING"] }
      }
    });
    
    return NextResponse.json({ flashSold });
  } catch (error) {
    console.error("Error fetching ticket stats:", error);
    return NextResponse.json({ flashSold: 50 }); // Fallback to prevent overselling on error
  }
}