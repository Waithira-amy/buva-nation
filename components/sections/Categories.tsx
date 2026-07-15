"use client";
import { useState, useRef } from "react";
import { Trophy, ArrowLeft, X, User, ChevronRight, Download, Share2, MousePointerClick, Award } from "lucide-react";
import { toPng } from "html-to-image";
import QRCode from "react-qr-code";
import Link from "next/link";

// Real YWCA Nominees Data
const categoriesData = [
  { 
    id: 1, 
    name: "Mr YWCA Nairobi Branch", 
    nominees: [
      "Stanley Stanix Ochieng", 
      "David Mbugua", 
      "Simon Benedict Nyamwange", 
      "Ronny Tonny", 
      "Benson Barack"
    ] 
  },
  { 
    id: 2, 
    name: "Miss YWCA Nairobi Branch", 
    nominees: [
      "Kuria Nancy Njambi", 
      "Ivon Njoki", 
      "Anne Wangeci", 
      "Darlin Imani", 
      "Phoebe Kyalo",
      "Grace Wambui Mungai", 
      "Dollar Mesaid Sharp", 
      "Shirley Valarie Achieng", 
      "Abigail Beline Otieno",
      "Christine Joy Mwangi", 
      "Christine Awino Ojuka", 
      "Muthoni Fidelis Nyambura", 
      "Leonora Oloo",
      "Joan Wanjiru Njeri", 
      "Mary Njoki Muchiri", 
      "Lisha Sophie", 
      "Amanda Jennifer Shahonya"
    ] 
  }
];

