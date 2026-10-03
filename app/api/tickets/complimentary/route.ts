import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { guestName, phoneNumber } = await req.json();

    if (!guestName || !phoneNumber) {
      return NextResponse.json({ success: false, message: "Name and Phone are required." }, { status: 400 });
    }

    // Save the free ticket directly to the database
    const newTicket = await prisma.ticket.create({
      data: {
        ticketType: "COMPLIMENTARY",
        amount: 0,
        phoneNumber: phoneNumber,
        guestName: guestName, 
        status: "PAID", // Auto-approved since it is complimentary
        mpesaReceiptNumber: `COMP-${Date.now()}` // Fake receipt so the unique constraint doesn't break
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Ticket generated successfully",
      ticketId: newTicket.id
    });

  } catch (error) {
    console.error("Complimentary Ticket Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error. Could not generate ticket." },
      { status: 500 }
    );
  }
}