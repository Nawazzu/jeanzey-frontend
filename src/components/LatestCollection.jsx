import React, { useContext, useEffect, useRef, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import Title from "./Title";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);
  const titleRef = useRef(null);
  const paragraphRef = useRef(null);

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  useEffect(() => {
    gsap.from(titleRef.current, {
      opacity: 0,
      y: -40,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: { trigger: titleRef.current, start: "top 85%" },
    });
    gsap.from(paragraphRef.current, {
      opacity: 0,
      y: 40,
      duration: 1.2,
      delay: 0.3,
      ease: "power3.out",
      scrollTrigger: { trigger: paragraphRef.current, start: "top 85%" },
    });
  }, []);

  return (
    <div id="latest-collection" className="my-20 px-4 sm:px-8 lg:px-16">
      <div className="text-center py-12 max-w-4xl mx-auto">
        <div ref={titleRef}>
          <Title text1={"LATEST"} text2={"COLLECTIONS"} />
        </div>
        <p
          ref={paragraphRef}
          className="mt-6 text-sm sm:text-base md:text-lg text-gray-500 font-light leading-relaxed tracking-wide"
        >
          Discover timeless sophistication in our Latest Collection. Each
          piece, crafted with precision, reflects refined luxury and modern
          artistry that defines Jeanzey.
        </p>
        <div className="mt-8 w-24 h-px bg-gray-300 mx-auto" />
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-10 mt-12">
        {latestProducts.map((item) => (
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

export const LuxuryProductCard = ({ id, image, name, price }) => {
  const { currency, isInWishlist, toggleWishlist, navigate } =
    useContext(ShopContext);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const liked = isInWishlist(id);
  const [isTapping, setIsTapping] = useState(false);

  const handleHover = (state) => {
    if (image?.length > 1) setCurrentImageIndex(state ? 1 : 0);
  };

  // ✅ Tap fix: allow combo product navigation while keeping preview
  const handleTap = (e) => {
    if (image?.length > 1 && !isTapping) {
      setIsTapping(true);
      setCurrentImageIndex((i) => (i === 0 ? 1 : 0));
      setTimeout(() => {
        setIsTapping(false);
        navigate(`/product/${id}`);
      }, 400);
    } else {
      navigate(`/product/${id}`);
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(id);
  };

  return (
    <div
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      onClick={handleTap}
      onTouchStart={handleTap}
      className="group block cursor-pointer"
    >
      <div className="relative overflow-hidden bg-[#f8f8f8] aspect-[3/4] rounded-2xl border border-gray-200 hover:border-gray-400 transition-all duration-500 shadow-sm hover:shadow-lg">
        {image?.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={name}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${
              i === currentImageIndex
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
          />
        ))}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 border ${
            liked
              ? "bg-black text-white border-black scale-110"
              : "bg-white text-gray-800 border-gray-200 hover:bg-black hover:text-white"
          }`}
        >
          <Heart size={18} className={liked ? "fill-white" : ""} />
        </button>
      </div>

      <div className="text-center mt-4 space-y-1">
        <h3 className="text-sm sm:text-base font-medium text-gray-900 tracking-wide uppercase group-hover:text-gray-600 transition-colors duration-300">
          {name}
        </h3>
        <p className="text-sm sm:text-base font-light text-gray-600">
          {currency}
          {price}
        </p>
      </div>
    </div>
  );
};

export default LatestCollection;
