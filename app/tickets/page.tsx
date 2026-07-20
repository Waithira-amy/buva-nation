"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Flame, Ticket as TicketIcon, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TicketPurchasePage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [ticketType, setTicketType] = useState<"FLASH" | "ADVANCED">("FLASH");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [flashSold, setFlashSold] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);

  // BUVA PRICES: Ksh 300 (First 50) and Ksh 500
  const ticketPrices = { FLASH: 1, ADVANCED: 500 };
  const FLASH_LIMIT = 50;

  useEffect(() => {
    fetch("/api/tickets/available", { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        setFlashSold(data.flashSold || 0);
        if (data.flashSold >= FLASH_LIMIT) setTicketType("ADVANCED");
      })
      .catch(err => console.error("Error fetching stats:", err))
      .finally(() => setLoadingStats(false));
  }, []);

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/tickets/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, amount: ticketPrices[ticketType], ticketType })
      });

      const data = await res.json();
      if (data.success) {
         router.push(`/tickets/${data.ticketId}`);
      } else {
         setMessage({ type: "error", text: data.message || "Failed to initiate payment." });
         setLoading(false);
      }
    } catch (err) {
      setMessage({ type: "error", text: "Server error triggering M-Pesa." });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 p-6 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-slate-950 to-slate-950 -z-10 pointer-events-none" />

      <div className="max-w-md w-full bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back Home
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold mb-2">Get Your <span className="text-cyan-400">Tickets</span></h1>
          <p className="text-slate-400 text-sm">Secure your spot at the YWCA Awards Hosted by Buva.</p>
        </div>

        <form onSubmit={handlePurchase} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            
            {/* FLASH SALE */}
            <button
              type="button"
              disabled={loadingStats || flashSold >= FLASH_LIMIT}
              onClick={() => setTicketType("FLASH")}
              className={`p-4 rounded-xl border flex flex-col items-center text-center gap-2 transition-all relative overflow-hidden ${
                ticketType === "FLASH" 
                  ? "bg-purple-600/20 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]" 
                  : flashSold >= FLASH_LIMIT
                    ? "bg-black/50 border-white/5 text-white/20 cursor-not-allowed"
                    : "bg-slate-950 border-white/10 text-slate-500 hover:border-white/30"
              }`}
            >
              <Flame className={`w-6 h-6 ${ticketType === "FLASH" ? "text-purple-400" : flashSold >= FLASH_LIMIT ? "text-white/20" : "text-purple-400/50"}`} />
              <span className="font-bold text-sm tracking-wider">FLASH SALE</span>
              {loadingStats ? (
                <span className="text-xs text-slate-500 animate-pulse">Loading...</span>
              ) : flashSold >= FLASH_LIMIT ? (
                <span className="text-[10px] font-black uppercase text-rose-500 tracking-widest mt-1">Sold Out</span>
              ) : (
                <span className="text-xs">Ksh {ticketPrices.FLASH}</span>
              )}
            </button>

            {/* ADVANCED */}
            <button
              type="button"
              onClick={() => setTicketType("ADVANCED")}
              className={`p-4 rounded-xl border flex flex-col items-center text-center gap-2 transition-all ${
                ticketType === "ADVANCED" 
                  ? "bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_15px_rgba(34,211,238,0.3)]" 
                  : "bg-slate-950 border-white/10 text-slate-500 hover:border-white/30"
              }`}
            >
              <TicketIcon className={`w-6 h-6 ${ticketType === "ADVANCED" ? "text-cyan-400" : "text-cyan-400/50"}`} />
              <span className="font-bold text-sm tracking-wider">ADVANCED</span>
              <span className="text-xs">Ksh {ticketPrices.ADVANCED}</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">M-Pesa Phone Number</label>
            <input
              type="tel"
              required
              placeholder="e.g., 0712345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-cyan-500/50 transition-all shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={loading || (ticketType === "FLASH" && flashSold >= FLASH_LIMIT)}
            className="w-full bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 text-sm tracking-widest uppercase shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? "Processing..." : `Pay Ksh ${ticketPrices[ticketType]}`} <ShieldCheck className="w-4 h-4" />
          </button>

          {message.text && (
            <div className={`p-4 rounded-xl text-sm text-center font-medium border ${message.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
              {message.text}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}