"use client";
import { useState } from "react";
import { ShieldCheck, ShieldAlert, QrCode } from "lucide-react";
import { useParams } from "next/navigation";

export default function ScanPage() {
  const params = useParams();
  const [status, setStatus] = useState<"IDLE" | "LOADING" | "VALID" | "INVALID">("IDLE");
  const [message, setMessage] = useState("");

  const handleValidate = async () => {
    setStatus("LOADING");
    
    try {
      const res = await fetch("/api/tickets/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: params.id }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("VALID");
        setMessage(data.message);
      } else {
        setStatus("INVALID");
        setMessage(data.message);
      }
    } catch (err) {
      setStatus("INVALID");
      setMessage("Connection error. Could not verify.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-slate-950 to-slate-950 -z-10 pointer-events-none" />
      
      <div className="absolute top-6 w-full text-center">
        <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase">
          BUVA Bouncers & Security Only
        </span>
      </div>

      {}
      {status === "IDLE" && (
        <div className="flex flex-col items-center text-center animate-in zoom-in-95">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <QrCode className="w-10 h-10 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Ticket Scanned</h1>
          <p className="text-slate-400 text-sm mb-8 max-w-xs">Click below to verify the database and admit the guest.</p>
          
          <button 
            onClick={handleValidate}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-10 py-5 rounded-2xl font-black text-lg tracking-wider shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all active:scale-95"
          >
            VALIDATE ENTRY
          </button>
        </div>
      )}

      {}
      {status === "LOADING" && (
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
          <h2 className="text-xl font-bold text-slate-400">Verifying Database...</h2>
        </div>
      )}

      {}
      {status === "VALID" && (
        <div className="flex flex-col items-center text-center animate-in zoom-in-95 bg-emerald-950/40 border border-emerald-500/50 p-10 rounded-3xl w-full max-w-sm">
          <ShieldCheck className="w-24 h-24 text-emerald-400 mb-6 drop-shadow-[0_0_20px_rgba(52,211,153,0.5)]" />
          <h1 className="text-3xl font-black text-emerald-400 mb-2">ENTRY APPROVED</h1>
          <p className="text-emerald-400/80 font-bold">{message}</p>
        </div>
      )}

      {}
      {status === "INVALID" && (
        <div className="flex flex-col items-center text-center animate-in zoom-in-95 bg-rose-950/40 border border-rose-500/50 p-10 rounded-3xl w-full max-w-sm">
          <ShieldAlert className="w-24 h-24 text-rose-500 mb-6 drop-shadow-[0_0_20px_rgba(244,63,94,0.5)]" />
          <h1 className="text-3xl font-black text-rose-500 mb-2">ENTRY DENIED</h1>
          <p className="text-rose-400/80 font-bold">{message}</p>
        </div>
      )}

    </div>
  );
}