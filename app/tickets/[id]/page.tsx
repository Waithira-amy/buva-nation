import { PrismaClient } from "@prisma/client";
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import TicketCard from "./TicketCard";

export const dynamic = "force-dynamic";

const pool = new Pool({ connectionString: process.env.DATABASE_URL as string });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default async function ViewTicketPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const ticketId = resolvedParams.id;

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId }
  });

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-rose-500 mb-2">Ticket Not Found</h1>
          <p className="text-slate-400">This ticket link is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  // The secret URL the bouncer will scan
  const scanUrl = `https://buvanationafrica.co.ke/scan/${ticket.id}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-slate-950 to-slate-950 -z-10 pointer-events-none" />
      <TicketCard ticket={ticket} scanUrl={scanUrl} />
    </div>
  );
}