"use client";
import { useState, useEffect } from "react";

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isClosed, setIsClosed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Deadline set to August 7th, 2026 at 00:00:00
    const target = new Date("2026-08-07T00:00:00").getTime();

    const checkTime = () => {
      const now = new Date().getTime();
      const difference = target - now;
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setIsClosed(true); 
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isMounted) return null;

  if (isClosed) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-6">
        <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full mb-6 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
        <h3 className="text-2xl md:text-3xl font-serif font-bold text-amber-500 text-center drop-shadow-md">
          Voting is Closed!
        </h3>
        <p className="text-white/80 text-xs tracking-widest uppercase mt-4 text-center font-medium">
          Thank you for your support.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-center w-full">
        <h3 className="text-white/90 font-bold tracking-[0.2em] uppercase text-sm mb-3">Voting Closes In</h3>
        <div className="w-16 h-1 bg-purple-500 mx-auto rounded-full mb-6 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
      </div>
      <div className="grid grid-cols-4 gap-3 w-full">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div key={unit} className="flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-xl p-3 shadow-inner">
            <span className="text-3xl md:text-4xl font-black text-white drop-shadow-lg">
              {value.toString().padStart(2, '0')}
            </span>
            <span className="text-[9px] md:text-xs uppercase tracking-[0.2em] text-amber-400 mt-1 font-bold">
              {unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}