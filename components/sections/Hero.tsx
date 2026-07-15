"use client";
import { ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";
import Countdown from "../common/Countdown";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-amber-900/10 -z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full relative z-20">
        
        {/* NEW DESIGN: Glassmorphism Card for Hero Text */}
        <div className="bg-slate-900/40 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl space-y-6 text-left animate-in slide-in-from-left-8 duration-1000 mt-12 lg:mt-0">
          
          <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 px-4 py-2 rounded-full text-amber-400 text-[10px] font-bold uppercase tracking-wider shadow-lg">
            <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" /> 
            Talent Management & Creative Agency
          </div>
          
          <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1] drop-shadow-2xl">
            ELEVATING <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-500 relative inline-block mt-2">
              TALENT.
            </span>
          </h1>
          
          <div className="border-l-4 border-amber-500 pl-4 py-1">
            <p className="text-sm md:text-base text-slate-300 leading-relaxed font-medium">
              Empowering individuals through professional training, recognizing excellence, and creating impactful brand experiences across Africa.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 pt-4 justify-start">
            <Link href="#categories" className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-8 py-3.5 rounded-full font-bold tracking-widest uppercase text-xs hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all flex items-center gap-2 border border-purple-400/50 hover:-translate-y-1">
              VIEW AWARDS <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="flex w-full items-center justify-start lg:justify-center relative z-10 animate-in slide-in-from-right-8 duration-1000 delay-200">
           <div className="absolute inset-0 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none"></div>
           <div className="w-full max-w-md flex flex-col items-center justify-center p-6 md:p-8 rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-white/10 shadow-2xl relative">
              <Countdown />
           </div>
        </div>

      </div>
    </section>
  );
}