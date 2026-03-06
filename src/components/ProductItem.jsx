import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const ProductItem = ({ id, image, name, price }) => {
  const { currency, isInWishlist, toggleWishlist } = useContext(ShopContext);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [canHover, setCanHover] = useState(true);
  const liked = isInWishlist(id);

  useEffect(() => {
    setCanHover(window.matchMedia && window.matchMedia('(hover: hover)').matches);
  }, []);

  const handleMouseEnter = () => {
    if (canHover && image?.length > 1) {
      setIsHovered(true);
      setCurrentImageIndex(1);
    }
  };

  const handleMouseLeave = () => {
    if (canHover) {
      setIsHovered(false);
      setCurrentImageIndex(0);
    }
  };

  const handleTap = (e) => {
    if (!canHover && image?.length > 1) {
      e.preventDefault();
      setCurrentImageIndex((i) => (i === 0 ? 1 : 0));
      setTimeout(() => setCurrentImageIndex(0), 500);
    }
  };

  const getShareLinks = () => {
    const productUrl = `${window.location.origin}/product/${id}`;
    const productName = encodeURIComponent(name);
    return {
      whatsapp: `https://api.whatsapp.com/send?text=Check out this product: ${productName} - ${productUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,
      instagram: `https://www.instagram.com/?url=${encodeURIComponent(productUrl)}`,
    };
  };

  const { whatsapp, facebook, instagram } = getShareLinks();

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(id);
  };

  return (
    <div
      className="group block relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleTap}
      onTouchStart={handleTap}
    >
      {/* Product Image */}
      <Link to={`/product/${id}`} onClick={() => scrollTo(0, 0)}>
        <div className="relative overflow-hidden bg-gray-50 aspect-[3/4] mb-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-500">
          {image?.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={name}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${
                index === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
            />
          ))}

          {/* Heart Icon */}
          <button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 z-20 p-2 rounded-full border transition-all ${
              liked
                ? 'bg-black text-white border-black scale-110'
                : 'bg-white/90 text-gray-700 border-gray-200'
            } hover:scale-110`}
          >
            <Heart size={18} className={liked ? 'fill-white' : ''} />
          </button>

          {/* Overlay */}
          <div
            className={`absolute inset-0 bg-black transition-opacity duration-500 ${
              isHovered ? 'opacity-10' : 'opacity-0'
            }`}
          ></div>

          {/* Quick View Label */}
          <div
            className={`absolute inset-x-0 bottom-0 transition-all duration-500 ${
              isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            }`}
          >
            <div className="bg-white/95 backdrop-blur-sm py-2.5 text-center">
              <span className="text-xs font-medium tracking-widest uppercase text-gray-900">
                Quick View
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <Link to={`/product/${id}`} onClick={() => scrollTo(0, 0)}>
        <div className="text-center space-y-2 mb-3">
          <h3 className="text-sm font-medium text-gray-900 tracking-wide uppercase group-hover:text-gray-600 transition-colors duration-300 px-2">
            {name}
          </h3>
          <p className="text-sm font-light text-gray-600">
            {currency}
            {price}
          </p>
        </div>
      </Link>

      {/* Share Icons */}
      <div
        className={`flex justify-center gap-4 transition-all duration-500 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-gray-400 hover:text-green-600 transition-colors duration-300"
          title="Share on WhatsApp"
        >
          <i className="fab fa-whatsapp text-base"></i>
        </a>
        <a
          href={facebook}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-gray-400 hover:text-blue-600 transition-colors duration-300"
          title="Share on Facebook"
        >
          <i className="fab fa-facebook text-base"></i>
        </a>
        <a
          href={instagram}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-gray-400 hover:text-pink-500 transition-colors duration-300"
          title="Share on Instagram"
        >
          <i className="fab fa-instagram text-base"></i>
        </a>
      </div>
    </div>
  );
};

export default ProductItem;
