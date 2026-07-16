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
    const { id, oldPin, newPin } = await req.json();
    const nomineeId = parseInt(id);

    if (!newPin || newPin.length < 4) {
      return NextResponse.json({ success: false, message: "New PIN must be at least 4 characters." }, { status: 400 });
    }

    const nominee = await prisma.nominee.findUnique({
      where: { id: nomineeId },
      include: { 
        category: true,
        votes: { where: { status: "SUCCESS" }, orderBy: { createdAt: 'desc' }, take: 10 } 
      }
    });

    if (!nominee || nominee.pinCode !== oldPin) {
      return NextResponse.json({ success: false, message: "Invalid Nominee ID or Old PIN." }, { status: 401 });
    }

    // Update PIN and mark as changed
    await prisma.nominee.update({
      where: { id: nomineeId },
      data: { pinCode: newPin, hasChangedPin: true }
    });

    // Prepare dashboard data to instantly log them in
    const recentVotes = nominee.votes.map(v => {
      const identifier = v.phoneNumber || v.mpesaReceiptNumber || "M-Pesa Voter";
      const masked = identifier.length >= 10 
        ? identifier.substring(0, 4) + "****" + identifier.substring(identifier.length - 3) 
        : identifier;

      return { id: v.id, identifier: masked, votes: v.voteCount, date: v.createdAt };
    });

    return NextResponse.json({
      success: true,
      nominee: {
        name: nominee.name,
        category: nominee.category.name,
        totalVotes: nominee.totalVotes,
        recentVotes
      }
    });

  } catch (error) {
    console.error("Change PIN Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}