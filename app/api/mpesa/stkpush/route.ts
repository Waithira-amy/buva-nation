import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { phoneNumber, amount, votes, nomineeName } = await req.json();

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

    // 4. Find Nominee in DB
    const nomineeRecord = await prisma.nominee.findFirst({
        where: { name: { equals: nomineeName, mode: 'insensitive' } }
    });

    if (!nomineeRecord) {
      return NextResponse.json({ success: false, message: "Nominee not found in Database." }, { status: 404 });
    }
    
    // Using the exact variable name from your Vercel screenshot
    const callbackUrl = process.env.MPESA_CALLBACK_URL || "https://buva-nation.vercel.app/api/mpesa/callback";

    // 5. Send STK Push Request
    const response = await fetch("https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({
            BusinessShortCode: process.env.MPESA_SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline", // Ensure this matches your till/paybill type
            Amount: amount,
            PartyA: formattedPhone,
            PartyB: process.env.MPESA_SHORTCODE,
            PhoneNumber: formattedPhone,
            CallBackURL: callbackUrl,
            AccountReference: nomineeRecord.id.toString(), // Connects payment directly to Nominee ID
            TransactionDesc: "YWCA Awards Voting"
        })
    });

    const data = await response.json();

    // 6. Save PENDING vote to Database
    if (data.ResponseCode === "0") {
      await prisma.vote.create({
        data: { 
          amount: amount, 
          voteCount: votes, 
          phoneNumber: formattedPhone, 
          checkoutRequestId: data.CheckoutRequestID, 
          nomineeId: nomineeRecord.id, 
          status: "PENDING" 
        }
      });
      return NextResponse.json({ success: true, message: "STK Push sent successfully." });
    } else {
      console.error("🚨 Safaricom STK Push Error:", data);
      return NextResponse.json({ success: false, message: data.errorMessage || "Failed to trigger M-Pesa." });
    }
  } catch (error) {
    console.error("🚨 Complete STK Push Error:", error);
    return NextResponse.json({ success: false, message: "Server error triggering M-Pesa." }, { status: 500 });
  }
}