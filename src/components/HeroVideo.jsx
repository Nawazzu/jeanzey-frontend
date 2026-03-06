import React from 'react';

const HeroVideo = () => {

  // Handler function to scroll to LatestCollection section on the same page
  const handleExploreClick = () => {
    const latestCollectionSection = document.getElementById('latest-collection');
    if (latestCollectionSection) {
      // Calculate the position to scroll to
      const targetPosition = latestCollectionSection.offsetTop;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = 500; // Duration in milliseconds (1.5 seconds for slower scroll)
      let start = null;

      // Custom smooth scroll animation function
      const smoothScroll = (timestamp) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const percentage = Math.min(progress / duration, 1);
        
        // Easing function for smooth deceleration
        const easeInOutCubic = percentage < 0.5
          ? 4 * percentage * percentage * percentage
          : 1 - Math.pow(-2 * percentage + 2, 3) / 2;
        
        window.scrollTo(0, startPosition + distance * easeInOutCubic);
        
        if (progress < duration) {
          requestAnimationFrame(smoothScroll);
        }
      };

      requestAnimationFrame(smoothScroll);
    }
  };

  return (
    <section className="relative w-screen overflow-hidden -mx-4 sm:-mx-[5vw] md:-mx-[7vw] lg:-mx-[9vw] left-0" style={{ height: 'calc(100vh - 40px)' }}>
      {/* Fullscreen Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/videos/13.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4 z-10">
        {/* Title */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-wide mb-5 animate-fade-in-down">
          Capture the Moments
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-2xl text-gray-200 max-w-3xl mb-10 animate-fade-in">
          Premium Cameras, Lenses, and Bags for Creators Who Inspire
        </p>

        {/* CTA Button - Scrolls to LatestCollection section on click */}
        <button 
          onClick={handleExploreClick} // Trigger smooth scroll on button click
          className="px-10 py-4 bg-white text-black font-semibold rounded-full shadow-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300 animate-fade-in-delay"
        >
          Explore Now
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in-down {
          animation: fadeInDown 1.2s ease-out;
        }

        .animate-fade-in {
          animation: fadeIn 1.5s ease-out 0.5s backwards;
        }

        .animate-fade-in-delay {
          animation: fadeIn 1.5s ease-out 0.8s backwards;
        }
      `}</style>
    </section>
  );
};

export default HeroVideo;