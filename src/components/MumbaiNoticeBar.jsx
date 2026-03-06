import React from "react";
import { MapPin } from "lucide-react";

const MumbaiNoticeBar = () => {
  return (
    <div
      className="w-full py-3 px-4 sm:px-6 md:px-10 backdrop-blur-2xl bg-white/10 
                 border-b border-white/20 shadow-lg animate-fadeIn"
      style={{
        fontSize: "0.85rem",
        fontWeight: 300,
        letterSpacing: "0.06em",
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
      }}
    >
      {/* Luxurious Icon + Text - Centered */}
      <div className="flex items-center justify-center gap-2 text-black-100 text-center">
        <MapPin size={15} className="text-black-300 flex-shrink-0" />
        <span className="text-sm sm:text-base">
          Jeanzey currently delivers exclusively within{" "}
          <span className="text-black font-normal">Mumbai</span>.
          <span className="hidden sm:inline"> Experience handcrafted luxury for your city.</span>
        </span>
      </div>

      {/* Fade-in Animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MumbaiNoticeBar;