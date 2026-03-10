import React, { useContext, useEffect, useRef, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
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
      {/* ── Premium Heading Block ── */}
      <div className="text-center py-12 max-w-4xl mx-auto">
        <div ref={titleRef}>
          {/* Eyebrow */}
          <p className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-gray-400 font-medium mb-5">
            New Arrivals
          </p>
          {/* Main heading */}
          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-[1.08] tracking-[-0.01em] text-gray-900"
            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
          >
            Latest{" "}
            <em className="italic font-normal text-gray-500">Collections</em>
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
          Discover timeless sophistication in our Latest Collection. Each
          piece, crafted with precision, reflects refined luxury and modern
          artistry that defines{" "}
          <span className="text-gray-600 font-medium tracking-widest uppercase text-xs">
            Jeanzey
          </span>
          .
        </p>
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

  // ── Touch tracking ──
  const touchStartY = useRef(null);
  const touchStartX = useRef(null);
  const touchMoved = useRef(false);
  const wishlistTapped = useRef(false);

  // Hover image swap — desktop only (mouse events)
  const handleHover = (state) => {
    if (image?.length > 1) setCurrentImageIndex(state ? 1 : 0);
  };

  const handleClick = () => {
    navigate(`/product/${id}`);
  };

  const handleTouchStart = (e) => {
    wishlistTapped.current = false;
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
    touchMoved.current = false;
  };

  const handleTouchMove = (e) => {
    if (touchStartY.current === null) return;
    const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
    const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
    if (dy > 8 || dx > 8) touchMoved.current = true;
  };

  const handleTouchEnd = (e) => {
    // Heart was tapped — skip navigation, wishlist already toggled
    if (wishlistTapped.current) {
      wishlistTapped.current = false;
      touchStartY.current = null;
      touchStartX.current = null;
      touchMoved.current = false;
      return;
    }
    // Clean tap (not a scroll) — always navigate
    if (!touchMoved.current) {
      navigate(`/product/${id}`);
    }
    touchStartY.current = null;
    touchStartX.current = null;
    touchMoved.current = false;
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    wishlistTapped.current = true;
    toggleWishlist(id);
  };

  return (
    <div
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="group block cursor-pointer"
      style={{ touchAction: "pan-y" }}
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
          onTouchStart={(e) => { e.stopPropagation(); wishlistTapped.current = true; }}
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
          {currency}{price}
        </p>
      </div>
    </div>
  );
};

export default LatestCollection;