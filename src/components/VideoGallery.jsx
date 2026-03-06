import React, { useState } from "react";

const videos = {
  main: { src: "/videos/15.mp4", title: "The Essence of Elegance", subtitle: "Defining timeless beauty" },
  rightTop: { src: "/videos/16.mp4", title: "Runway Moments", subtitle: "Where fashion comes alive" },
  rightBottom: { src: "/videos/17.mp4", title: "Crafted in Motion", subtitle: "Artistry in every detail" },
};

const VideoGallery = () => {
  const [hoveredVideo, setHoveredVideo] = useState(null);

  return (
    <section className="relative w-full bg-black py-20 mb-20 overflow-hidden">
      {/* Animated grain texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")"
        }}>
      </div>

      {/* Subtle radial gradient accent */}
      <div className="absolute inset-0 bg-gradient-radial from-zinc-900/50 via-black to-black pointer-events-none"></div>

      {/* Section Title - More dramatic */}
      <div className="relative text-center mb-12 px-6">
        <div className="inline-block">
          <p className="text-zinc-400 text-xs tracking-[0.3em] uppercase mb-3 font-light">
            Cinematic Experience
          </p>
          <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] text-white tracking-tight font-bold leading-tight">
            Fashion Films
          </h2>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-[1px] w-12 bg-white/30"></div>
            <div className="h-1 w-1 rounded-full bg-white"></div>
            <div className="h-[1px] w-12 bg-white/30"></div>
          </div>
        </div>
        <p className="mt-6 text-zinc-400 text-sm md:text-base font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
          A seamless blend of movement, artistry, and couture expression
        </p>
      </div>

      {/* Video Grid Layout */}
      <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 sm:px-12 lg:px-20 items-stretch max-w-[1400px] mx-auto">
        {/* Left - Main Large Video */}
        <div
          onMouseEnter={() => setHoveredVideo('main')}
          onMouseLeave={() => setHoveredVideo(null)}
          className="relative lg:col-span-2 overflow-hidden rounded-none group cursor-pointer"
        >
          {/* Border frame effect */}
          <div className={`absolute inset-0 border-2 transition-all duration-700 z-10 pointer-events-none
            ${hoveredVideo === 'main' ? 'border-white/80 scale-[0.98]' : 'border-white/20 scale-100'}`}>
          </div>

          <video
            className={`w-full h-[350px] md:h-[450px] object-cover transition-all duration-1000 ease-out
              ${hoveredVideo === 'main' ? 'scale-110 brightness-110' : 'scale-100 brightness-90'}`}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src={videos.main.src} type="video/mp4" />
          </video>

          {/* Sophisticated overlay gradient */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent 
            transition-opacity duration-700
            ${hoveredVideo === 'main' ? 'opacity-60' : 'opacity-40'}`}>
          </div>

          {/* Vignette effect */}
          <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] pointer-events-none"></div>

          {/* Title with elegant animation */}
          <div className={`absolute bottom-0 left-0 right-0 p-8 transition-all duration-700
            ${hoveredVideo === 'main' ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-90'}`}>
            <div className="space-y-2">
              <h3 className="text-white text-2xl md:text-3xl font-['Playfair_Display'] font-bold tracking-wide">
                {videos.main.title}
              </h3>
              <p className="text-white/80 text-xs md:text-sm font-light tracking-widest uppercase">
                {videos.main.subtitle}
              </p>
              <div className={`h-[2px] bg-white transition-all duration-700 mt-3
                ${hoveredVideo === 'main' ? 'w-24' : 'w-12'}`}>
              </div>
            </div>
          </div>

          {/* Corner accent */}
          <div className={`absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 transition-all duration-700
            ${hoveredVideo === 'main' ? 'border-white opacity-100 scale-100' : 'border-white/40 opacity-0 scale-90'}`}>
          </div>
        </div>

        {/* Right - Two stacked videos */}
        <div className="flex flex-col gap-6">
          {[videos.rightTop, videos.rightBottom].map((vid, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredVideo(`right-${idx}`)}
              onMouseLeave={() => setHoveredVideo(null)}
              className="relative overflow-hidden rounded-none group flex-1 cursor-pointer"
            >
              {/* Border frame */}
              <div className={`absolute inset-0 border-2 transition-all duration-700 z-10 pointer-events-none
                ${hoveredVideo === `right-${idx}` ? 'border-white/80 scale-[0.96]' : 'border-white/20 scale-100'}`}>
              </div>

              <video
                className={`w-full h-[210px] md:h-[215px] object-cover transition-all duration-1000 ease-out
                  ${hoveredVideo === `right-${idx}` ? 'scale-110 brightness-110' : 'scale-100 brightness-90'}`}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              >
                <source src={vid.src} type="video/mp4" />
              </video>

              <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent
                transition-opacity duration-700
                ${hoveredVideo === `right-${idx}` ? 'opacity-60' : 'opacity-40'}`}>
              </div>

              {/* Vignette */}
              <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.4)] pointer-events-none"></div>

              <div className={`absolute bottom-0 left-0 right-0 p-5 transition-all duration-700
                ${hoveredVideo === `right-${idx}` ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-90'}`}>
                <h3 className="text-white text-lg md:text-xl font-['Playfair_Display'] font-bold tracking-wide">
                  {vid.title}
                </h3>
                <p className="text-white/70 text-xs font-light tracking-widest uppercase mt-1">
                  {vid.subtitle}
                </p>
                <div className={`h-[2px] bg-white transition-all duration-700 mt-2
                  ${hoveredVideo === `right-${idx}` ? 'w-16' : 'w-8'}`}>
                </div>
              </div>

              {/* Corner accent */}
              <div className={`absolute top-5 left-5 w-10 h-10 border-t-2 border-l-2 transition-all duration-700
                ${hoveredVideo === `right-${idx}` ? 'border-white opacity-100 scale-100' : 'border-white/40 opacity-0 scale-90'}`}>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="flex items-center justify-center gap-4 mt-20">
        <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-white/30"></div>
        <div className="flex gap-2">
          <div className="h-1 w-1 rounded-full bg-white/50"></div>
          <div className="h-1 w-1 rounded-full bg-white"></div>
          <div className="h-1 w-1 rounded-full bg-white/50"></div>
        </div>
        <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-white/30"></div>
      </div>
    </section>
  );
};

export default VideoGallery;