export default function Categories() {
  const [activeCategory, setActiveCategory] = useState<any>(null);
  const [selectedNominee, setSelectedNominee] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);

  // Generates the internal routing link for the "Click to Vote" button
  const getVoteUrl = () => {
    if (!activeCategory || !selectedNominee) return "";
    const categorySlug = encodeURIComponent(activeCategory.name.replace(/\s+/g, '-'));
    const nomineeSlug = encodeURIComponent(selectedNominee.replace(/\s+/g, '-'));
    return `/vote/${categorySlug}/${nomineeSlug}`;
  };

  // Generates the absolute URL for the QR Code and Share button
  const getAbsoluteShareUrl = () => {
    if (!activeCategory || !selectedNominee) return "";
    const categorySlug = encodeURIComponent(activeCategory.name.replace(/\s+/g, '-'));
    const nomineeSlug = encodeURIComponent(selectedNominee.replace(/\s+/g, '-'));
    return `https://buvanation.co.ke/vote/${categorySlug}/${nomineeSlug}`;
  };

  // Automatically converts a nominee's name into a lowercase, hyphenated filename 
  // e.g., "Stanley Stanix Ochieng" -> "stanley-stanix-ochieng"
  const getImageFileName = () => {
    if (!selectedNominee) return "";
    return selectedNominee
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleDownload = async () => {
    if (!posterRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(posterRef.current, {
        quality: 1,
        pixelRatio: 2,
        style: { backgroundColor: '#020617' }, // slate-950 background
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

  const handleShare = async () => {
    const shareData = {
      title: 'YWCA Awards by Buva Nation',
      text: `Vote for ${selectedNominee} for ${activeCategory?.name}!`,
      url: getAbsoluteShareUrl(),
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        alert("Share link copied to clipboard!");
      }
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  return (
    <section id="categories" className="py-24 relative border-t border-white/10 min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          {!activeCategory && (
            <span className="inline-block py-1 px-4 rounded-full bg-cyan-500/10 text-xs uppercase font-bold tracking-widest text-cyan-400 border border-cyan-500/30 mb-2 animate-in fade-in duration-500">
              Official Categories
            </span>
          )}
          <h2 className="font-serif text-4xl md:text-5xl font-bold mt-2 text-white animate-in fade-in duration-700">
            {activeCategory ? activeCategory.name : "Voting Categories"}
          </h2>
        </div>

        {!activeCategory && (
          <div className="grid grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto gap-6 animate-in slide-in-from-bottom-4 duration-500">
            {categoriesData.map((category) => (
              <div
                key={category.id}
                onClick={() => setActiveCategory(category)}
                className="group bg-slate-900 p-8 rounded-3xl border border-white/10 flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:border-cyan-500/50 hover:bg-slate-900/80 hover:-translate-y-1 cursor-pointer text-center shadow-xl"
              >
                <div className="p-4 bg-cyan-500/10 text-cyan-400 rounded-2xl group-hover:bg-cyan-500 group-hover:text-white transition-colors shadow-inner">
                  <Trophy className="w-8 h-8" />
                </div>
                <span className="text-xl font-bold text-white group-hover:text-cyan-400">
                  {category.name}
                </span>
                <span className="text-sm text-slate-400 font-medium">
                  {category.nominees.length} Nominees
                </span>
              </div>
            ))}
          </div>
        )}

        {activeCategory && (
          <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-8 duration-500">
            <button 
              onClick={() => setActiveCategory(null)}
              className="flex items-center gap-2 text-cyan-400 hover:text-white mb-8 text-sm font-bold tracking-wider uppercase bg-white/5 px-5 py-2.5 rounded-full border border-white/10 hover:border-white/30 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Categories
            </button>

            <div className="space-y-4">
              {activeCategory.nominees.map((nominee: string, index: number) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedNominee(nominee);
                    setImageError(false);
                  }}
                  className="w-full flex items-center justify-between bg-slate-900/80 border border-white/10 p-5 rounded-2xl hover:border-purple-500/50 hover:bg-slate-900 transition-all group shadow-lg"
                >
                  <span className="text-lg font-bold text-white group-hover:text-purple-400 text-left">{nominee}</span>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-purple-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selected Nominee Modal */}
        {selectedNominee && activeCategory && (
          <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-300">
            <div className="flex flex-col gap-4 w-full max-w-sm my-auto py-8">
              
              <div ref={posterRef} className="bg-slate-950 border border-white/10 rounded-3xl w-full relative overflow-hidden pb-6 shadow-[0_0_40px_rgba(6,182,212,0.15)] animate-in zoom-in-95 duration-300">
                
                {/* Close Button (Ignored in download) */}
                <button 
                  data-ignore="true"
                  onClick={() => setSelectedNominee(null)}
                  className="absolute top-4 right-4 z-20 bg-black/50 p-2 rounded-full text-white/50 hover:text-white border border-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Poster Header */}
                <div className="h-32 bg-gradient-to-br from-purple-900 to-amber-900 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-black/20" />
                  <span className="font-serif font-bold text-2xl text-white relative z-10 flex items-center gap-2">
                    YWCA <span className="text-amber-400">AWARDS</span>
                  </span>
                </div>

                {/* Poster Body */}
                <div className="p-8 pb-0 flex flex-col items-center text-center -mt-16 relative z-10">
                  
                  {/* Standard HTML Image Tag for flawless downloading */}
                  <div className="w-32 h-32 rounded-full bg-slate-900 border-4 border-cyan-400 flex items-center justify-center mb-5 shadow-2xl overflow-hidden relative">
                     <img 
                      src={imageError ? "/logo-icon.png" : `/nominees/${getImageFileName()}.jpg`} 
                      alt={selectedNominee} 
                      className={`w-full h-full ${imageError ? "object-contain p-4 opacity-50" : "object-cover"}`} 
                      onError={() => setImageError(true)} 
                    />
                  </div>
                  
                  <div className="inline-flex items-center gap-1.5 text-slate-900 font-bold text-[10px] tracking-widest uppercase mb-3 bg-cyan-400 px-3 py-1.5 rounded-full shadow-lg">
                    <Award className="w-3 h-3" /> Official Nominee
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-white mb-2 leading-tight">{selectedNominee}</h3>
                  <p className="text-purple-400 font-medium text-sm border-b border-white/10 pb-6 w-full">{activeCategory.name}</p>

                  <div className="mt-8 flex flex-col items-center w-full">
                    {/* QR Code wrapped in a Link for mobile tapping */}
                    <Link href={getVoteUrl()} className="bg-white p-2.5 rounded-2xl shadow-xl hover:scale-105 transition-transform cursor-pointer mb-3">
                      <QRCode value={getAbsoluteShareUrl()} size={96} level="H" />
                    </Link>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 mb-6 font-bold">Scan to Vote</p>
                    
                    {/* Explicit Vote Button (Ignored in download) */}
                    <Link 
                      href={getVoteUrl()}
                      data-ignore="true"
                      className="flex items-center justify-center w-full gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all"
                    >
                      <MousePointerClick className="w-5 h-5" /> Click Here to Vote
                    </Link>
                  </div>

                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 w-full animate-in slide-in-from-bottom-4 duration-500 delay-150">
                <button onClick={handleDownload} disabled={isDownloading} className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg transition-colors disabled:opacity-50">
                  <Download className="w-4 h-4" /> {isDownloading ? "Saving..." : "Save Poster"}
                </button>
                <button onClick={handleShare} className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-3.5 rounded-xl font-bold text-sm border border-white/20 shadow-lg transition-colors">
                  <Share2 className="w-4 h-4" /> Share Link
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </section>
  );
}