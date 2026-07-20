import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// FIX 1: Bypass Node.js SSL Certificate Error for Safaricom Local Testing
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const connectionString = `${process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function POST(req: Request) {
  try {
    const { phoneNumber, amount, ticketType } = await req.json();

    // 1. Get Safaricom Token
    const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');
    const tokenRes = await fetch("https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
      headers: { Authorization: `Basic ${auth}` },
      cache: "no-store"
    });
    
    if (!tokenRes.ok) {
        console.error("Safaricom Auth Failed");
        return NextResponse.json({ success: false, message: "Failed to authenticate with Safaricom." });
    }
    
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 2. Format Phone Number
    let formattedPhone = phoneNumber.replace(/[^0-9]/g, '');
    if (formattedPhone.startsWith('0')) formattedPhone = '254' + formattedPhone.slice(1);
    if (formattedPhone.startsWith('+')) formattedPhone = formattedPhone.slice(1);

    // 3. Safaricom Passwords
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString('base64');

    // 4. Create PENDING ticket in Database FIRST (Exact MTA Logic)
    const newTicket = await prisma.ticket.create({
      data: {
        ticketType: ticketType,
        amount: amount,
        phoneNumber: formattedPhone,
        status: "PENDING"
      }
    });

    // 🚨 CRITICAL FIX: Hardcoded domain for Buva Nation
    const callbackUrl = "https://buvanationafrica.co.ke";

    // 5. Trigger STK Push (UPDATED FOR TILL NUMBER: CustomerBuyGoodsOnline)
    const response = await fetch("https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({
            BusinessShortCode: process.env.MPESA_SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerBuyGoodsOnline", // Fixed for Till Number
            Amount: amount,
            PartyA: formattedPhone,
            // Fallback to shortcode if TILL_NUMBER isn't set in Vercel
            PartyB: process.env.MPESA_TILL_NUMBER || process.env.MPESA_SHORTCODE, 
            PhoneNumber: formattedPhone,
            CallBackURL: `${callbackUrl}/api/tickets/callback`, 
            AccountReference: "Buva Nation Tickets", 
            TransactionDesc: `YWCA ${ticketType} Ticket`
        })
    });

    const data = await response.json();

    // 6. Process Safaricom Response
    if (data.ResponseCode === "0") {
      await prisma.ticket.update({
        where: { id: newTicket.id },
        data: { checkoutRequestId: data.CheckoutRequestID }
      });
      return NextResponse.json({ success: true, ticketId: newTicket.id });
    } else {
      console.error("Safaricom Error:", data);
      return NextResponse.json({ success: false, message: data.errorMessage || "M-Pesa request rejected." });
    }
  } catch (error: any) {
    console.error("Ticket STK Push Error:", error.message, error.stack);
    return NextResponse.json({ success: false, message: "Server error triggering M-Pesa." }, { status: 500 });
  }
}