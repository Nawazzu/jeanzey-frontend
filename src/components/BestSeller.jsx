import React, { useContext, useEffect, useRef, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
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
      <div className="text-center py-12 max-w-4xl mx-auto">
        <div ref={titleRef}>
          <Title text1={"BEST"} text2={"SELLERS"} />
        </div>
        <p
          ref={paragraphRef}
          className="mt-6 text-sm sm:text-base md:text-lg text-gray-500 font-light leading-relaxed tracking-wide"
        >
          Experience the pieces that define timeless elegance. Our Best Sellers
          reflect refined craftsmanship and luxurious comfort that set Jeanzey
          apart.
        </p>
        <div className="mt-8 w-24 h-px bg-gray-300 mx-auto" />
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
