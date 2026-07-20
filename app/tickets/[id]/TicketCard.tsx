"use client";
import { useRef, useState } from "react";
import QRCode from "react-qr-code";
import { ShieldAlert, CheckCircle2, RefreshCw, Download, AlertTriangle } from "lucide-react";
import { toPng } from "html-to-image";
import Link from "next/link";

export default function TicketCard({ ticket, scanUrl }: { ticket: any, scanUrl: string }) {
  const ticketRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!ticketRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(ticketRef.current, {
        quality: 1,
        pixelRatio: 2,
        style: { backgroundColor: '#020617' }, // slate-950 matching Buva background
        filter: (node) => {
          if (node instanceof HTMLElement) {
            return node.getAttribute('data-ignore') !== 'true';
          }
          return true;
        }
      });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `YWCA-${ticket.ticketType}-Ticket-${ticket.id.substring(0, 6)}.png`;
      link.click();
    } catch (error) {
      console.error("Error downloading ticket:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="max-w-sm w-full">
      {/* TICKET BODY */}
      <div ref={ticketRef} className="w-full bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
        
        {/* Ticket Header (Color depends on ticket type) */}
        <div className={`p-6 text-center ${ticket.ticketType === 'FLASH' ? 'bg-gradient-to-br from-purple-600 to-purple-900' : 'bg-gradient-to-br from-cyan-600 to-blue-800'}`}>
          <h2 className="font-serif text-2xl font-bold text-white tracking-widest uppercase">
            YWCA AWARDS
          </h2>
          <p className="text-white/80 text-[10px] font-bold tracking-[0.2em] mt-1">BUVA NATION AFRICA</p>
          <div className="mt-2 inline-block bg-black/20 px-3 py-1 rounded-full border border-white/20">
            <p className="text-white text-xs font-bold tracking-[0.2em]">{ticket.ticketType} TICKET</p>
          </div>
        </div>

        <div className="p-8 flex flex-col items-center text-center">
          
          {ticket.status === "PENDING" && (
            <div className="py-8 flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Awaiting Payment...</h3>
              <p className="text-slate-400 text-sm mb-8">Please enter your M-Pesa PIN on your phone. Once paid, click the button below.</p>
              
              <a data-ignore="true" href={`/tickets/${ticket.id}`} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-colors">
                <RefreshCw className="w-4 h-4" /> I Have Paid
              </a>
            </div>
          )}

          {ticket.status === "PAID" && (
            <div className="flex flex-col items-center animate-in zoom-in-95">
              <div className="bg-white p-4 rounded-2xl shadow-xl mb-6">
                <QRCode value={scanUrl} size={180} level="H" />
              </div>
              <h3 className="text-xl font-bold text-emerald-400 flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5" /> Ticket Valid
              </h3>
              
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mt-2 mb-6">
                <p className="text-red-200 text-xs leading-relaxed font-medium">
                  <strong className="text-red-400 flex items-center justify-center gap-1.5 mb-1.5 uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4" /> Do Not Share
                  </strong>
                  Valid for <strong>ONE</strong> entry. Once scanned at the door, this code expires instantly.
                </p>
              </div>

              <div className="w-full border-t border-dashed border-white/20 my-2" />
              <p className="text-slate-500 text-[10px] uppercase tracking-widest mt-4">Receipt: {ticket.mpesaReceiptNumber}</p>
            </div>
          )}

          {ticket.status === "SCANNED" && (
            <div className="py-8 flex flex-col items-center animate-in zoom-in-95">
              <div className="w-20 h-20 bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mb-4 border border-rose-500/30">
                <ShieldAlert className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-rose-400 mb-2">Ticket Used</h3>
              <p className="text-slate-400 text-sm">This ticket has already been scanned at the entrance and is no longer valid.</p>
            </div>
          )}

          {ticket.status === "FAILED" && (
            <div className="py-8 flex flex-col items-center">
              <h3 className="text-lg font-bold text-rose-400 mb-2">Payment Failed</h3>
              <p className="text-slate-400 text-sm mb-6">Your M-Pesa transaction was cancelled or failed.</p>
              <Link data-ignore="true" href="/tickets" className="bg-red-600 text-white px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest">
                Try Again
              </Link>
            </div>
          )}

        </div>
      </div>

      {/* DOWNLOAD BUTTON (Ignored during screenshot generation) */}
      {ticket.status === "PAID" && (
        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-4 rounded-2xl font-bold tracking-widest uppercase transition-all shadow-lg disabled:opacity-50"
        >
          <Download className="w-5 h-5" />
          {isDownloading ? "Saving Ticket..." : "Download Ticket"}
        </button>
      )}

    </div>
  );
}