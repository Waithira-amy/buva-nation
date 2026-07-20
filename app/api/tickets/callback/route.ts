import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL as string });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function POST(req: Request) {
  try {
    const callbackData = await req.json();
    console.log("🚨 BUVA TICKET CALLBACK:", JSON.stringify(callbackData, null, 2));

    const stkCallback = callbackData?.Body?.stkCallback;
    if (!stkCallback) return NextResponse.json({ message: "Invalid payload" }, { status: 400 });

    const checkoutRequestId = stkCallback.CheckoutRequestID;
    const resultCode = stkCallback.ResultCode;

    if (resultCode === 0) {
      const callbackMetadata = stkCallback.CallbackMetadata?.Item || [];
      const receiptItem = callbackMetadata.find((item: any) => item.Name === "MpesaReceiptNumber");
      
      await prisma.ticket.updateMany({
        where: { checkoutRequestId: checkoutRequestId, status: "PENDING" },
        data: { status: "PAID", mpesaReceiptNumber: receiptItem ? receiptItem.Value : null }
      });
    } else {
      await prisma.ticket.updateMany({
        where: { checkoutRequestId: checkoutRequestId, status: "PENDING" },
        data: { status: "FAILED" }
      });
    }

    return NextResponse.json({ message: "Ticket Callback processed" });
  } catch (error) {
    console.error("Critical Ticket Callback Error:", error);
    return NextResponse.json({ message: "Error processing callback" }, { status: 500 });
  }
}