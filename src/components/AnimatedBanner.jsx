import React from 'react';
import { Truck } from 'lucide-react';

const AnimatedBanner = () => {
  const deliveryText = "Delivery within 48 hours all over MUMBAI.";
  const repeatedText = Array(30).fill(deliveryText);

  return (
    <div className="relative w-full overflow-hidden bg-white mt-10">
      {/* Scrolling Content */}
      <div className="flex whitespace-nowrap animate-[scroll_5s_linear_infinite]">
        {repeatedText.map((text, index) => {
          const parts = text.split("MUMBAI");
          return (
            <div key={index} className="inline-flex items-center mx-12">
              <Truck className="w-5 h-5 text-black mr-3" />
              <span className="text-black text-base font-light tracking-[0.3em] uppercase">
                {parts[0]}
                <span className="font-semibold text-black">MUMBAI</span>
                {parts[1]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Keyframes for seamless continuous scrolling */}
      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}
      </style>
    </div>
  );
};

export default AnimatedBanner;
