import React, { useRef, useEffect } from "react";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Logo imports
import amazon from "../assets/amazon.png";
import sony from "../assets/sony.png";
import canon from "../assets/canon.png";
import nikon from "../assets/nikon.png";
import polaroid from "../assets/polaroid.png";

gsap.registerPlugin(ScrollTrigger);

const OurPolicy = () => {
  const companyLogos = [amazon, sony, canon, nikon, polaroid];
  
  // Refs for animation
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const marqueeRef = useRef(null);

  useEffect(() => {
    // Animate title - fade in from top
    gsap.from(titleRef.current, {
      opacity: 0,
      y: -50,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: titleRef.current,
        start: 'top 80%',
      },
    });

    // Animate subtitle - fade in with delay
    gsap.from(subtitleRef.current, {
      opacity: 0,
      y: 30,
      duration: 1.2,
      delay: 0.3,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: subtitleRef.current,
        start: 'top 80%',
      },
    });

    // Animate marquee container - scale in
    gsap.from(marqueeRef.current, {
      opacity: 0,
      scale: 0.95,
      duration: 1,
      delay: 0.5,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: marqueeRef.current,
        start: 'top 80%',
      },
    });
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Subtle decorative elements for premium feel */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gray-100 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gray-100 rounded-full blur-3xl opacity-30 pointer-events-none" />
      
      <style>{`
        .marquee-inner {
          animation: marqueeScroll 20s linear infinite;
        }

        @keyframes marqueeScroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        /* Pause animation on hover for better UX */
        .marquee-container:hover .marquee-inner {
          animation-play-state: paused;
        }
      `}</style>

      {/* Section Title - with animation ref */}
      <div className="text-center mb-16 px-4 relative z-10">
        <h2 
          ref={titleRef}
          className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight"
        >
          Trusted by Industry Leaders
        </h2>
        <p 
          ref={subtitleRef}
          className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
        >
          Partnering with world-renowned brands to deliver exceptional quality and innovation
        </p>
      </div>

      {/* Marquee Logo Section - with animation ref */}
      <div 
        ref={marqueeRef}
        className="overflow-hidden w-full relative max-w-7xl mx-auto select-none marquee-container"
      >
        {/* Left gradient fade */}
        <div className="absolute left-0 top-0 h-full w-32 z-10 pointer-events-none bg-gradient-to-r from-gray-50 via-gray-50/80 to-transparent" />
        
        {/* Marquee content */}
        <div className="marquee-inner flex will-change-transform min-w-[200%]">
          <div className="flex items-center">
            {[...companyLogos, ...companyLogos].map((logo, index) => (
              <div
                key={index}
                className="mx-12 sm:mx-16 flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:brightness-110"
              >
                <img
                  src={logo}
                  alt={`Brand-${index}`}
                  className="h-20 sm:h-24 object-contain filter grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Right gradient fade */}
        <div className="absolute right-0 top-0 h-full w-32 z-10 pointer-events-none bg-gradient-to-l from-gray-50 via-gray-50/80 to-transparent" />
      </div>

      {/* Premium trust indicator - NEW ADDITION */}
      <div className="text-center mt-16 px-4 relative z-10">
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-12 max-w-4xl mx-auto">
          <div className="flex flex-col items-center">
            <p className="text-3xl sm:text-4xl font-bold text-gray-900">10K+</p>
            <p className="text-sm text-gray-600 mt-1">Happy Customers</p>
          </div>
          <div className="hidden sm:block w-px h-12 bg-gray-300"></div>
          <div className="flex flex-col items-center">
            <p className="text-3xl sm:text-4xl font-bold text-gray-900">500+</p>
            <p className="text-sm text-gray-600 mt-1">Products Available</p>
          </div>
          <div className="hidden sm:block w-px h-12 bg-gray-300"></div>
          <div className="flex flex-col items-center">
            <p className="text-3xl sm:text-4xl font-bold text-gray-900">5★</p>
            <p className="text-sm text-gray-600 mt-1">Customer Rating</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurPolicy;