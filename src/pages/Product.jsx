import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import RelatedProducts from "../components/RelatedProducts";
import ReviewCard from "../components/ReviewCard";
import { ArrowLeft, Star, MessageSquare, Ruler, Heart, X } from "lucide-react";
import axios from "axios";
import SkeletonProductPage from "../components/SkeletonProductPage";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Add custom scrollbar styles and animations
const scrollbarStyles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .product-ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    pointer-events: none;
    animation: product-ripple-animation 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    z-index: 5;
  }
  
  @keyframes product-ripple-animation {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
    100% {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  .product-heart-burst {
    animation: product-heart-burst 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
    transform-origin: center !important;
  }
  
  @keyframes product-heart-burst {
    0% { 
      transform: scale(1) rotate(0deg); 
    }
    25% { 
      transform: scale(1.5) rotate(12deg); 
    }
    50% { 
      transform: scale(1.3) rotate(-12deg); 
    }
    75% { 
      transform: scale(1.4) rotate(6deg); 
    }
    100% { 
      transform: scale(1) rotate(0deg); 
    }
  }
  
  .product-fly-to-cart {
    animation: product-fly 1s ease-out forwards;
  }
  
  @keyframes product-fly {
    0% {
      transform: translate(0, 0) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate(300px, -300px) scale(0.3);
      opacity: 0;
    }
  }

  /* ✅ Glassy mirror B&W badge styles */
  .stock-badge-instock {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 16px;
    border-radius: 999px;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    background: linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(220,220,220,0.6) 100%);
    border: 1px solid rgba(0,0,0,0.15);
    color: #111;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 8px rgba(0,0,0,0.08);
  }
  .stock-badge-low {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 16px;
    border-radius: 999px;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    background: linear-gradient(135deg, rgba(30,30,30,0.92) 0%, rgba(60,60,60,0.85) 100%);
    border: 1px solid rgba(255,255,255,0.15);
    color: #fff;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 2px 12px rgba(0,0,0,0.25);
    animation: stock-pulse 2s ease-in-out infinite;
  }
  .stock-badge-outofstock {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 16px;
    border-radius: 999px;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    background: linear-gradient(135deg, rgba(240,240,240,0.9) 0%, rgba(200,200,200,0.7) 100%);
    border: 1px solid rgba(0,0,0,0.2);
    color: #555;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.8), 0 1px 4px rgba(0,0,0,0.06);
  }
  @keyframes stock-pulse {
    0%, 100% { box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 2px 12px rgba(0,0,0,0.25); }
    50% { box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 4px 20px rgba(0,0,0,0.4); }
  }
  .stock-dot-in {
    width: 7px; height: 7px; border-radius: 50%;
    background: #222;
    box-shadow: 0 0 0 2px rgba(0,0,0,0.08);
  }
  .stock-dot-low {
    width: 7px; height: 7px; border-radius: 50%;
    background: #fff;
    box-shadow: 0 0 0 2px rgba(255,255,255,0.2);
  }
  .stock-dot-out {
    width: 7px; height: 7px; border-radius: 50%;
    background: #aaa;
  }
  /* Per-size sold out / low label */
  .size-sold-out-label {
    font-size: 0.65rem;
    font-weight: 600;
    color: #999;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .size-low-label {
    font-size: 0.65rem;
    font-weight: 700;
    color: #111;
    letter-spacing: 0.04em;
    background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(220,220,220,0.7));
    border: 1px solid rgba(0,0,0,0.12);
    padding: 1px 6px;
    border-radius: 999px;
    backdrop-filter: blur(4px);
  }
`;

// Inject styles only once
if (typeof document !== 'undefined' && !document.getElementById('product-page-styles')) {
  const style = document.createElement('style');
  style.id = 'product-page-styles';
  style.textContent = scrollbarStyles;
  document.head.appendChild(style);
}

const sizeData = {
  men: {
    tshirt: [
      { size: "S", chest: "36-38", length: "28" },
      { size: "M", chest: "38-40", length: "29" },
      { size: "L", chest: "40-42", length: "30" },
      { size: "XL", chest: "42-44", length: "31" },
    ],
    shirt: [
      { size: "S", chest: "37-39", sleeve: "24", length: "29" },
      { size: "M", chest: "39-41", sleeve: "25", length: "30" },
      { size: "L", chest: "41-43", sleeve: "26", length: "31" },
      { size: "XL", chest: "43-45", sleeve: "27", length: "32" },
    ],
    jeans: [
      { size: "28", waist: "28", hip: "36", rise: "12", inseam: "30", thigh: "22", legOpening: "16" },
      { size: "30", waist: "30", hip: "38", rise: "12", inseam: "32", thigh: "23", legOpening: "17" },
      { size: "32", waist: "32", hip: "40", rise: "12", inseam: "32", thigh: "24", legOpening: "18" },
      { size: "34", waist: "34", hip: "42", rise: "13", inseam: "34", thigh: "25", legOpening: "19" },
    ],
    combo: [
      { size: "S", chest: "36-38", waist: "28-30", length: "28" },
      { size: "M", chest: "38-40", waist: "30-32", length: "29" },
      { size: "L", chest: "40-42", waist: "32-34", length: "30" },
      { size: "XL", chest: "42-44", waist: "34-36", length: "31" },
    ],
  },
  women: {
    tshirt: [
      { size: "XS", bust: "32-34", length: "25" },
      { size: "S", bust: "34-36", length: "26" },
      { size: "M", bust: "36-38", length: "27" },
      { size: "L", bust: "38-40", length: "28" },
    ],
    shirt: [
      { size: "XS", bust: "33-35", sleeve: "23", length: "25" },
      { size: "S", bust: "35-37", sleeve: "24", length: "26" },
      { size: "M", bust: "37-39", sleeve: "25", length: "27" },
      { size: "L", bust: "39-41", sleeve: "26", length: "28" },
    ],
    jeans: [
      { size: "24", waist: "24", hip: "34", rise: "10", inseam: "30", thigh: "20", legOpening: "14" },
      { size: "26", waist: "26", hip: "36", rise: "10", inseam: "31", thigh: "21", legOpening: "15" },
      { size: "28", waist: "28", hip: "38", rise: "11", inseam: "32", thigh: "22", legOpening: "16" },
      { size: "30", waist: "30", hip: "40", rise: "11", inseam: "33", thigh: "23", legOpening: "17" },
    ],
    combo: [
      { size: "XS", bust: "32-34", waist: "24-26", length: "25" },
      { size: "S", bust: "34-36", waist: "26-28", length: "26" },
      { size: "M", bust: "36-38", waist: "28-30", length: "27" },
      { size: "L", bust: "38-40", waist: "30-32", length: "28" },
    ],
  },
};

const Product = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const {
    products,
    currency,
    addToCart,
    backendUrl,
    token,
    userData,
    toggleWishlist,
    isInWishlist,
    glassToast,
  } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [selectedGender, setSelectedGender] = useState("men");
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [flyingToCart, setFlyingToCart] = useState(false);
  const [ripples, setRipples] = useState([]);
  const [heartBurst, setHeartBurst] = useState(false);

  // Fetch product details
  useEffect(() => {
    const foundProduct = products.find((item) => item._id === productId);
    if (foundProduct) {
      setProductData(foundProduct);
      setImage(foundProduct.image[0]);
    }
  }, [productId, products]);

  // Handle image zoom on mouse move or touch
  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    
    // Support both mouse and touch events
    const clientX = e.clientX !== undefined ? e.clientX : e.touches?.[0]?.clientX;
    const clientY = e.clientY !== undefined ? e.clientY : e.touches?.[0]?.clientY;
    
    if (clientX === undefined || clientY === undefined) return;
    
    const x = ((clientX - left) / width) * 100;
    const y = ((clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  // Handle touch start for mobile zoom
  const handleTouchStart = () => {
    setIsZoomed(true);
  };

  // Handle touch end for mobile zoom
  const handleTouchEnd = () => {
    setIsZoomed(false);
  };

  // Handle image navigation
  const handlePrevImage = (e) => {
    e.stopPropagation();
    if (!productData || !productData.image || productData.image.length === 0) return;
    const currentIndex = productData.image.indexOf(image);
    const prevIndex = currentIndex === 0 ? productData.image.length - 1 : currentIndex - 1;
    setImage(productData.image[prevIndex]);
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    if (!productData || !productData.image || productData.image.length === 0) return;
    const currentIndex = productData.image.indexOf(image);
    const nextIndex = currentIndex === productData.image.length - 1 ? 0 : currentIndex + 1;
    setImage(productData.image[nextIndex]);
  };

  const sizeCategories = ["shirt", "jeans", "combo", "tshirt"];
  const isSizeSelectable =
    productData && sizeCategories.includes(productData.category?.toLowerCase());

  // ✅ Stock helpers — defined AFTER isSizeSelectable, uses actual size value as key
  const getStockForSize = (s) => {
    if (!productData) return 0;
    if (typeof productData.stock === 'object' && productData.stock !== null) {
      return Number(productData.stock[String(s)]) || 0;
    }
    return Number(productData.stock) || 0;
  };

  const getTotalStock = () => {
    if (!productData) return 0;
    if (typeof productData.stock === 'object' && productData.stock !== null) {
      return Object.values(productData.stock).reduce((sum, v) => sum + (Number(v) || 0), 0);
    }
    return Number(productData.stock) || 0;
  };

  // If a size is selected show that size's stock, else show total
  const currentStock = (isSizeSelectable && size) ? getStockForSize(size) : getTotalStock();
  const isOutOfStock = currentStock === 0;
  const isLowStock = currentStock > 0 && currentStock <= 5;

  // Fetch reviews
  const fetchReviews = async () => {
    if (!productId || !backendUrl) return;
    try {
      setLoadingReviews(true);
      const res = await axios.get(`${backendUrl}/api/review/product/${productId}`);
      if (res.data.success) {
        const formatted = res.data.reviews.map((r) => ({
          ...r,
          createdAtFormatted: r.createdAt
            ? new Date(r.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "—",
        }));
        setReviews(formatted);
      } else setReviews([]);
    } catch {
      glassToast("Failed to load reviews", "error");
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  // Submit Review
  const submitReview = async () => {
    if (!newReview.trim()) {
      glassToast("Please write a review before submitting.", "error");
      return;
    }
    if (!productId) return;

    try {
      const payload = {
        productId,
        name: userData?.name || "Anonymous Customer",
        rating,
        comment: newReview.trim(),
      };

      const res = await axios.post(`${backendUrl}/api/review/add`, payload, {
        headers: token ? { token } : {},
      });

      if (res.data.success) {
        const newRev = {
          ...res.data.review,
          name: payload.name,
          createdAtFormatted: new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        };
        setReviews((prev) => [newRev, ...prev]);
        setNewReview("");
        setRating(5);
        glassToast("Thanks — your review has been posted.", "success");
      } else {
        glassToast(res.data.message || "Failed to post review", "error");
      }
    } catch (err) {
      glassToast(err.response?.data?.message || "Failed to post review", "error");
    }
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
      : null;

  // Get category for size guide
  const getCategoryForSizeGuide = () => {
    if (!productData) return null;
    const cat = productData.category?.toLowerCase();
    if (cat === "tshirt") return "tshirt";
    if (cat === "shirt") return "shirt";
    if (cat === "jeans") return "jeans";
    if (cat === "combo") return "combo";
    return null;
  };

  // Get size details for selected size
  const getSizeDetails = () => {
    if (!productData || !size) return null;
    
    const category = getCategoryForSizeGuide();
    if (!category) return null;

    const gender = selectedGender;
    const categoryData = sizeData[gender]?.[category];
    if (!categoryData) return null;

    const sizeInfo = categoryData.find(item => item.size === size);
    return sizeInfo;
  };

  // Format size details for display
  const formatSizeDetails = (details) => {
    if (!details) return [];
    
    const category = productData.category?.toLowerCase();
    const formatted = [];

    if (category === "jeans") {
      if (details.rise) formatted.push({ label: "RISE", value: details.rise });
      if (details.inseam) formatted.push({ label: "LENGTH", value: details.inseam });
      if (details.thigh) formatted.push({ label: "THIGHS", value: details.thigh });
      if (details.legOpening) formatted.push({ label: "LEG OPENING", value: details.legOpening });
    } else if (category === "tshirt") {
      if (details.chest || details.bust) formatted.push({ label: "CHEST", value: details.chest || details.bust });
      if (details.length) formatted.push({ label: "LENGTH", value: details.length });
    } else if (category === "shirt") {
      if (details.chest || details.bust) formatted.push({ label: "CHEST", value: details.chest || details.bust });
      if (details.sleeve) formatted.push({ label: "SLEEVE", value: details.sleeve });
      if (details.length) formatted.push({ label: "LENGTH", value: details.length });
    } else if (category === "combo") {
      if (details.chest || details.bust) formatted.push({ label: "CHEST", value: details.chest || details.bust });
      if (details.waist) formatted.push({ label: "WAIST", value: details.waist });
      if (details.length) formatted.push({ label: "LENGTH", value: details.length });
    }

    return formatted;
  };

  // Ripple effect handler - supports both mouse and touch
  const createRipple = (event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    // Support both mouse and touch events
    const clientX = event.clientX !== undefined ? event.clientX : event.touches?.[0]?.clientX || event.changedTouches?.[0]?.clientX;
    const clientY = event.clientY !== undefined ? event.clientY : event.touches?.[0]?.clientY || event.changedTouches?.[0]?.clientY;
    
    if (clientX === undefined || clientY === undefined) return;
    
    const x = clientX - rect.left - size / 2;
    const y = clientY - rect.top - size / 2;
    
    const newRipple = { x, y, size, id: Date.now() };
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 700);
  };

  // Handle Add to Cart with Toast and Animation
  const handleAddToCart = (e) => {
    // Only create ripple if it's a click event (not touch, which is handled separately)
    if (e.type === 'click') {
      createRipple(e);
    }
    
    if (isSizeSelectable && !size) {
      glassToast("Please select a size before adding to cart.", "info");
      return;
    }
    
    // Trigger fly-to-cart animation
    setFlyingToCart(true);
    setTimeout(() => setFlyingToCart(false), 1000);
    
    addToCart(productData._id, isSizeSelectable ? size : null);
  };

  // Handle touch start for ripple on mobile
  const handleAddToCartTouchStart = (e) => {
    createRipple(e);
  };

  // Handle wishlist toggle with burst animation
  const handleWishlistToggle = () => {
    setHeartBurst(true);
    setTimeout(() => setHeartBurst(false), 600);
    toggleWishlist(productData._id);
  };

  // Get available sizes for the product
  const getAvailableSizes = () => {
    const category = getCategoryForSizeGuide();
    if (!category) return ["S", "M", "L", "XL"];
    
    const categoryData = sizeData[selectedGender]?.[category];
    if (!categoryData) return ["S", "M", "L", "XL"];
    
    return categoryData.map(item => item.size);
  };

  const sizeDetails = getSizeDetails();
  const formattedDetails = formatSizeDetails(sizeDetails);

  return productData ? (
    <div className="bg-white text-gray-900 min-h-screen border-t border-gray-200 px-4 md:px-10 lg:px-16">
      
      <div className="flex justify-start pt-16 mb-8">
        <button
          onClick={() => navigate("/collection")}
          className="flex items-center gap-2 text-gray-700 hover:text-black transition-all duration-300 text-sm sm:text-base md:text-lg font-medium tracking-wide group"
        >
          <ArrowLeft
            className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 group-hover:-translate-x-1 transition-transform duration-300"
            strokeWidth={1.5}
          />
          <span className="uppercase text-xs sm:text-sm md:text-base tracking-widest">
            Back to Collection
          </span>
        </button>
      </div>

      {/* Product Section */}
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Images */}
        <div className="flex-1 flex flex-col-reverse gap-4 sm:flex-row relative">
          {/* Thumbnails */}
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll sm:w-[18%] w-full gap-3 scrollbar-hide">
            {productData.image.map((item, index) => (
              <img
                key={index}
                src={item}
                onClick={() => setImage(item)}
                alt={productData.name}
                className={`cursor-pointer rounded-xl border transition-all duration-300 object-cover w-[90px] h-[90px] sm:w-full sm:h-[130px] ${
                  image === item
                    ? "border-black scale-[1.05] shadow-lg"
                    : "border-gray-200 hover:opacity-80 hover:border-gray-400"
                }`}
              />
            ))}
          </div>

          {/* Main Image + Wishlist + Navigation */}
          <div 
            className="w-full sm:w-[80%] rounded-2xl overflow-hidden bg-gray-50 shadow-2xl relative group cursor-crosshair"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative h-[600px] sm:h-[700px] overflow-hidden">
              <img
                src={image}
                alt={productData.name}
                className="w-full h-full object-cover transition-transform duration-300"
                style={{
                  transform: isZoomed ? `scale(2.5)` : 'scale(1)',
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }}
              />
            </div>

            {/* Flying to cart animation */}
            {flyingToCart && (
              <motion.img
                src={image}
                alt="Flying to cart"
                className="absolute top-1/2 left-1/2 w-20 h-20 object-cover rounded-lg z-30 product-fly-to-cart pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            )}

            {/* Wishlist Icon */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={handleWishlistToggle}
              className={`absolute top-5 right-5 z-20 p-3 rounded-full shadow-lg transition-all duration-300 ${
                isInWishlist(productData._id)
                  ? "bg-black text-white border border-black"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-black hover:text-white"
              }`}
              title={
                isInWishlist(productData._id)
                  ? "Remove from Wishlist"
                  : "Add to Wishlist"
              }
            >
              <Heart
                size={20}
                className={`${
                  isInWishlist(productData._id) ? "fill-white" : "fill-none"
                } ${heartBurst ? "product-heart-burst" : ""}`}
              />
            </motion.button>

            {/* Navigation Arrows - Always Visible if Multiple Images */}
            {productData?.image?.length > 1 && (
              <>
                {/* Left Arrow */}
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  title="Previous Image"
                >
                  <svg 
                    width="40" 
                    height="40" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#000000" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                  >
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </motion.button>

                {/* Right Arrow */}
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  title="Next Image"
                >
                  <svg 
                    width="40" 
                    height="40" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#000000" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </motion.button>
              </>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 space-y-8">
          <div>
            <h1 className="font-semibold text-4xl tracking-tight text-gray-900">
              {productData.name}
            </h1>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1">
                {averageRating && (
                  <>
                    <span className="text-yellow-500 text-sm font-medium">
                      {averageRating}
                    </span>
                    <span className="text-gray-400 text-sm">•</span>
                  </>
                )}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Math.round(averageRating || 0)
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
              </div>
              <div className="text-sm text-gray-500">{reviews.length} reviews</div>
            </div>
          </div>

          <p className="text-4xl font-bold text-gray-800">
            {currency}
            {productData.price}
          </p>

          {/* ✅ STOCK BADGE — Glassy mirror B&W */}
          <div className="flex items-center gap-3 flex-wrap">
            {isOutOfStock ? (
              <span className="stock-badge-outofstock">
                <span className="stock-dot-out"></span>
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="stock-badge-low">
                <span className="stock-dot-low"></span>
                Only {currentStock} Left!
              </span>
            ) : (
              <span className="stock-badge-instock">
                <span className="stock-dot-in"></span>
                In Stock
              </span>
            )}
          </div>

          <p className="text-gray-600 text-base leading-relaxed max-w-[600px]">
            {productData.description}
          </p>

          {/* Size Selection */}
          {isSizeSelectable ? (
            <div>
              <p className="text-gray-800 font-medium mb-3">Select Size</p>
              <div className="flex gap-4 flex-wrap">
                {getAvailableSizes().map((s) => {
                  const sizeQty = getStockForSize(s);
                  const sizeOutOfStock = sizeQty === 0;
                  const sizeLow = sizeQty > 0 && sizeQty <= 5;
                  return (
                    <div key={s} className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => !sizeOutOfStock && setSize(s)}
                        disabled={sizeOutOfStock}
                        className={`px-6 py-2 border rounded-lg transition-all duration-300 uppercase text-sm tracking-wide relative ${
                          sizeOutOfStock
                            ? "border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed line-through"
                            : size === s
                            ? "bg-black text-white border-black shadow"
                            : "border-gray-300 text-gray-700 hover:border-black"
                        }`}
                      >
                        {s}
                      </button>
                      {/* Per-size stock hint — glassy B&W */}
                      {sizeOutOfStock ? (
                        <span className="size-sold-out-label">Sold out</span>
                      ) : sizeLow ? (
                        <span className="size-low-label">{sizeQty} left</span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-800 font-medium mb-3">Size</p>
              <span className="px-6 py-2 border border-gray-300 bg-gray-50 text-gray-700 rounded-lg text-sm">
                Regular
              </span>
            </div>
          )}

          {/* Size Details Display */}
          {size && formattedDetails.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-black rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center gap-2 mb-4">
                <Ruler size={20} className="text-black" />
                <h3 className="text-lg font-bold text-black uppercase tracking-wide">
                  Size {size} Specifications
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {formattedDetails.map((detail, idx) => (
                  <div key={idx} className="space-y-1">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {detail.label}
                    </p>
                    <p className="text-2xl font-bold text-black">
                      {detail.value}
                      <span className="text-sm font-normal text-gray-600 ml-1">inches</span>
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4 italic">
                All measurements are in inches
              </p>
            </motion.div>
          )}

          {/* Add to Cart + Size Guide Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleAddToCart}
              onTouchStart={handleAddToCartTouchStart}
              disabled={isOutOfStock}
              className={`px-8 py-3 text-sm font-semibold rounded-md border transition-all shadow relative overflow-hidden touch-manipulation ${
                isOutOfStock
                  ? "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed"
                  : "bg-black text-white border-black hover:bg-gray-800 active:bg-gray-700"
              }`}
              style={{ touchAction: 'manipulation' }}
            >
              <span className="relative z-10">
                {isOutOfStock ? "OUT OF STOCK" : "ADD TO CART"}
              </span>
              {!isOutOfStock && ripples.map(ripple => (
                <span
                  key={ripple.id}
                  className="product-ripple"
                  style={{
                    left: `${ripple.x}px`,
                    top: `${ripple.y}px`,
                    width: `${ripple.size}px`,
                    height: `${ripple.size}px`,
                  }}
                />
              ))}
            </button>

            {isSizeSelectable && (
              <button
                onClick={() => setShowSizeGuide(true)}
                className="border-2 border-gray-900 text-gray-900 px-6 py-3 text-sm font-semibold rounded-md hover:bg-gray-900 hover:text-white transition-all flex items-center gap-2"
              >
                <Ruler size={18} />
                Size Guide
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowSizeGuide(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
            >
              <X size={24} />
            </button>

            {/* Content */}
            <div className="p-8">
              <h2 className="text-4xl font-bold text-center mb-6 text-black">
                Size Guide
              </h2>

              {/* Gender Selector */}
              <div className="flex justify-center gap-6 mb-8">
                {["men", "women"].map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedGender(g)}
                    className={`px-8 py-2 rounded-full font-semibold transition-all border-2 ${
                      selectedGender === g
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-black hover:bg-gray-100"
                    }`}
                  >
                    {g === "men" ? "Men" : "Women"}
                  </button>
                ))}
              </div>

              {/* Size Table */}
              {(() => {
                const category = getCategoryForSizeGuide();
                if (!category) return null;

                const data = sizeData[selectedGender][category];
                if (!data || !data.length) return null;

                return (
                  <div className="border-2 border-black rounded-xl overflow-hidden">
                    <div className="bg-gray-100 px-6 py-3 border-b-2 border-black">
                      <h3 className="text-2xl font-semibold capitalize">
                        {category === "tshirt" ? "T-Shirt" : category}
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50">
                            {Object.keys(data[0]).map((key) => (
                              <th
                                key={key}
                                className="px-6 py-3 border-b border-black text-black uppercase tracking-wide font-semibold"
                              >
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {data.map((row, idx) => (
                            <tr
                              key={idx}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              {Object.values(row).map((val, i) => (
                                <td
                                  key={i}
                                  className="px-6 py-3 border-b border-gray-300 text-black"
                                >
                                  {val}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}

              <p className="text-center text-gray-600 text-sm mt-6">
                All measurements are in inches
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Reviews Section */}
      <section className="mt-20 border-t border-gray-200 pt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-3 text-gray-900">
            <MessageSquare size={20} /> Customer Feedback
          </h2>
          <div className="text-sm text-gray-500">{reviews.length} results</div>
        </div>

        {/* Review Input + List */}
        <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="Share your experience..."
              className="w-full p-4 border border-gray-300 rounded-lg bg-white text-gray-800 resize-none focus:outline-none focus:border-black transition-colors"
              rows={4}
            />
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setRating(n)}
                    className={`p-1 transition-colors ${n <= rating ? "text-yellow-500" : "text-gray-400"}`}
                  >
                    <Star size={16} fill={n <= rating ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
              <button
                onClick={submitReview}
                className="ml-auto bg-black text-white border border-black px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
              >
                Submit Review
              </button>
            </div>
          </div>

          {/* Ratings Summary */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="text-3xl font-semibold text-gray-900">
              {averageRating || "—"}
            </div>
            <div className="text-sm text-gray-500 mt-1">{reviews.length} reviews</div>
            <div className="mt-4 space-y-1">
              {[5, 4, 3, 2, 1].map((r) => {
                const count = reviews.filter((x) => x.rating === r).length;
                const pct = reviews.length
                  ? Math.round((count / reviews.length) * 100)
                  : 0;
                return (
                  <div key={r} className="flex items-center gap-3">
                    <div className="w-8 text-sm text-gray-700">{r}★</div>
                    <div className="h-2 bg-gray-200 rounded-full flex-1 relative overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className="h-full bg-yellow-500 transition-all duration-300"
                      ></div>
                    </div>
                    <div className="w-10 text-right text-sm text-gray-500">{pct}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Review List */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loadingReviews ? (
            <div className="text-gray-500">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="text-gray-500">No reviews yet — be the first to add one.</div>
          ) : (
            reviews.map((rev, idx) => (
              <ReviewCard key={rev._id || idx} review={rev} index={idx} />
            ))
          )}
        </motion.div>
      </section>

      {/* Related Products */}
      <div className="mt-20 mb-10">
        <RelatedProducts
          category={productData.category}
          subCategory={productData.subCategory}
        />
      </div>
    </div>
  ) : (
    <SkeletonProductPage />
  );
};

export default Product;