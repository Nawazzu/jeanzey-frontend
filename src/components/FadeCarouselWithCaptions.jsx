import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const slides = [
  { 
    id: 1, 
    img: "/images/poster3.jpg",    
    title: 'Everyday Essentials', 
    subtitle: 'Modern essentials designed to fit your life — stylish, comfortable, and priced right.', 
  },
  { 
    id: 2, 
    img: "/images/poster4.jpg",     
    title: 'Future Classics', 
    subtitle: 'Timeless silhouettes reimagined for today’s generation.', 
  },
  { 
    id: 3, 
    img: "/images/poster5.jpg",  
    title: 'Wear the Confidence', 
    subtitle: 'Effortless pieces that move with you — bold in style, easy on your budget.', 
  },
];


const FadeCarouselLuxury = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const textRef = useRef(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (textRef.current) {
      gsap.to(textRef.current, {
        y: -80,
        ease: "none",
        scrollTrigger: {
          trigger: textRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    }
  }, [currentIndex]);

  const handleExploreClick = () => {
    const bestSellerSection = document.getElementById('best-seller');
    if (bestSellerSection) {
      const targetPosition = bestSellerSection.offsetTop;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden -mx-4 sm:-mx-[5vw] md:-mx-[7vw] lg:-mx-[9vw] mb-12">
      <AnimatePresence>
        <motion.div
          key={currentIndex}
          className="absolute w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        >
          {/* Background Image Optimized */}
          <picture>
            <source
              srcSet={slides[currentIndex].img.replace(".jpg", ".webp")}
              type="image/webp"
            />
            <img
              src={slides[currentIndex].img}
              alt={`Slide ${currentIndex + 1}`}
              loading="lazy"
              className="w-full h-full object-cover brightness-90"
            />
          </picture>

          {/* Premium Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/60 flex items-center justify-center text-center px-6">
            <div ref={textRef} className="text-white space-y-6 max-w-2xl">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-playfair uppercase tracking-widest drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
                {slides[currentIndex].title}
              </h1>
              <p className="text-sm sm:text-lg md:text-xl font-lora tracking-wide opacity-90 drop-shadow-md">
                {slides[currentIndex].subtitle}
              </p>
              <button 
                onClick={handleExploreClick}
                className="mt-6 px-10 py-3 uppercase tracking-widest rounded-full text-white text-sm sm:text-base font-semibold bg-white/10 backdrop-blur-lg shadow-lg border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-500 relative overflow-hidden before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-white/20 before:via-white/10 before:to-white/0 before:opacity-50 before:animate-[shine_2s_ease-in-out_infinite]">
                Discover Collection
              </button>
            </div>
          </div>

          {/* Subtle Shine Animation */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-20 animate-[shine_6s_ease-in-out_infinite]"></div>
        </motion.div>
      </AnimatePresence>

   <style>{`
  @keyframes shine {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`}</style>
    </div>
  );
};

export default FadeCarouselLuxury;
