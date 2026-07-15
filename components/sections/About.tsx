"use client";
import { Target, Eye, CheckCircle2, Briefcase, Sparkles, HeartHandshake } from "lucide-react";

export default function About() {
  const buvaServices = [
    "Talent Management & Image Consulting",
    "Brand Ambassadors & Promotional Marketing",
    "Event Planning, Coordination & Staffing",
    "Photography & Videography Coverage",
    "Fashion Runway Coaching & Pageant Prep",
    "Video Vixens and Video Models",
    "VIP Hospitality & Guest Management",
    "Social Media Brand Promotion"
  ];

  return (
    <section id="about" className="relative py-24 bg-slate-950/80 backdrop-blur-md border-y border-white/5 overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-900/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-900/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* BUVA NATION DOMINANT SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 text-amber-500 font-bold tracking-[0.2em] uppercase text-xs mb-4">
            <Sparkles className="w-4 h-4" /> Who We Are
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-md">
            BUVA Nation Africa
          </h2>
          <p className="text-slate-300 leading-relaxed text-lg mb-4 font-medium">
            BUVA Nation is a dynamic talent management and creative agency committed to professionalism and creativity. We work towards developing, improving, empowering, and educating individuals into perfect brand ambassadors fit for the industry.
          </p>
        </div>

        {/* Mission & Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl hover:border-purple-500/50 transition duration-300">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-6 border border-purple-500/30">
              <Target className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-white mb-4">Our Mission</h3>
            <p className="text-slate-400 leading-relaxed">
              To be a leading academy and agency recognized for excellence in mentoring the young generation.
            </p>
          </div>
          
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl hover:border-amber-500/50 transition duration-300">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-6 border border-amber-500/30">
              <Eye className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-white mb-4">Our Vision</h3>
            <p className="text-slate-400 leading-relaxed">
              To empower individuals through professional training, recognize excellence through awards, and provide high-quality event coverage in collaboration with institutions.
            </p>
          </div>
        </div>

        {/* Services List */}
        <div className="mb-32">
          <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
            <Briefcase className="text-purple-500 w-6 h-6" />
            <h3 className="text-2xl font-bold text-white font-serif">Our Core Services</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {buvaServices.map((service, idx) => (
              <div key={idx} className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-start gap-3 hover:bg-white/10 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                <span className="text-sm text-slate-300 font-medium leading-snug">{service}</span>
              </div>
            ))}
          </div>
        </div>

        {/* YWCA PARTNERSHIP SECTION (Minimal) */}
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-purple-900/40 to-slate-900 border border-white/10 rounded-3xl p-8 md:p-12 text-center shadow-2xl">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 mb-6 border border-cyan-500/30">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-4">
            Partnering with YWCA Kenya
          </h3>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            Buva Nation proudly hosts the <strong className="text-white">Mr. & Miss YWCA Nairobi Branch Pageant</strong>. More than a talent competition, it is a powerful platform for advocacy, personal transformation, and community engagement. Together, we celebrate beauty with purpose and leadership with integrity.
          </p>
        </div>

      </div>
    </section>
  );
}