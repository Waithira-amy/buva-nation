"use client";
import { useState, useRef } from "react";
import { Trophy, ArrowLeft, X, User, ChevronRight, Download, Share2 } from "lucide-react";
import { toPng } from "html-to-image";
import QRCode from "react-qr-code";
import Link from "next/link";

// You will populate this with actual YWCA categories later
const categoriesData = [
  { id: 1, name: "Mr YWCA Nairobi Branch", nominees: ["Pending Nominee 1", "Pending Nominee 2"] },
  { id: 2, name: "Miss YWCA Nairobi Branch", nominees: ["Pending Nominee 1", "Pending Nominee 2"] }
];

export default function Categories() {
  const [activeCategory, setActiveCategory] = useState<any>(null);
  const [selectedNominee, setSelectedNominee] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);

  const getAbsoluteShareUrl = () => {
    if (!activeCategory || !selectedNominee) return "";
    const categorySlug = encodeURIComponent(activeCategory.name.replace(/\s+/g, '-'));
    const nomineeSlug = encodeURIComponent(selectedNominee.replace(/\s+/g, '-'));
    return `https://buvanation.co.ke/vote/${categorySlug}/${nomineeSlug}`;
  };

  const handleDownload = async () => {
    if (!posterRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(posterRef.current, {
        quality: 1,
        pixelRatio: 2,
        style: { backgroundColor: '#020617' },
        filter: (node) => {
          if (node instanceof HTMLElement) {
            return node.getAttribute('data-ignore') !== 'true';
          }
          return true;
        }
      });
      const link = document.createElement("a");
      link.href = dataUrl;
      const cleanName = selectedNominee?.replace(/\s+/g, '-');
      link.download = `YWCA-Nominee-${cleanName}.png`;
      link.click();
    } catch (error) {
      console.error("Error downloading poster:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section id="categories" className="py-24 relative border-t border-white/10 min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          {!activeCategory && (
            <span className="inline-block py-1 px-4 rounded-full bg-cyan-500/10 text-xs uppercase font-bold tracking-widest text-cyan-400 border border-cyan-500/30 mb-2">
              Official Categories
            </span>
          )}
          <h2 className="font-serif text-4xl md:text-5xl font-bold mt-2 text-white">
            {activeCategory ? activeCategory.name : "Voting Categories"}
          </h2>
        </div>

        {!activeCategory && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {categoriesData.map((category) => (
              <div
                key={category.id}
                onClick={() => setActiveCategory(category)}
                className="group bg-slate-900 p-6 rounded-2xl border border-white/10 flex items-center gap-4 transition-all duration-300 hover:border-cyan-500/50 cursor-pointer text-left"
              >
                <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                  <Trophy className="w-6 h-6" />
                </div>
                <span className="text-lg font-bold text-white group-hover:text-cyan-400">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeCategory && (
          <div className="max-w-3xl mx-auto">
            <button 
              onClick={() => setActiveCategory(null)}
              className="flex items-center gap-2 text-cyan-400 hover:text-white mb-8 text-sm font-bold tracking-wider uppercase"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Categories
            </button>

            <div className="space-y-4">
              {activeCategory.nominees.map((nominee: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedNominee(nominee)}
                  className="w-full flex items-center justify-between bg-slate-900 border border-white/10 p-5 rounded-2xl hover:border-purple-500/50 transition-all group"
                >
                  <span className="text-lg font-bold text-white group-hover:text-purple-400">{nominee}</span>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-purple-400" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selected Nominee Modal */}
        {selectedNominee && activeCategory && (
          <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md p-4 overflow-y-auto">
            <div className="flex flex-col gap-4 w-full max-w-sm my-auto">
              
              <div ref={posterRef} className="bg-slate-900 border border-white/10 rounded-3xl w-full relative overflow-hidden pb-6">
                <button 
                  data-ignore="true"
                  onClick={() => setSelectedNominee(null)}
                  className="absolute top-4 right-4 z-20 bg-black/50 p-2 rounded-full text-white/50 hover:text-white border border-white/10"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="h-32 bg-gradient-to-br from-cyan-900 to-purple-900 flex items-center justify-center">
                  <span className="font-serif font-bold text-2xl text-white">
                    YWCA <span className="text-amber-400">AWARDS</span>
                  </span>
                </div>

                <div className="p-8 pb-0 flex flex-col items-center text-center -mt-16 relative z-10">
                  <div className="w-28 h-28 rounded-full bg-slate-800 border-4 border-cyan-400 flex items-center justify-center mb-4">
                    <User className="w-12 h-12 text-cyan-200" />
                  </div>
                  
                  <h3 className="font-serif text-2xl font-bold text-white mb-2">{selectedNominee}</h3>
                  <p className="text-purple-400 font-medium text-sm border-b border-white/10 pb-4 w-full">{activeCategory.name}</p>

                  <div className="mt-6 bg-white p-2 rounded-xl">
                    <QRCode value={getAbsoluteShareUrl()} size={80} level="H" />
                  </div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-3 mb-4">Scan to Vote</p>
                </div>
              </div>

              <div className="flex gap-3 w-full">
                <button onClick={handleDownload} disabled={isDownloading} className="flex-1 flex items-center justify-center gap-2 bg-cyan-500 text-slate-950 py-3 rounded-xl font-bold text-sm">
                  <Download className="w-4 h-4" /> {isDownloading ? "Saving..." : "Save Poster"}
                </button>
                <button onClick={() => setSelectedNominee(null)} className="flex-1 flex items-center justify-center gap-2 bg-white/10 text-white py-3 rounded-xl font-bold text-sm border border-white/20">
                  Close
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </section>
  );
}