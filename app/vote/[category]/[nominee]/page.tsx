"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import QRCode from "react-qr-code";
import { Sparkles, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function VotePage() {
  const params = useParams();
  
  const category = decodeURIComponent(params.category as string).replace(/-/g, " ");
  const nominee = decodeURIComponent(params.nominee as string).replace(/-/g, " ");

  // FIXED: Now uses the new custom domain!
  const voteUrl = `https://buvanationafrica.co.ke/vote/${params.category}/${params.nominee}`;

  const [phoneNumber, setPhoneNumber] = useState("");
  const [votes, setVotes] = useState<number | "">(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const totalAmount = typeof votes === "number" ? Math.max(1, votes) * 10 : 10;
  const votePackages = [10, 50, 100, 200, 500, 1000];

  const handleVoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalVotes = typeof votes === "number" && votes > 0 ? votes : 1;
    const finalAmount = finalVotes * 10;
    
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch("/api/mpesa/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber,
          amount: finalAmount,
          votes: finalVotes,             
          categorySlug: category, 
          nomineeName: nominee,   
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setMessage({
          type: "success",
          text: "🎉 Payment Prompt Sent! Please check your phone to enter your M-Pesa PIN.",
        });
      } else {
        setMessage({
          type: "error",
          text: result.message || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to connect to the payment gateway.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 p-6 pt-24 pb-24 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-slate-950 to-slate-950 -z-10 pointer-events-none" />

      <div className="max-w-md w-full bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-cyan-500/20 blur-[60px] rounded-full pointer-events-none" />

        <Link href="/#categories" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <h1 className="text-3xl font-serif font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          Cast Your Vote
        </h1>
        <p className="text-slate-400 text-center mb-8 text-sm">
          Supporting <span className="text-white font-bold capitalize">{nominee}</span> for{" "}
          <span className="text-purple-400 font-semibold capitalize">{category}</span>
        </p>

        <form onSubmit={handleVoteSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              M-Pesa Phone Number
            </label>
            <input
              type="tel"
              required
              placeholder="e.g., 0712345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all shadow-inner"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Select Vote Package
            </label>
            <div className="grid grid-cols-3 gap-3">
              {votePackages.map((pkg) => (
                <button
                  key={pkg}
                  type="button"
                  onClick={() => setVotes(pkg)}
                  className={`flex flex-col items-center justify-center py-3 rounded-xl border transition-all duration-300 ${
                    votes === pkg 
                      ? "bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)] scale-[1.02]" 
                      : "bg-slate-950 border-white/10 text-slate-400 hover:border-white/30 hover:bg-slate-800"
                  }`}
                >
                  <span className="text-lg font-bold">{pkg}</span>
                  <span className="text-[10px] font-medium uppercase tracking-wider opacity-60">Votes</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Or Enter Custom Amount
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                required
                value={votes}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setVotes(isNaN(val) ? "" : val);
                }}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-all shadow-inner text-lg font-medium"
                placeholder="Enter custom votes"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold uppercase tracking-widest pointer-events-none">
                Votes
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || typeof votes !== "number" || votes < 1}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98] shadow-lg text-sm tracking-wide uppercase"
          >
            {loading ? "Processing..." : `Pay Ksh ${totalAmount} via M-Pesa`} <ShieldCheck className="w-4 h-4"/>
          </button>
        </form>

        {message.text && (
          <div
            className={`mt-6 p-4 rounded-xl text-sm border text-center font-medium animate-in fade-in duration-300 ${
              message.type === "success"
                ? "bg-emerald-950/50 border-emerald-500/50 text-emerald-400"
                : "bg-rose-950/50 border-rose-500/50 text-rose-400"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col items-center">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-4">
            Scan to share this nominee
          </p>
          <div className="bg-white p-2.5 rounded-2xl shadow-lg">
            <QRCode value={voteUrl} size={100} level="H" className="rounded-lg" />
          </div>
        </div>

      </div>
    </div>
  );
}
