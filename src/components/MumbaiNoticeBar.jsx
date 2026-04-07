import React from "react";
import { MapPin } from "lucide-react";

const MumbaiNoticeBar = () => {
  return (
    <div
      className="w-full relative overflow-hidden border-b border-white/10"
      style={{
        background:
          "linear-gradient(90deg, rgba(0,0,0,0.75) 0%, rgba(20,20,20,0.85) 50%, rgba(0,0,0,0.75) 100%)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      {/* Subtle shine effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.25),transparent_60%)]" />

      {/* Content */}
      <div className="relative flex items-center justify-center gap-3 py-3 px-4 sm:px-6 md:px-10">
        
        {/* Icon */}
        <div className="flex items-center justify-center w-7 h-7 rounded-full border border-white/20 bg-white/5 backdrop-blur-md">
          <MapPin size={14} className="text-white/80" />
        </div>

        {/* Text */}
        <p className="text-[11px] sm:text-sm tracking-[0.25em] uppercase text-white/70 text-center leading-relaxed">
          We currently deliver exclusively within{" "}
          <span className="text-white font-medium tracking-[0.3em]">
            Mumbai
          </span>
          <span className="hidden sm:inline text-white/50">
            {" "}— Experience handcrafted luxury for your city
          </span>
        </p>
      </div>

      {/* Bottom subtle glow line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      {/* Animation */}
      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .relative {
          animation: fadeSlide 0.7s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MumbaiNoticeBar;