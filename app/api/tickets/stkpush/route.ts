import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Set up the Neon connection properly for Vercel
const pool = new Pool({ connectionString: process.env.DATABASE_URL as string });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function POST(req: Request) {
  try {
    const { phoneNumber, amount, ticketType } = await req.json();

    // 1. Get Safaricom Token (Live URL)
    const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');
    const tokenRes = await fetch("https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
      headers: { Authorization: `Basic ${auth}` },
      cache: "no-store"
    });

    if (!tokenRes.ok) {
       console.error("🚨 Safaricom Auth Failed.");
       return NextResponse.json({ success: false, message: "Safaricom Auth Failed. Check Keys." }, { status: 500 });
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 2. Format Phone Number
    let formattedPhone = phoneNumber.replace(/[^0-9]/g, '');
    if (formattedPhone.startsWith('0')) formattedPhone = '254' + formattedPhone.slice(1);
    if (formattedPhone.startsWith('+')) formattedPhone = formattedPhone.slice(1);

    // 3. Generate Timestamp & Password
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString('base64');

    // Callback URL strictly pointing to your live domain
    const callbackUrl = "https://buvanationafrica.co.ke/api/tickets/callback";

    // 4. Send STK Push Request
    const response = await fetch("https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({
            BusinessShortCode: process.env.MPESA_SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerBuyGoodsOnline", // USING TILL NUMBER
            Amount: amount,
            PartyA: formattedPhone,
            PartyB: process.env.MPESA_SHORTCODE,
            PhoneNumber: formattedPhone,
            CallBackURL: callbackUrl,
            AccountReference: "Buva Nation Tickets", 
            TransactionDesc: `YWCA ${ticketType} Ticket`
        })
    });

    const data = await response.json();

    // 5. Save PENDING ticket to Database
    if (data.ResponseCode === "0") {
      const newTicket = await prisma.ticket.create({
        data: { 
          ticketType: ticketType,
          amount: amount, 
          phoneNumber: formattedPhone, 
          checkoutRequestId: data.CheckoutRequestID, 
          status: "PENDING" 
        }
      });
      // Return the newTicket ID so the frontend can redirect to the QR code page
      return NextResponse.json({ success: true, message: "STK Push sent successfully.", ticketId: newTicket.id });
    } else {
      console.error("🚨 Safaricom STK Push Error:", data);
      return NextResponse.json({ success: false, message: data.errorMessage || "Failed to trigger M-Pesa." });
    }
  } catch (error: any) {
    // THIS is the new logging that will show up in Vercel!
    console.error("🚨 CRITICAL STK PUSH ERROR:", error.message, error.stack);
    return NextResponse.json({ 
      success: false, 
      message: "Server error triggering M-Pesa.",
      details: error.message 
    }, { status: 500 });
  }
}