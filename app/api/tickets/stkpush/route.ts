import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL as string });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function POST(req: Request) {
  try {
    const { phoneNumber, amount, ticketType } = await req.json();

    // 1. Check if Flash Sale is sold out (Limit: 50)
    if (ticketType === "FLASH") {
        const count = await prisma.ticket.count({
           where: { ticketType: "FLASH", status: { in: ["PAID", "SCANNED", "PENDING"] } }
        });
        if (count >= 50) {
           return NextResponse.json({ success: false, message: "Flash Sale tickets are sold out! Please select Advanced Tickets." });
        }
    }

    // 2. Safaricom Auth (Live API)
    const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');
    const tokenRes = await fetch("https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
      headers: { Authorization: `Basic ${auth}` },
      cache: "no-store"
    });
    
    if (!tokenRes.ok) return NextResponse.json({ success: false, message: "Failed to authenticate with Safaricom." });
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 3. Format Phone Number
    let formattedPhone = phoneNumber.replace(/[^0-9]/g, '');
    if (formattedPhone.startsWith('0')) formattedPhone = '254' + formattedPhone.slice(1);
    if (formattedPhone.startsWith('+')) formattedPhone = formattedPhone.slice(1);

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString('base64');

    // 4. Create PENDING ticket
    const newTicket = await prisma.ticket.create({
      data: {
        ticketType: ticketType,
        amount: amount,
        phoneNumber: formattedPhone,
        status: "PENDING"
      }
    });

    const callbackUrl = "https://buvanationafrica.co.ke";

    // 5. Trigger STK Push
    const response = await fetch("https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({
            BusinessShortCode: process.env.MPESA_SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerBuyGoodsOnline", 
            Amount: amount,
            PartyA: formattedPhone,
            PartyB: process.env.MPESA_SHORTCODE, 
            PhoneNumber: formattedPhone,
            CallBackURL: `${callbackUrl}/api/tickets/callback`, 
            AccountReference: "Buva Tickets", 
            TransactionDesc: `Buva ${ticketType} Ticket`
        })
    });

    const data = await response.json();

    if (data.ResponseCode === "0") {
      await prisma.ticket.update({
        where: { id: newTicket.id },
        data: { checkoutRequestId: data.CheckoutRequestID }
      });
      return NextResponse.json({ success: true, ticketId: newTicket.id });
    } else {
      return NextResponse.json({ success: false, message: data.errorMessage || "M-Pesa request rejected." });
    }
  } catch (error) {
    console.error("Ticket STK Push Error:", error);
    return NextResponse.json({ success: false, message: "Server error triggering M-Pesa." }, { status: 500 });
  }
}