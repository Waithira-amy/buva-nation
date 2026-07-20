import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL as string });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    const ticket = await prisma.ticket.findUnique({ where: { id } });

    if (!ticket) return NextResponse.json({ success: false, message: "Ticket not found in database." });
    if (ticket.status === "SCANNED") return NextResponse.json({ success: false, message: "INVALID: Ticket has already been used!" });
    if (ticket.status !== "PAID") return NextResponse.json({ success: false, message: "INVALID: Ticket is unpaid or pending." });

    // Mark as scanned to prevent double entry
    await prisma.ticket.update({
      where: { id },
      data: { status: "SCANNED" }
    });

    return NextResponse.json({ success: true, message: `VALID: Admittance Granted (${ticket.ticketType})` });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error during validation." }, { status: 500 });
  }
}