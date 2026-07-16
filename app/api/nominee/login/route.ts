// @ts-nocheck
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function POST(req: Request) {
  try {
    const { id, pinCode } = await req.json();
    const nomineeId = parseInt(id);

    if (isNaN(nomineeId)) {
      return NextResponse.json({ success: false, message: "Invalid Nominee ID format." }, { status: 400 });
    }

    // Fetch nominee and their successful votes
    const nominee = await prisma.nominee.findUnique({
      where: { id: nomineeId },
      include: { 
        category: true,
        votes: { 
          where: { status: "SUCCESS" }, 
          orderBy: { createdAt: 'desc' }, 
          take: 10 // Only grab the 10 most recent for the dashboard
        } 
      }
    });

    if (!nominee || nominee.pinCode !== pinCode) {
      return NextResponse.json({ success: false, message: "Invalid Nominee ID or PIN." }, { status: 401 });
    }

    // If they haven't changed their default PIN, force them to do so
    if (!nominee.hasChangedPin) {
      return NextResponse.json({ success: true, requiresPinChange: true, nomineeId: nominee.id });
    }

    // Mask the phone numbers for privacy (e.g., 2547****123)
    const recentVotes = nominee.votes.map(v => {
      const identifier = v.phoneNumber || v.mpesaReceiptNumber || "M-Pesa Voter";
      const masked = identifier.length >= 10 
        ? identifier.substring(0, 4) + "****" + identifier.substring(identifier.length - 3) 
        : identifier;

      return {
        id: v.id,
        identifier: masked,
        votes: v.voteCount,
        date: v.createdAt
      };
    });

    return NextResponse.json({
      success: true,
      requiresPinChange: false,
      nominee: {
        name: nominee.name,
        category: nominee.category.name,
        totalVotes: nominee.totalVotes,
        recentVotes
      }
    });

  } catch (error) {
    console.error("Nominee Login Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}