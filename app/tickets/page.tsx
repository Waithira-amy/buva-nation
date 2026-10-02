// app/tickets/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flame, Ticket as TicketIcon, ShieldCheck, ArrowLeft, Users, Crown, KeyRound, CheckCircle2 } from "lucide-react";
import Link from "next/link";

type TicketTier = "EARLY_BIRD" | "FLASH_REGULAR" | "REGULAR" | "GROUP_5" | "VIP_FLASH" | "VIP" | "COMPLIMENTARY";

export default function TicketPurchasePage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [ticketType, setTicketType] = useState<TicketTier>("FLASH_REGULAR");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Complimentary Tickets State
  const [passcode, setPasscode] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [compTicketsLeft, setCompTicketsLeft] = useState(70);

  const ticketPrices: Record<TicketTier, number> = { 
    EARLY_BIRD: 300, 
    FLASH_REGULAR: 500, 
    REGULAR: 1000, 
    GROUP_5: 3500, 
    VIP_FLASH: 1500, 
    VIP: 2500,
    COMPLIMENTARY: 0
  };

  const handleUnlock = () => {
    if (passcode === "BUVACOMP26") {
      setIsUnlocked(true);
      setTicketType("COMPLIMENTARY");
      setMessage({ type: "success", text: "Complimentary tier unlocked!" });
    } else {
      setMessage({ type: "error", text: "Invalid passcode." });
    }
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    // Handle Complimentary Ticket logic bypassing M-Pesa
    if (ticketType === "COMPLIMENTARY") {
      if (compTicketsLeft > 0) {
        try {
          // Replace with actual API call to update DB: await fetch('/api/tickets/complimentary', { ... })
          setCompTicketsLeft(prev => prev - 1);
          setMessage({ type: "success", text: "Complimentary Ticket Claimed Successfully!" });
        } catch (err) {
          setMessage({ type: "error", text: "Error claiming ticket." });
        }
      } else {
        setMessage({ type: "error", text: "All complimentary tickets have been claimed." });
      }
      setLoading(false);
      return;
    }

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
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 p-4 md:p-6 font-sans relative overflow-x-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-slate-950 to-slate-950 -z-10 pointer-events-none" />

      <div className="max-w-2xl w-full bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative my-12">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back Home
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold mb-2">Get Your <span className="text-cyan-400">Tickets</span></h1>
          <p className="text-slate-400 text-sm">Mr & Miss Community Culture Awards Hosted by Buva.</p>
        </div>

        <form onSubmit={handlePurchase} className="space-y-6">
          
          {/* TICKET SELECTION GRID */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            
            <button type="button" disabled className="p-3 md:p-4 rounded-xl border flex flex-col items-center text-center gap-2 transition-all bg-black/50 border-white/5 text-white/20 cursor-not-allowed">
              <TicketIcon className="w-6 h-6 text-white/20" />
              <span className="font-bold text-[10px] md:text-xs tracking-wider line-through">EARLY BIRD</span>
              <span className="text-[10px] font-black uppercase text-rose-500 tracking-widest mt-1">Closed</span>
            </button>

            <button type="button" onClick={() => setTicketType("FLASH_REGULAR")} className={`p-3 md:p-4 rounded-xl border flex flex-col items-center text-center gap-2 transition-all ${ticketType === "FLASH_REGULAR" ? "bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_15px_rgba(34,211,238,0.3)]" : "bg-slate-950 border-white/10 text-slate-500 hover:border-white/30"}`}>
              <Flame className={`w-6 h-6 ${ticketType === "FLASH_REGULAR" ? "text-cyan-400" : "text-cyan-400/50"}`} />
              <span className="font-bold text-[10px] md:text-xs tracking-wider">FLASH REG</span>
              <span className="text-xs">Ksh 500</span>
              <span className="text-[9px] text-cyan-400 bg-cyan-900/30 px-2 py-0.5 rounded-full">30 Slots</span>
            </button>

            <button type="button" onClick={() => setTicketType("REGULAR")} className={`p-3 md:p-4 rounded-xl border flex flex-col items-center text-center gap-2 transition-all ${ticketType === "REGULAR" ? "bg-purple-500/20 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]" : "bg-slate-950 border-white/10 text-slate-500 hover:border-white/30"}`}>
              <TicketIcon className={`w-6 h-6 ${ticketType === "REGULAR" ? "text-purple-400" : "text-purple-400/50"}`} />
              <span className="font-bold text-[10px] md:text-xs tracking-wider">REGULAR</span>
              <span className="text-xs">Ksh 1,000</span>
              <span className="text-[9px] text-purple-400 bg-purple-900/30 px-2 py-0.5 rounded-full">30 Slots</span>
            </button>

            <button type="button" onClick={() => setTicketType("GROUP_5")} className={`p-3 md:p-4 rounded-xl border flex flex-col items-center text-center gap-2 transition-all ${ticketType === "GROUP_5" ? "bg-emerald-500/20 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "bg-slate-950 border-white/10 text-slate-500 hover:border-white/30"}`}>
              <Users className={`w-6 h-6 ${ticketType === "GROUP_5" ? "text-emerald-400" : "text-emerald-400/50"}`} />
              <span className="font-bold text-[10px] md:text-xs tracking-wider">GROUP OF 5</span>
              <span className="text-xs">Ksh 3,500</span>
              <span className="text-[9px] text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded-full">Unlimited</span>
            </button>

            <button type="button" onClick={() => setTicketType("VIP_FLASH")} className={`p-3 md:p-4 rounded-xl border flex flex-col items-center text-center gap-2 transition-all ${ticketType === "VIP_FLASH" ? "bg-amber-500/20 border-amber-400 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]" : "bg-slate-950 border-white/10 text-slate-500 hover:border-white/30"}`}>
              <Flame className={`w-6 h-6 ${ticketType === "VIP_FLASH" ? "text-amber-400" : "text-amber-400/50"}`} />
              <span className="font-bold text-[10px] md:text-xs tracking-wider">VIP FLASH</span>
              <span className="text-xs">Ksh 1,500</span>
              <span className="text-[9px] text-amber-400 bg-amber-900/30 px-2 py-0.5 rounded-full">10 Slots</span>
            </button>

            <button type="button" onClick={() => setTicketType("VIP")} className={`p-3 md:p-4 rounded-xl border flex flex-col items-center text-center gap-2 transition-all ${ticketType === "VIP" ? "bg-rose-500/20 border-rose-400 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]" : "bg-slate-950 border-white/10 text-slate-500 hover:border-white/30"}`}>
              <Crown className={`w-6 h-6 ${ticketType === "VIP" ? "text-rose-400" : "text-rose-400/50"}`} />
              <span className="font-bold text-[10px] md:text-xs tracking-wider">VIP</span>
              <span className="text-xs">Ksh 2,500</span>
              <span className="text-[9px] text-rose-400 bg-rose-900/30 px-2 py-0.5 rounded-full">Unlimited</span>
            </button>

            {/* Hidden Complimentary Tier - Only shows when unlocked */}
            {isUnlocked && (
               <button type="button" onClick={() => setTicketType("COMPLIMENTARY")} className={`p-3 md:p-4 rounded-xl border flex flex-col items-center text-center gap-2 transition-all ${ticketType === "COMPLIMENTARY" ? "bg-indigo-500/20 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]" : "bg-slate-950 border-white/10 text-slate-500 hover:border-white/30"}`}>
               <CheckCircle2 className={`w-6 h-6 ${ticketType === "COMPLIMENTARY" ? "text-indigo-400" : "text-indigo-400/50"}`} />
               <span className="font-bold text-[10px] md:text-xs tracking-wider">COMPLIMENTARY</span>
               <span className="text-xs">Free</span>
               <span className="text-[9px] text-indigo-400 bg-indigo-900/30 px-2 py-0.5 rounded-full">{compTicketsLeft} Left</span>
             </button>
            )}
          </div>

          <div className="pt-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              {ticketType === "COMPLIMENTARY" ? "Confirm Phone Number" : "M-Pesa Phone Number"}
            </label>
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
            disabled={loading || (ticketType === "COMPLIMENTARY" && compTicketsLeft === 0)}
            className="w-full bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 text-sm tracking-widest uppercase shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? "Processing..." : ticketType === "COMPLIMENTARY" ? "Claim Ticket" : `Pay Ksh ${ticketPrices[ticketType]}`} <ShieldCheck className="w-4 h-4" />
          </button>

          {/* Hidden Passcode Input */}
          {!isUnlocked && (
            <div className="mt-6 pt-6 border-t border-white/5 flex flex-col items-center gap-3">
              <span className="text-xs text-slate-500 font-medium flex items-center gap-2">
                <KeyRound className="w-3 h-3" /> Have a complimentary passcode?
              </span>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="Enter code"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                />
                <button
                  type="button"
                  onClick={handleUnlock}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Unlock
                </button>
              </div>
            </div>
          )}

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