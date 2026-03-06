import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const Complimentary = () => {
  const cardsRef = useRef([]);
  const ribbonRef = useRef(null);
  const titleRef = useRef(null);
  const emojiRefs = useRef([]);

  useEffect(() => {
    gsap.fromTo(
      cardsRef.current,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.3,
        ease: "power3.out",
        delay: 0.5,
      }
    );

    gsap.to(ribbonRef.current, {
      x: 20,
      yoyo: true,
      repeat: -1,
      duration: 5,
      ease: "sine.inOut",
    });

    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.2 }
    );

    emojiRefs.current.forEach((el, index) => {
      gsap.to(el, {
        y: index % 2 === 0 ? -6 : 6,
        yoyo: true,
        repeat: -1,
        duration: 1.5 + Math.random(),
        ease: "sine.inOut",
      });
    });
  }, []);

  const gifts = [
    {
      id: 1,
      name: "Polaroid Snapshot",
      desc: "Capture your memories with this complimentary Polaroid — a little keepsake of your Jeanzey experience.",
      img: "/images/comp1.jpg",
    },
    {
      id: 2,
      name: "Crocket Bunny Keychain",
      desc: "A cute and charming bunny keychain — carry a touch of whimsy with every order.",
      img: "/images/comp2.jpg",
    },
    {
      id: 3,
      name: "Jeanzey Perfume",
      desc: "An exclusive mini perfume to add a luxurious fragrance to your day — our special gift for you.",
      img: "/images/comp3.jpg",
    },
  ];

  return (
    <section className="relative w-full bg-gradient-to-b from-white to-neutral-100 text-black py-28 flex flex-col items-center justify-center overflow-hidden">

      <div
        ref={ribbonRef}
        className="absolute top-16 left-1/2 -translate-x-1/2 w-[120%] sm:w-[90%] h-12
                   bg-gradient-to-r from-amber-300/30 via-amber-500/50 to-amber-300/30
                   rounded-full blur-3xl opacity-90 shadow-xl"
      ></div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <span
            key={i}
            className="absolute w-1.5 h-1.5 bg-amber-300/60 rounded-full blur-sm animate-ping"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${2 + Math.random() * 3}s`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          ></span>
        ))}
      </div>

      <p className="text-amber-700 font-semibold uppercase tracking-wider mb-4 text-sm sm:text-base">
        Complimentary Gift with Every Order
      </p>

      <h2
        ref={titleRef}
        className="text-4xl sm:text-5xl md:text-6xl font-bold text-center tracking-[2px] mb-8 flex items-center justify-center gap-4"
      >
        <span ref={(el) => (emojiRefs.current[0] = el)} className="text-pink-400">🎀</span>
        <span className="shimmer-metallic-broader">Surprises</span>
        <span ref={(el) => (emojiRefs.current[1] = el)} className="text-pink-400">🎀</span>
      </h2>

      <p className="text-gray-600 text-center mb-16 max-w-2xl px-6 leading-relaxed">
        Celebrate your order with our exclusive complimentary collection — designed to express elegance, gratitude, and the Jeanzey touch of luxury.
      </p>

      {/* 🎁 Gift Cards */}
      <div className="flex flex-wrap justify-center gap-10 px-6 max-w-6xl relative z-10">
        {gifts.map((gift, index) => (
          <div
            key={gift.id}
            ref={(el) => (cardsRef.current[index] = el)}
            className="relative group w-80 h-[420px]
                       bg-white/80 backdrop-blur-md 
                       border border-amber-100 rounded-3xl overflow-hidden
                       shadow-[0_0_20px_rgba(0,0,0,0.05)]
                       hover:shadow-[0_0_40px_rgba(255,215,150,0.4)]
                       transition-all duration-500 ease-out hover:scale-[1.03]"
          >
            <div className="h-2/3 overflow-hidden">

              {/* ✅ Optimized Image */}
              <picture>
                <source srcSet={gift.img.replace(".jpg", ".webp")} type="image/webp" />
                <img
                  src={gift.img}
                  alt={gift.name}
                  loading="lazy"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </picture>

            </div>

            <div className="p-6 text-center relative z-10">
              <h3 className="text-lg font-semibold text-amber-800 group-hover:text-amber-700 transition">
                {gift.name}
              </h3>
              <p className="text-gray-700 text-sm mt-2 leading-relaxed">
                {gift.desc}
              </p>
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none"></div>
          </div>
        ))}
      </div>

      <style>{`
        .shimmer-metallic-broader {
          position: relative;
          display: inline-block;
          color: #111;
          background: linear-gradient(
            90deg,
            #111 0%,
            #333 20%,
            #FFD700 50%,
            #333 80%,
            #111 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 200% 100%;
          animation: shimmer-metallic-broader 4s infinite;
        }

        @keyframes shimmer-metallic-broader {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </section>
  );
};

export default Complimentary;
