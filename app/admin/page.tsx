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

  let totalPlatformVotes = 0;
  categories.forEach(cat => {
    cat.nominees.forEach(nom => {
      totalPlatformVotes += nom.totalVotes;
    });
  });

  const totalRevenue = totalPlatformVotes * 10;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 border-b border-white/10 pb-6 mt-8">
          <h1 className="text-3xl font-serif font-bold text-amber-400 mb-2">Buva Nation Live Leaderboard</h1>
          <div className="flex gap-6 text-sm text-slate-400">
            <p>Total Votes: <span className="text-white font-bold">{totalPlatformVotes}</span></p>
            <p>Estimated Revenue: <span className="text-cyan-400 font-bold">Ksh {totalRevenue.toLocaleString()}</span></p>
          </div>
        </header>

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
                      <th className="pb-3 font-bold uppercase tracking-wider">Nominee PIN</th>
                      <th className="pb-3 font-bold uppercase tracking-wider text-right">Total Votes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.nominees.map((nominee, index) => (
                      <tr key={nominee.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                        <td className="py-3 text-slate-400 font-medium">#{index + 1}</td>
                        <td className="py-3 font-bold text-slate-200">{nominee.name}</td>
                        <td className="py-3 font-mono text-amber-400">{nominee.pinCode}</td>
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