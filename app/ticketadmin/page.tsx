import { PrismaClient } from "@prisma/client";
import { 
  Ticket as TicketIcon, CheckCircle2, XCircle, Clock, 
  RefreshCw, QrCode, CreditCard, Activity 
} from "lucide-react";

// Initialize Prisma
const prisma = new PrismaClient();

// Force Next.js to fetch live data on every load (No caching)
export const dynamic = "force-dynamic";

export default async function TicketAdminDashboard() {
  let tickets: any[] = [];
  
  try {
    // Fetch all tickets safely. We use (prisma as any) just in case your model is named differently
    tickets = await (prisma as any).ticket.findMany({
      orderBy: { id: 'desc' }
    });
  } catch (error) {
    console.error("Database connection error:", error);
  }

  // Calculate live statistics
  const paid = tickets.filter((t) => t.status === "PAID");
  const scanned = tickets.filter((t) => t.status === "SCANNED");
  const failed = tickets.filter((t) => t.status === "FAILED");
  const pending = tickets.filter((t) => t.status === "PENDING");
  
  const validTickets = [...paid, ...scanned];
  const totalRevenue = validTickets.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-white/10 p-6 rounded-2xl shadow-xl">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-wide flex items-center gap-3">
              <Activity className="w-8 h-8 text-cyan-400" />
              Buva Ticket Admin
            </h1>
            <p className="text-slate-400 text-xs uppercase tracking-widest mt-1 font-bold">
              Live Database Monitor
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Total Revenue</p>
              <p className="text-2xl font-black text-emerald-400 font-mono">
                KES {totalRevenue.toLocaleString()}
              </p>
            </div>
            {/* Standard anchor tag forces a hard reload of the server component */}
            <a 
              href="/ticketadmin" 
              className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl transition-colors shadow-lg flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </a>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard 
            title="Paid Tickets" 
            count={paid.length} 
            icon={<CreditCard className="w-5 h-5 text-emerald-400" />} 
            border="border-emerald-500/30"
            bg="bg-emerald-500/10"
          />
          <StatCard 
            title="Scanned At Door" 
            count={scanned.length} 
            icon={<QrCode className="w-5 h-5 text-blue-400" />} 
            border="border-blue-500/30"
            bg="bg-blue-500/10"
          />
          <StatCard 
            title="Pending Payment" 
            count={pending.length} 
            icon={<Clock className="w-5 h-5 text-amber-400" />} 
            border="border-amber-500/30"
            bg="bg-amber-500/10"
          />
          <StatCard 
            title="Failed/Cancelled" 
            count={failed.length} 
            icon={<XCircle className="w-5 h-5 text-rose-400" />} 
            border="border-rose-500/30"
            bg="bg-rose-500/10"
          />
        </div>

        {/* Live Data Table */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/10 bg-slate-900/50">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TicketIcon className="w-5 h-5 text-cyan-400" /> Recent Transactions
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-950/50 text-slate-400 text-[10px] uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4 font-bold">Ticket ID</th>
                  <th className="px-6 py-4 font-bold">Phone Number</th>
                  <th className="px-6 py-4 font-bold">Type</th>
                  <th className="px-6 py-4 font-bold">Amount</th>
                  <th className="px-6 py-4 font-bold">M-Pesa Receipt</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                      {ticket.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-300">
                      {ticket.phoneNumber}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold tracking-wider text-cyan-400">
                      {ticket.ticketType}
                    </td>
                    <td className="px-6 py-4 font-mono text-emerald-400">
                      KES {ticket.amount}
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-400">
                      {ticket.mpesaReceiptNumber || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={ticket.status} />
                    </td>
                  </tr>
                ))}
                {tickets.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      No tickets found in the database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}

// Reusable UI Components for the Dashboard
function StatCard({ title, count, icon, border, bg }: { title: string, count: number, icon: any, border: string, bg: string }) {
  return (
    <div className={`p-6 rounded-2xl border ${border} ${bg} flex flex-col justify-center`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{title}</h3>
        {icon}
      </div>
      <p className="text-3xl font-black text-white font-mono">{count}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "PAID":
      return <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 w-max"><CheckCircle2 className="w-3 h-3"/> PAID</span>;
    case "SCANNED":
      return <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 w-max"><QrCode className="w-3 h-3"/> SCANNED</span>;
    case "FAILED":
      return <span className="px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 w-max"><XCircle className="w-3 h-3"/> FAILED</span>;
    default:
      return <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 w-max"><Clock className="w-3 h-3"/> PENDING</span>;
  }
}