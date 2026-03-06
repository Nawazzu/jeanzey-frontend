import React from "react";
import { useNavigate } from "react-router-dom";

const cards = [
  {
    id: 1,
    img: "/images/poster1.jpg",
    title: "Now in Style",
    subtitle: "Trends that speak today",
    button: "View All Products",
  },
  {
    id: 2,
    img: "/images/poster3.jpg",
    title: "Detail Defined",
    subtitle: "Timeless Collection, Crafted with purpose",
    button: "Shop Now",
  },
  {
    id: 3,
    img: "/images/poster2.jpg",
    title: "Urban Essentials",
    subtitle: "Minimal fits for modern streets",
    button: "Discover Now",
  },
];

const HoverTextCard = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-screen -mx-[calc((100vw-100%)/2)] left-0 right-0 py-20 bg-white overflow-hidden">
      {/* 🌟 Premium Heading */}
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-light leading-snug tracking-[0.08em] text-gray-900 prata-regular uppercase">
          Fashion isn't just what you wear — it's the language of  
          <br className="hidden md:block" />
          confidence, grace, and timeless individuality.
        </h2>
      </div>

      {/* 🖼️ Full Width 3-Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className="relative h-[480px] md:h-[600px] lg:h-[650px] overflow-hidden cursor-pointer"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            {/* Image — scale permanently applied */}
            <picture>
              <source srcSet={card.img.replace(".jpg", ".webp")} type="image/webp" />
              <img
                src={card.img}
                alt={card.title}
                loading="lazy"
                className="absolute w-full h-full object-cover scale-110"
              />
            </picture>

            {/* Overlay — permanent darker state */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Text Content — permanently shifted up */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6 translate-y-[-10px]">
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.15em] mb-3">
                {card.title}
              </h3>
              <p className="text-xs md:text-sm font-light tracking-[0.3em] uppercase mb-6 opacity-90">
                {card.subtitle}
              </p>
              {/* Button — permanently visible */}
              <button
                onClick={() => navigate("/collection")}
                className="border-2 border-white px-8 py-3 text-xs md:text-sm uppercase tracking-widest font-medium hover:bg-white hover:text-black transition-all duration-300"
              >
                {card.button}
              </button>
            </div>

            {/* Decorative Corners — permanently visible */}
            <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-white/40" />
            <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-white/40" />
          </div>
        ))}
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default HoverTextCard;