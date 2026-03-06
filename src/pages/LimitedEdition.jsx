import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/* ===============================
   PREMIUM LIMITED CONCEPT DROPS
================================ */
const drops = [
  {
    title: "Archive 001",
    subtitle: "The Origin Capsule",
    description:
      "The first chapter of our limited editions. Pure silhouettes, restrained detailing, and timeless construction — a reflection of our design DNA.",
    image: "/images/poster13.webp",
    tag: "Founders Edition",
    pieces: "25 Pieces Only",
  },
  {
    title: "Midnight Atelier",
    subtitle: "After Dark",
    description:
      "Designed for evenings that extend into the night. Deep tones, sharp tailoring, and an understated sense of drama.",
    image: "/images/poster14.webp",
    tag: "Ultra Limited",
    pieces: "15 Pieces Only",
  },
  {
    title: "Mumbai After Hours",
    subtitle: "City Series",
    description:
      "A modern interpretation of Mumbai's nocturnal energy — refined, unapologetic, and quietly powerful.",
    image: "/images/poster15.webp",
    tag: "City Exclusive",
    pieces: "30 Pieces Only",
  },
  {
    title: "Collectors Capsule",
    subtitle: "Rare Pieces",
    description:
      "Produced in extremely limited numbers. Designed for collectors who value rarity, precision, and permanence.",
    image: "/images/poster16.webp",
    tag: "Never Restocked",
    pieces: "10 Pieces Only",
  },
];

