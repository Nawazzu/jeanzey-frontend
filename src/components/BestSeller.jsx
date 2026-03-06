import React, { useContext, useEffect, useRef, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LuxuryProductCard } from "./LatestCollection";

gsap.registerPlugin(ScrollTrigger);

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);
  const titleRef = useRef(null);
  const paragraphRef = useRef(null);

  useEffect(() => {
    const best = products.filter((item) => item.bestseller);
    setBestSeller(best.slice(0, 10));
  }, [products]);

  useEffect(() => {
    gsap.from(titleRef.current, {
      opacity: 0,
      x: -60,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: { trigger: titleRef.current, start: "top 85%" },
    });
    gsap.from(paragraphRef.current, {
      opacity: 0,
      x: 60,
      duration: 1.2,
      delay: 0.3,
      ease: "power3.out",
      scrollTrigger: { trigger: paragraphRef.current, start: "top 85%" },
    });
  }, []);

  return (
    <div
      id="best-seller"
      className="my-20 px-4 sm:px-8 lg:px-16 bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200"
    >
      {/* ── Premium Heading Block ── */}
      <div className="text-center py-12 max-w-4xl mx-auto">
        <div ref={titleRef}>
          {/* Eyebrow */}
          <p className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-black-400 font-medium mb-5">
            Customer Favourites
          </p>
          {/* Main heading */}
          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-[1.08] tracking-[-0.01em] text-gray-900"
            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
          >
            Best{" "}
            <em className="italic font-normal text-gray-500">Sellers</em>
          </h2>
          {/* Thin rule */}
          <div className="flex items-center justify-center gap-4 mt-6 mb-6">
            <div className="h-px w-16 bg-gray-300" />
            <div className="w-1 h-1 rounded-full bg-gray-400" />
            <div className="h-px w-16 bg-gray-300" />
          </div>
        </div>

        {/* Description */}
        <p
          ref={paragraphRef}
          className="text-sm sm:text-base md:text-lg text-gray-400 font-light leading-relaxed tracking-wide max-w-xl mx-auto"
          style={{ fontFamily: "'Jost', sans-serif" }}
        >
          Experience the pieces that define timeless elegance. Our Best Sellers
          reflect refined craftsmanship and luxurious comfort that set{" "}
          <span className="text-gray-600 font-medium tracking-widest uppercase text-xs">
            Jeanzey
          </span>{" "}
          apart.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-10 mt-12">
        {bestSeller.map((item) => (
          <LuxuryProductCard
            key={item._id}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default BestSeller;