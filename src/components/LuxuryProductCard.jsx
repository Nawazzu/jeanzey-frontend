import React, { useContext, useState, useRef } from "react";
import { ShopContext } from "../context/ShopContext";
import { Heart } from "lucide-react";

const LuxuryProductCard = ({ id, image, name, price }) => {
  const { currency, isInWishlist, toggleWishlist, navigate } = useContext(ShopContext);
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
    if (dy > 8 || dx > 8) {
      touchMoved.current = true;
    }
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
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={() => navigate(`/product/${id}`)}
      className="group block cursor-pointer"
      style={{ touchAction: "pan-y" }}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-[#f9f9f9] aspect-[4/5] rounded-2xl border border-gray-200 hover:border-gray-400 transition-all duration-500 shadow-md hover:shadow-2xl">
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

        {/* Heart Icon */}
        <button
          onTouchStart={(e) => { e.stopPropagation(); wishlistTapped.current = true; }}
          onClick={handleWishlist}
          className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-300 border ${
            liked
              ? "bg-black text-white border-black scale-110"
              : "bg-white text-gray-800 border-gray-200 hover:bg-black hover:text-white"
          }`}
        >
          <Heart size={20} className={liked ? "fill-white" : ""} />
        </button>
      </div>

      {/* Product Details */}
      <div className="text-center mt-5 space-y-2">
        <h3 className="text-base sm:text-lg font-medium text-gray-900 tracking-wide uppercase group-hover:text-gray-600 transition-colors duration-300">
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

export default LuxuryProductCard;