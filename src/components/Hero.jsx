import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Truck, Clock } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const textRef = useRef(null);
  const imageRef = useRef(null);
  const badgeRef = useRef(null);

  useEffect(() => {
    // Animate the Mumbai badge
    gsap.from(badgeRef.current, {
      opacity: 0,
      y: -20,
      duration: 1.5,
      ease: 'power2.out',
      delay: 0.3,
    });

    // Animate the text section with smooth entrance
    gsap.from(textRef.current, {
      opacity: 0,
      x: -120,
      duration: 2.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: textRef.current,
        start: 'top 80%',
      },
    });

    // Animate the image section
    gsap.from(imageRef.current, {
      opacity: 0,
      x: 120,
      duration: 2.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: imageRef.current,
        start: 'top 80%',
      },
    });
  }, []);

  return (
    <div className='flex flex-col sm:flex-row border border-gray-200 mt-6 md:mt-8 bg-gradient-to-br from-stone-50 via-white to-stone-50 min-h-[450px] sm:min-h-[500px] md:min-h-[550px] lg:min-h-[600px] relative overflow-hidden'>
      {/* Mumbai Exclusive Badge */}
      <div ref={badgeRef} className='absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 z-20'>
        <div className='bg-amber-900 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm font-light tracking-wide'>
          <MapPin size={12} className='sm:w-3.5 sm:h-3.5 animate-pulse' />
          <span className='whitespace-nowrap'>Exclusively Serving <strong className='font-semibold'>Mumbai</strong></span>
        </div>
      </div>

      {/* Left: Text Section */}
      <div ref={textRef} 
           className='w-full sm:w-1/2 flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-10 py-10 sm:py-8 md:py-10 lg:py-12 relative'>
        {/* Corner Decoration - Hidden on very small screens */}
        <div className='hidden sm:block absolute top-4 left-4 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 border-t-2 border-l-2 border-amber-600/20'></div>
        
        <div className='text-[#2c2c2c] max-w-lg space-y-2.5 sm:space-y-3 relative z-10 w-full'>
          {/* Label Badge */}
          <div className='inline-block px-2.5 sm:px-3 py-1 border border-amber-700/30 text-amber-800 text-[9px] sm:text-[10px] tracking-[0.2em] uppercase mb-1 sm:mb-2'>
            Mumbai's Luxury Destination
          </div>
          
          {/* Main Heading */}
          <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light leading-tight tracking-wide'>
            <span className='italic font-serif'>Handcrafted Luxury</span>,<br className='hidden sm:block' />
            <span className='font-semibold'>Delivered to Your Doorstep</span>
          </h1>
          
          {/* Description */}
          <p className='text-[11px] sm:text-xs md:text-sm font-light text-gray-700 leading-relaxed tracking-wide'>
            Experience <strong className='font-medium text-amber-900'>bespoke fashion and refined accessories</strong> crafted with precision and delivered exclusively across Mumbai. From South Bombay to the Western Suburbs, we bring luxury to your home.
          </p>

          {/* Info Box */}
          <div className='bg-amber-50 border border-amber-200 rounded-lg p-2.5 sm:p-3 space-y-1.5 sm:space-y-2 mt-3 sm:mt-4'>
            <div className='flex items-start gap-2 text-[10px] sm:text-xs text-gray-700'>
              <Truck size={12} className='sm:w-3.5 sm:h-3.5 text-amber-700 mt-0.5 flex-shrink-0' />
              <span><strong className='font-medium'>Delivery</strong> across all Mumbai localities</span>
            </div>
            <div className='flex items-start gap-2 text-[10px] sm:text-xs text-gray-700'>
              <Clock size={12} className='sm:w-3.5 sm:h-3.5 text-amber-700 mt-0.5 flex-shrink-0' />
              <span><strong className='font-medium'>Swift Service</strong> – Delivered within 24-48 hours</span>
            </div>
            <div className='flex items-start gap-2 text-[10px] sm:text-xs text-gray-700'>
              <MapPin size={12} className='sm:w-3.5 sm:h-3.5 text-amber-700 mt-0.5 flex-shrink-0' />
              <span><strong className='font-medium'>Coverage:</strong> Across Mumbai, Navi-Mumbai, Thane</span>
            </div>
          </div>
          
          {/* Footer Badge */}
          <div className='flex items-center gap-2 sm:gap-3 pt-2'>
            <div className='h-px w-8 sm:w-10 bg-gradient-to-r from-amber-700 to-transparent'></div>
            <span className='text-[9px] sm:text-[10px] tracking-widest text-amber-800 uppercase'>Serving Mumbai Since 2024</span>
          </div>
        </div>
        
        {/* Corner Decoration - Hidden on very small screens */}
        <div className='hidden sm:block absolute bottom-4 right-4 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 border-b-2 border-r-2 border-amber-600/20'></div>
      </div>

      {/* Right: Image Section */}
      <div
        ref={imageRef}
        className='w-full sm:w-1/2 relative overflow-hidden group min-h-[300px] sm:min-h-full'
      >
        <picture>
          <source srcSet="/images/poster12.webp" type="image/webp" />
          <img
            src="/images/poster12.jpg"
            alt='Luxury Fashion Delivered in Mumbai'
            loading="eager"
            className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
          />
        </picture>

        {/* Gradient Overlay */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent'></div>
        
        {/* Bottom Badge */}
        <div className='absolute bottom-3 sm:bottom-4 right-3 sm:right-4 bg-white/90 backdrop-blur-sm px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg shadow-lg'>
          <p className='text-[10px] sm:text-xs font-light text-gray-800 tracking-wide flex items-center gap-1'>
            <MapPin size={11} className='sm:w-3 sm:h-3 text-amber-700' />
            Mumbai Exclusive
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;