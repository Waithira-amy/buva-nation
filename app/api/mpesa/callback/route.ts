import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const callbackData = await req.json();
    console.log("🚨 SAFARICOM CALLBACK RESULT:", JSON.stringify(callbackData, null, 2));

    const stkCallback = callbackData?.Body?.stkCallback;

    if (!stkCallback) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const checkoutRequestId = stkCallback.CheckoutRequestID;
    const resultCode = stkCallback.ResultCode;

    // ResultCode 0 means the payment was a success
    if (resultCode === 0) {
      const callbackMetadata = stkCallback.CallbackMetadata?.Item || [];
      const receiptItem = callbackMetadata.find((item: any) => item.Name === "MpesaReceiptNumber");
      const mpesaReceiptNumber = receiptItem ? receiptItem.Value : null;

      // Find the pending vote ticket
      const pendingVote = await prisma.vote.findUnique({ 
        where: { checkoutRequestId: checkoutRequestId } 
      });

      if (pendingVote && pendingVote.status === "PENDING") {
        // 1. Mark vote as SUCCESS
        await prisma.vote.update({
          where: { id: pendingVote.id },
          data: { status: "SUCCESS", mpesaReceiptNumber: mpesaReceiptNumber }
        });

        // 2. Increment Nominee's total votes
        await prisma.nominee.update({
          where: { id: pendingVote.nomineeId },
          data: { totalVotes: { increment: pendingVote.voteCount } }
        });
      }
    } else {
      // Payment failed or was cancelled by user
      await prisma.vote.updateMany({
        where: { checkoutRequestId: checkoutRequestId, status: "PENDING" },
        data: { status: "FAILED" }
      });
    }

    return NextResponse.json({ message: "Callback processed successfully" });
  } catch (error) {
    console.error("Callback Error:", error);
    return NextResponse.json({ message: "Error processing callback" }, { status: 500 });
  }
}
