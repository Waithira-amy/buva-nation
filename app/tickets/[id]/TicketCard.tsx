"use client";
import { CheckCircle2, AlertTriangle, Download } from "lucide-react";
import QRCode from "react-qr-code"; 

export default function TicketCard({ ticket, scanUrl }: { ticket: any, scanUrl: string }) {
  return (
    <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center pb-6">
      
      {/* 1. UPDATED HEADER: Community Culture */}
      <div className="w-full bg-gradient-to-b from-blue-500 to-blue-800 p-6 text-center rounded-t-3xl border-b border-white/10">
        <h1 className="text-2xl font-serif font-bold text-white mb-1 tracking-wider uppercase drop-shadow-md">
          Community Culture
        </h1>
        <p className="text-white/80 text-[10px] font-bold tracking-widest uppercase mb-4">
          Buva Nation Africa
        </p>
        <div className="inline-block bg-white/10 border border-white/20 rounded-full px-4 py-1 backdrop-blur-sm">
          <span className="text-white text-[10px] font-bold tracking-widest uppercase">
            {ticket.ticketType} TICKET
          </span>
        </div>
      </div>

      {/* Ticket Body */}
      <div className="p-6 w-full flex flex-col items-center">

        {/* 2. GUEST NAME DISPLAY */}
        {ticket?.guestName && (
          <div className="mb-5 text-center w-full bg-slate-950/50 rounded-xl py-3 border border-white/5">
            <p className="text-cyan-400 text-[9px] font-bold uppercase tracking-widest mb-1 opacity-80">
              Ticket Holder
            </p>
            <p className="text-lg font-bold text-white tracking-wide">
              {ticket.guestName}
            </p>
          </div>
        )}

        {/* QR Code Container */}
        <div className="bg-white p-4 rounded-2xl shadow-lg mb-6">
          <QRCode value={scanUrl} size={180} />
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 mb-6">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-emerald-400 font-bold tracking-wide">Ticket Valid</span>
        </div>

        {/* Warning Box */}
        <div className="w-full bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 text-center mb-6">
          <p className="text-rose-400 text-[10px] font-bold tracking-widest uppercase flex items-center justify-center gap-1.5 mb-2">
            <AlertTriangle className="w-3 h-3" /> Do Not Share
          </p>
          <p className="text-slate-400 text-[10px] leading-relaxed">
            Valid for <strong className="text-white">ONE</strong> entry. Once scanned at the door, this code expires instantly.
          </p>
        </div>

        {/* Dashed Line Divider */}
        <div className="w-full border-t border-dashed border-white/20 mb-6"></div>

        {/* Receipt Info */}
        <p className="text-slate-500 text-[9px] font-mono tracking-widest uppercase">
          RECEIPT: {ticket.mpesaReceiptNumber || `COMP-${ticket.id.substring(0, 12)}`}
        </p>
      </div>

      {/* 3. YOUR ORIGINAL DOWNLOAD BUTTON */}
      <button 
        onClick={() => window.print()} 
        className="w-11/12 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg text-xs tracking-widest uppercase flex items-center justify-center gap-2"
      >
        <Download className="w-4 h-4" /> Download Ticket
      </button>
    </div>
  );
}