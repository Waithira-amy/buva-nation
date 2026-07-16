import { PrismaClient } from "@prisma/client";
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Setup database connection with fallback for Vercel's Neon integration
const connectionString = `${process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const categories = await prisma.category.findMany({
    include: {
      nominees: {
        orderBy: { totalVotes: 'desc' }
      }
    },
    orderBy: { name: 'asc' }
  });

  // Calculate Total Votes
  let totalPlatformVotes = 0;
  categories.forEach(cat => {
    cat.nominees.forEach(nom => {
      totalPlatformVotes += nom.totalVotes;
    });
  });

  // Financial Deductions Math
  const grossRevenue = totalPlatformVotes * 10;
  const twentyPercentCut = grossRevenue * 0.20; // 20% deduction from the votes
  const fixedDeduction = 10000; // One-time 10k deduction
  const netRevenue = grossRevenue - twentyPercentCut - fixedDeduction;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto">
        
        <header className="mb-8 border-b border-white/10 pb-6 mt-8">
          <h1 className="text-3xl font-serif font-bold text-amber-400 mb-2">Buva Nation Live Leaderboard</h1>
          <p className="text-slate-400 text-sm">Real-time voting and financial tracking dashboard.</p>
        </header>

        {/* Financial Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          <div className="bg-slate-900 border border-white/10 p-6 rounded-3xl shadow-xl">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Platform Votes</p>
            <p className="text-4xl text-white font-black">{totalPlatformVotes}</p>
          </div>

          <div className="bg-slate-900 border border-white/10 p-6 rounded-3xl shadow-xl">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Gross Revenue</p>
            <p className="text-4xl text-cyan-400 font-black">Ksh {grossRevenue.toLocaleString()}</p>
          </div>

          <div className="bg-slate-900 border border-white/10 p-6 rounded-3xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Net Profit</p>
            <p className={`text-4xl font-black relative z-10 ${netRevenue >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              Ksh {netRevenue.toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest mt-3 border-t border-white/10 pt-3 relative z-10">
              - 20% Vote Cut & 10k Fixed Fee
            </p>
          </div>

        </div>

        {/* Leaderboard Tables */}
        <div className="space-y-12">
          {categories.map((category) => (
            <div key={category.id} className="bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2 font-serif">
                {category.name}
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-slate-500 border-b border-white/10">
                      <th className="pb-3 font-bold uppercase tracking-wider w-16">Rank</th>
                      <th className="pb-3 font-bold uppercase tracking-wider">Nominee Name</th>
                      <th className="pb-3 font-bold uppercase tracking-wider">Access PIN</th>
                      <th className="pb-3 font-bold uppercase tracking-wider text-right">Total Votes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.nominees.map((nominee, index) => (
                      <tr key={nominee.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                        <td className="py-3 text-slate-400 font-medium">#{index + 1}</td>
                        <td className="py-3 font-bold text-slate-200">{nominee.name}</td>
                        <td className="py-3 font-mono text-purple-400">{nominee.pinCode}</td>
                        <td className="py-3 text-right">
                          <span className="bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full font-bold">
                            {nominee.totalVotes}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}