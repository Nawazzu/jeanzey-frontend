import React from 'react';

const HeroReversed = () => {
  return (
    <div className="relative flex flex-col sm:flex-row w-full overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 bg-white mb-16
                    border border-white/20
                    before:absolute before:inset-0 before:border-2 before:border-amber-200/20 before:rounded-3xl before:pointer-events-none
                    after:absolute after:inset-1 after:border-2 after:border-white/10 after:rounded-3xl after:pointer-events-none">

      {/* Left Side - Image */}
      <div className="w-full sm:w-1/2 h-[320px] sm:h-[450px] flex items-center justify-center overflow-hidden rounded-l-3xl relative bg-gray-50">
        <img
          className="max-w-full max-h-full object-contain object-center transition-transform duration-700 ease-out hover:scale-105"
          src="/images/3.jpg"
          alt="Crochet Art Luxury Purse"
        />
        {/* Optional gradient overlay for luxury feel */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-black/5 pointer-events-none rounded-l-3xl"></div>
      </div>

      {/* Right Side - Text */}
      <div className="w-full sm:w-1/2 flex items-center justify-center p-8 sm:p-12 bg-gradient-to-tr from-white/80 via-white/90 to-white/80 backdrop-blur-sm rounded-r-3xl relative">
        <div className="text-center sm:text-left space-y-6 max-w-md">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-amber-800 tracking-wide leading-snug">
            Exquisite Crochet Art
          </h2>

          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            Discover artisanal crochet purses crafted with passion and precision. Each piece embodies elegance, luxury, and timeless craftsmanship — designed to elevate your style with a touch of artful sophistication.
          </p>

          <button className="mt-4 inline-block px-8 py-3 border border-amber-600 text-amber-700 text-sm sm:text-base font-medium tracking-wide rounded-lg hover:bg-amber-600 hover:text-white transition-all duration-500 shadow-sm hover:shadow-md">
            Explore the Collection
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroReversed;