const LimitedEdition = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardsRef = useRef([]);
  const shimmerRef = useRef(null);

  /* ===============================
     ⏳ COUNTDOWN TIMER
  ================================ */
  const targetDate = new Date("2026-10-20T00:00:00");
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = targetDate - now;

      if (diff <= 0) return;

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /* ===============================
     ✨ GSAP MICRO-ANIMATIONS
  ================================ */
  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.4, ease: "power3.out" }
    );

    gsap.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1.2, delay: 0.3, ease: "power3.out" }
    );

    gsap.fromTo(
      cardsRef.current,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 1.3,
        delay: 0.6,
        ease: "power3.out",
      }
    );

    // Shimmer animation
    gsap.to(shimmerRef.current, {
      x: "200%",
      duration: 3,
      ease: "power2.inOut",
      repeat: -1,
      repeatDelay: 2,
    });
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white text-black overflow-hidden">

      {/* Luxury grain overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.04),_transparent_60%)]" />

      {/* Animated shimmer effect */}
      <div
        ref={shimmerRef}
        className="absolute top-0 left-0 w-[40%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full pointer-events-none"
      />

      {/* ================= HEADER ================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-12 text-center">
        {/* Luxury Badge */}
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-black/5 backdrop-blur-sm border border-black/10 rounded-full">
          <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
          <p className="uppercase tracking-[0.35em] text-[10px] text-black/70">
            Exclusively Curated
          </p>
        </div>

        <h1
          ref={titleRef}
          className="text-4xl sm:text-5xl md:text-7xl font-light tracking-tight mb-4"
        >
          Rare <span className="italic font-serif">Fits</span>
        </h1>

        <p
          ref={subtitleRef}
          className="mt-6 max-w-2xl mx-auto text-gray-600 text-base leading-relaxed font-light"
        >
          Masterfully crafted limited editions designed in vanishingly small quantities.
          <br className="hidden sm:block" />
          Once released, <span className="italic">never</span> repeated.
        </p>

        {/* Decorative separator */}
        <div className="flex items-center justify-center gap-3 mt-10">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-black/20" />
          <div className="w-1 h-1 bg-black/30 rounded-full" />
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-black/20" />
        </div>
      </div>

      {/* ================= COUNTDOWN ================= */}
      <div className="relative z-10 flex justify-center gap-6 text-center pb-16">
        {["days", "hours", "minutes", "seconds"].map((unit) => (
          <div
            key={unit}
            className="bg-white/80 backdrop-blur-xl border border-black/10 rounded-2xl px-6 py-5 min-w-[95px] shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-500"
          >
            <p className="text-3xl font-extralight tabular-nums">
              {timeLeft[unit] ?? "--"}
            </p>
            <p className="text-[9px] uppercase tracking-[0.3em] text-gray-500 mt-2 font-medium">
              {unit}
            </p>
          </div>
        ))}
      </div>

      {/* Production Number Badge */}
      <div className="relative z-10 text-center pb-8">
        <p className="inline-flex items-center gap-2 text-xs tracking-[0.25em] text-black/60 uppercase">
          <span className="w-6 h-px bg-black/20" />
          Total Production: 80 Pieces Worldwide
          <span className="w-6 h-px bg-black/20" />
        </p>
      </div>

      {/* ================= DROPS GRID ================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 grid grid-cols-1 md:grid-cols-2 gap-12">
        {drops.map((drop, index) => (
          <div
            key={index}
            ref={(el) => (cardsRef.current[index] = el)}
            className="group relative bg-white border border-black/10 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-2"
          >
            {/* Image */}
            <div className="relative h-[440px] overflow-hidden">
              <img
                src={drop.image}
                alt={drop.title}
                className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-[2500ms] ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

              {/* Tag */}
              <div className="absolute top-6 left-6 px-4 py-2 text-[10px] uppercase tracking-[0.3em] bg-white/95 backdrop-blur-md border border-black/10 rounded-full font-medium shadow-lg">
                {drop.tag}
              </div>

              {/* Limited Pieces Badge */}
              <div className="absolute top-6 right-6 px-4 py-2 text-[10px] uppercase tracking-[0.25em] bg-black/90 text-white backdrop-blur-md rounded-full font-light">
                {drop.pieces}
              </div>

              {/* Serial Number Watermark */}
              <div className="absolute bottom-6 left-6 text-white/40 text-xs font-mono tracking-wider">
                №{String(index + 1).padStart(2, '0')}/04
              </div>
            </div>

            {/* Content */}
            <div className="p-10">
              <p className="text-[11px] uppercase tracking-[0.3em] text-gray-500 mb-3 font-medium">
                {drop.subtitle}
              </p>
              <h3 className="text-2xl font-light tracking-wide mb-4 text-black">
                {drop.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-8 font-light">
                {drop.description}
              </p>

              {/* Dual CTAs */}
              <div className="flex items-center gap-4">
                <button className="group/btn relative inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-black font-medium">
                  <span className="relative">
                    Reserve Now
                    <span className="absolute left-0 -bottom-1 w-0 h-[1.5px] bg-black transition-all duration-500 group-hover/btn:w-full" />
                  </span>
                  <span className="opacity-60 group-hover/btn:translate-x-1 transition-transform duration-300">→</span>
                </button>

                <div className="w-px h-4 bg-black/10" />

                <button className="text-xs uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors duration-300">
                  Learn More
                </button>
              </div>
            </div>

            {/* Hover glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
            </div>
          </div>
        ))}
      </div>

      {/* ================= PREMIUM FEATURES BAR ================= */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="py-6">
            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center border border-black/10 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-sm uppercase tracking-[0.2em] mb-2 font-medium">Authenticated</h4>
            <p className="text-xs text-gray-600 leading-relaxed font-light">Certificate of authenticity with each piece</p>
          </div>

          <div className="py-6">
            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center border border-black/10 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-sm uppercase tracking-[0.2em] mb-2 font-medium">48-Hour Access</h4>
            <p className="text-xs text-gray-600 leading-relaxed font-light">Exclusive preview before public release</p>
          </div>

          <div className="py-6">
            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center border border-black/10 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h4 className="text-sm uppercase tracking-[0.2em] mb-2 font-medium">Gift Presentation</h4>
            <p className="text-xs text-gray-600 leading-relaxed font-light">Luxury packaging with personalized note</p>
          </div>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="relative z-10 text-center pb-28 px-6">
        <div className="inline-flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-black/20" />
            <p className="text-[10px] uppercase tracking-[0.35em] text-gray-500 font-light">
              Handcrafted in Mumbai • Numbered & Archived
            </p>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-black/20" />
          </div>

          {/* Luxury seal */}
          <div className="w-16 h-16 rounded-full border-2 border-black/10 flex items-center justify-center">
            <div className="text-[8px] uppercase tracking-widest text-black/40 text-center leading-tight">
              Limited<br/>Edition
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LimitedEdition;