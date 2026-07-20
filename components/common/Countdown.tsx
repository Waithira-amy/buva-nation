"use client";
import { useState, useEffect } from "react";

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isClosed, setIsClosed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Deadline set to August 31st, 2026 at 23:59:59
    const target = new Date("2026-08-31T23:59:59").getTime();

    const checkTime = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        // Keep counting down while we haven't reached Aug 31
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        // Once deadline is reached, show closed state
        setIsClosed(true); 
      }
    };

    checkTime(); // Run immediately on mount
    const interval = setInterval(checkTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // Prevents rendering issues before the client loads the time
  if (!isMounted) return null;

  // WHAT SHOWS AFTER AUGUST 31ST (WHEN VOTING CLOSES)
  if (isClosed) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-6">
        <div className="w-16 h-1 bg-rose-500 mx-auto rounded-full mb-6 shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>
        <h3 className="text-3xl font-serif font-bold text-rose-500 text-center drop-shadow-md">
          Voting is Closed!
        </h3>
        <p className="text-slate-400 text-xs tracking-widest uppercase mt-4 text-center font-medium">
          Thank you for supporting the YWCA nominees.
        </p>
      </div>
    );
  }

  // WHAT SHOWS BEFORE AUGUST 31ST (LIVE TICKING TIMER)
  return (
    <div className="w-full flex flex-col items-center justify-center py-2">
      {/* Timer Header */}
      <div className="text-center w-full mb-6">
        <h3 className="text-white font-serif font-bold text-2xl md:text-3xl mb-3 drop-shadow-md">
          Voting Ends In
        </h3>
        <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-amber-500 mx-auto rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
      </div>
      
      {/* Timer Numbers */}
      <div className="grid grid-cols-4 gap-2 w-full">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div key={unit} className="flex flex-col items-center justify-center bg-slate-950/50 border border-white/10 rounded-2xl p-3 shadow-inner">
            <span className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 drop-shadow-lg">
              {value.toString().padStart(2, '0')}
            </span>
            <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-cyan-400 mt-2 font-bold">
              {unit}
            </span>
          </div>
        ))}
      </div>

      {/* Footer Text */}
      <p className="text-slate-500 text-[10px] tracking-widest uppercase text-center font-bold mt-6">
        August 31st, 2026
      </p>
    </div>
  );
}