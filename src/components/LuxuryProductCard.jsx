import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const LuxuryProductCard = ({ id, image, name, price }) => {
  const { currency, isInWishlist, toggleWishlist } = useContext(ShopContext);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const liked = isInWishlist(id);

  const handleHover = (state) => {
    if (image?.length > 1) setCurrentImageIndex(state ? 1 : 0);
  };

  const handleTap = (e) => {
    if (image?.length > 1) {
      e.preventDefault();
      setCurrentImageIndex((i) => (i === 0 ? 1 : 0));
      setTimeout(() => setCurrentImageIndex(0), 600);
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(id);
  };

  return (
    <Link
      to={`/product/${id}`}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      onClick={handleTap}
      onTouchStart={handleTap}
      className="group block cursor-pointer"
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
    </Link>
  );
};

export default LuxuryProductCard;
