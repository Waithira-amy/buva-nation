import Image from "next/image";
import { Users } from "lucide-react";

const teamMembers = [
  {
    name: "Felix Orina",
    role: "Founder & CEO",
    image: "/team/felix.jpg" // Make sure to add this image to public/team/
  },
  {
    name: "Venus Almasi",
    role: "Executive Director",
    image: "/team/venus.jpg" // Make sure to add this image to public/team/
  }
];

export default function Team() {
  return (
    <section id="team" className="relative py-24 z-10 bg-slate-950/40">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 text-purple-500 font-bold tracking-[0.2em] uppercase text-xs">
            <Users className="w-4 h-4" /> The Leadership
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white drop-shadow-md">
            Meet The Team
          </h2>
          <p className="text-slate-400 text-sm mt-2">The visionaries driving Buva Nation forward.</p>
        </div>

        {/* Team Grid - Specifically 2 Columns for Felix & Venus */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 justify-center">
          {teamMembers.map((member, index) => (
            <div 
              key={index} 
              className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-10 flex flex-col items-center text-center shadow-2xl hover:border-amber-500/50 hover:bg-slate-900/80 transition-all duration-300 group"
            >
              {/* Photo Container */}
              <div className="relative w-48 h-48 mb-8 rounded-full overflow-hidden border-4 border-purple-500/30 group-hover:border-amber-500 transition-colors duration-300 shadow-inner bg-slate-800 flex items-center justify-center">
                {/* Fallback icon in case image is missing */}
                <Users className="w-12 h-12 text-slate-600 absolute" />
                <Image 
                  src={member.image} 
                  alt={member.name} 
                  fill 
                  sizes="192px"
                  className="object-cover object-top group-hover:scale-110 transition-transform duration-500 relative z-10"
                />
              </div>
              
              {/* Name & Role */}
              <h3 className="text-2xl font-bold text-white font-serif mb-3">
                {member.name}
              </h3>
              <div className="w-12 h-0.5 bg-gradient-to-r from-purple-500 to-amber-500 rounded-full mb-4"></div>
              <p className="text-amber-400 text-xs font-bold uppercase tracking-widest">
                {member.role}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}