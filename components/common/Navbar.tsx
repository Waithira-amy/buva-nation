"use client";
import { useState, useEffect } from "react";
import { Menu, X, ShieldCheck, Sun, Moon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${scrolled ? 'bg-slate-950/95 backdrop-blur-md border-b border-white/10 py-3 shadow-lg' : 'bg-transparent border-b border-white/10 py-4'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* Brand & Single Logo */}
        <Link href="/" className="flex items-center gap-3 cursor-pointer group">
          <div className="relative w-12 h-12 flex-shrink-0 bg-white/5 rounded-full p-1 border border-white/10 shadow-[0_0_15px_rgba(168,85,247,0.3)] group-hover:scale-105 transition-transform">
            <Image 
              src="/logo-icon.png" 
              alt="Buva Nation Logo" 
              fill 
              sizes="48px"
              className="object-contain rounded-full" 
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-serif font-bold text-xl tracking-tight text-white flex items-center gap-1.5 leading-none">
              BUVA <span className="text-purple-500">NATION</span>
            </span>
            <span className="text-[9px] tracking-[0.2em] text-amber-500 font-semibold uppercase mt-1 leading-none">
              Africa
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 text-[13px] font-medium text-slate-300">
          <a href="#about" className="hover:text-purple-400 transition uppercase tracking-wider">About Us</a>
          <a href="#team" className="hover:text-purple-400 transition uppercase tracking-wider">The Team</a>
          <a href="#categories" className="hover:text-amber-400 transition uppercase tracking-wider">Awards</a>
          
          <div className="flex items-center gap-4 border-l border-white/20 pl-6">
            {mounted && (
              <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
                {theme === "dark" ? <Sun className="w-4 h-4 text-white" /> : <Moon className="w-4 h-4 text-white" />}
              </button>
            )}
            <Link href="/portal" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white flex items-center gap-1.5 transition">
              <ShieldCheck className="w-4 h-4" /> Portal
            </Link>
            <a href="#categories" className="bg-gradient-to-r from-purple-600 to-amber-500 text-white px-6 py-2.5 rounded-full text-[11px] font-bold tracking-widest uppercase hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition duration-300">
              Vote Now
            </a>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-4">
           {mounted && (
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 text-white">
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          )}
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-slate-950/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-4 shadow-2xl">
          <a href="#about" onClick={() => setIsOpen(false)} className="text-lg font-medium text-white pb-2 border-b border-white/10">About BUVA</a>
          <a href="#team" onClick={() => setIsOpen(false)} className="text-lg font-medium text-white pb-2 border-b border-white/10">The Team</a>
          <a href="#categories" onClick={() => setIsOpen(false)} className="text-lg font-medium text-white pb-2 border-b border-white/10">Award Categories</a>
          <Link href="/portal" onClick={() => setIsOpen(false)} className="text-lg font-medium text-purple-400 text-left pb-2 border-b border-white/10 flex items-center gap-2">
             <ShieldCheck className="w-5 h-5"/> Nominee Portal
          </Link>
          <Link href="#categories" onClick={() => setIsOpen(false)} className="bg-gradient-to-r from-purple-600 to-amber-500 text-center text-white px-6 py-4 mt-2 rounded-xl text-sm font-bold tracking-widest uppercase shadow-lg">
            Vote Now
          </Link>
        </div>
      )}
    </nav>
  );
}