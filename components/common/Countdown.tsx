"use client";
import { Activity } from "lucide-react";

export default function Countdown() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-4">
      
      {}
      <div className="relative flex items-center justify-center w-20 h-20 mb-6">
        <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping"></div>
        <div className="relative bg-slate-900 border-2 border-emerald-500 text-emerald-400 w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
          <Activity className="w-8 h-8" />
        </div>
      </div>

      {}
      <h3 className="text-3xl md:text-4xl font-serif font-bold text-white text-center drop-shadow-md mb-3">
        Voting is <span className="text-emerald-400">Ongoing</span>
      </h3>
      
      {/* Decorative Divider */}
      <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full mb-5 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>

      {}
      <p className="text-slate-400 text-xs tracking-widest uppercase text-center font-bold">
        Support your favorite YWCA nominees today
      </p>

    </div>
  );
}