"use client";
import { useState } from "react";
import { Mail, MapPin, Globe, Check } from "lucide-react";
import Image from "next/image";

const CopyEmail = ({ email }: { email: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="flex items-center gap-2 hover:text-purple-400 transition text-left">
      <span>{email}</span>
      {copied ? <Check className="w-3 h-3 text-purple-400" /> : <span className="text-[10px] uppercase opacity-50">Copy</span>}
    </button>
  );
};

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-20 pb-8 border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full filter blur-[100px] -z-10 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 bg-white/5 rounded-full p-1 border border-white/10">
                <Image src="/logo-icon.png" alt="Buva Logo" fill sizes="40px" className="object-contain rounded-full" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-2xl text-white leading-none">
                  BUVA <span className="text-amber-500">NATION</span>
                </span>
                <span className="text-[9px] tracking-[0.2em] text-purple-500 font-bold uppercase mt-1 leading-none">Africa</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Developing, improving, empowering, and educating individuals into perfect brand ambassadors fit for the industry.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-lg font-bold mb-6 text-white border-b border-white/10 pb-2 inline-block">Platform</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a href="#about" className="hover:text-purple-400 transition">About Us</a></li>
              <li><a href="#team" className="hover:text-purple-400 transition">The Team</a></li>
              <li><a href="#categories" className="hover:text-amber-500 transition">Award Categories</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg font-bold mb-6 text-white border-b border-white/10 pb-2 inline-block">Contact</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-amber-500" /><CopyEmail email="buvanation@gmail.com" /></li>
              <li className="flex items-center gap-3"><Globe className="w-4 h-4 text-amber-500" /><a href="#" className="hover:text-purple-400">@buvanation</a></li>
              <li className="flex items-center gap-3"><MapPin className="w-4 h-4 text-amber-500" /><span>+254 116 872 941</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Perfectors Creative Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}