import React, { useContext, useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import SkeletonProductCard from "../components/SkeletonProductCard";
import WhatsAppButton from "../components/WhatsAppButton";
import { ChevronLeft, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Collection = () => {
  const {
    products,
    search,
    showSearch,
    navigate,
    toggleWishlist,
    isInWishlist,
    currency,
  } = useContext(ShopContext);

  const [showFilter, setShowFilter]       = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory]           = useState([]);
  const [sortType, setSortType]           = useState("relavent");
  const [isLoading, setIsLoading]         = useState(true);

  // ── Price filter state ──
  const [minBound, setMinBound]   = useState(0);       // absolute min from products
  const [maxBound, setMaxBound]   = useState(10000);   // absolute max from products
  const [priceRange, setPriceRange] = useState([0, 10000]); // [low, high] thumbs
  const [priceApplied, setPriceApplied] = useState(false);

  // Derive real min/max once products load
  useEffect(() => {
    if (products && products.length > 0) {
      const prices = products.map((p) => Number(p.price));
      const lo = Math.floor(Math.min(...prices));
      const hi = Math.ceil(Math.max(...prices));
      setMinBound(lo);
      setMaxBound(hi);
      setPriceRange([lo, hi]);
    }
  }, [products]);

  // ── Category toggle ──
  const toggleCategory = (e) => {
    const val = e.target.value;
    setCategory((prev) =>
      prev.includes(val) ? prev.filter((c) => c !== val) : [...prev, val]
    );
  };

  // ── Core filter function ──
  const applyFilter = (range = priceRange) => {
    let copy = products.slice();

    if (showSearch && search) {
      copy = copy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      copy = copy.filter((item) =>
        category.some((cat) => cat.toLowerCase() === item.category.toLowerCase())
      );
    }

    // Price range
    copy = copy.filter(
      (item) => Number(item.price) >= range[0] && Number(item.price) <= range[1]
    );

    setFilterProducts(copy);
  };

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();
    switch (sortType) {
      case "low-high":
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;
      case "high-low":
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;
      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    if (products && products.length > 0) {
      setIsLoading(false);
      applyFilter();
    }
  }, [category, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  // ── Wishlist click ──
  const handleWishlistClick = (e, itemId) => {
    e.preventDefault();
    e.stopPropagation();
    const button = e.currentTarget;
    button.classList.add("heart-burst");
    toggleWishlist(itemId);
    setTimeout(() => button.classList.remove("heart-burst"), 400);
  };

  // ── Dual-thumb slider helpers ──
  const getPercent = (val) =>
    maxBound === minBound
      ? 0
      : Math.round(((val - minBound) / (maxBound - minBound)) * 100);

  const handleMinThumb = (e) => {
    const val = Math.min(Number(e.target.value), priceRange[1] - 1);
    setPriceRange([val, priceRange[1]]);
  };

  const handleMaxThumb = (e) => {
    const val = Math.max(Number(e.target.value), priceRange[0] + 1);
    setPriceRange([priceRange[0], val]);
  };

  const handleApplyPrice = () => {
    setPriceApplied(true);
    applyFilter(priceRange);
  };

  const handleResetPrice = () => {
    const reset = [minBound, maxBound];
    setPriceRange(reset);
    setPriceApplied(false);
    applyFilter(reset);
  };

  const minPct = getPercent(priceRange[0]);
  const maxPct = getPercent(priceRange[1]);

  return (
    <>
      <style>{`
        /* ── Dual range slider ── */
        .jz-slider-wrap {
          position: relative;
          height: 28px;
          margin: 0 2px;
        }
        .jz-slider-track {
          position: absolute;
          top: 50%; left: 0; right: 0;
          transform: translateY(-50%);
          height: 4px;
          background: #e5e7eb;
          border-radius: 2px;
          z-index: 1;
        }
        .jz-slider-fill {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          height: 4px;
          background: #111;
          border-radius: 2px;
          z-index: 2;
          pointer-events: none;
        }
        .jz-slider-wrap input[type="range"] {
          position: absolute;
          width: 100%;
          top: 50%;
          transform: translateY(-50%);
          height: 4px;
          background: transparent;
          -webkit-appearance: none;
          appearance: none;
          pointer-events: none;
          outline: none;
        }
        .jz-slider-wrap input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px; height: 18px;
          border-radius: 50%;
          background: #111;
          border: 2px solid #fff;
          box-shadow: 0 1px 6px rgba(0,0,0,0.28);
          pointer-events: all;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .jz-slider-wrap input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.25);
          box-shadow: 0 2px 10px rgba(0,0,0,0.38);
        }
        .jz-slider-wrap input[type="range"]::-moz-range-thumb {
          width: 18px; height: 18px;
          border-radius: 50%;
          background: #111;
          border: 2px solid #fff;
          box-shadow: 0 1px 6px rgba(0,0,0,0.28);
          pointer-events: all;
          cursor: pointer;
        }
      `}</style>

      <Helmet>
        <title>Shop All Collection – Shirts, Jeans, T-Shirts | Jeanzey</title>
        <meta name="description" content="Browse Jeanzey's full collection of men's and women's luxury fashion. Filter by shirts, jeans, t-shirts and combo outfits. Free delivery across India." />
        <link rel="canonical" href="https://yourdomain.com/collection" />
      </Helmet>

      <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 pt-16 sm:pt-24 border-t max-w-7xl mx-auto px-6 sm:px-10">

        {/* ── Left: Back + Filters ── */}
        <div className="flex flex-col min-w-[220px] gap-6">

          {/* Back Button */}
          <div className="self-start">
            <button
              onClick={() => navigate("/")}
              className="flex items-center text-gray-600 hover:text-black transition-colors gap-2 text-base sm:text-lg font-light tracking-wide"
            >
              <ChevronLeft size={22} />
              <span>Back to Home</span>
            </button>
          </div>

          <div>
            <p
              onClick={() => setShowFilter(!showFilter)}
              className="my-2 text-xl flex items-center cursor-pointer gap-2"
            >
              FILTERS
              <img
                className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
                src={assets.dropdown_icon}
                alt=""
              />
            </p>

            {/* Category Filter */}
            <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? "" : "hidden"} sm:block`}>
              <p className="mb-3 text-sm font-medium">CATEGORIES</p>
              <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                {["Shirt", "Jeans", "Combo", "Tshirt", "Bags", "Perfumes"].map((cat, i) => (
                  <p key={i} className="flex gap-2">
                    <input
                      className="w-3 accent-black"
                      type="checkbox"
                      value={cat}
                      onChange={toggleCategory}
                    />
                    {cat}
                  </p>
                ))}
              </div>
            </div>

           {/* ── Price Range Filter ── */}
            <div className={`border border-gray-300 px-4 py-4 mt-4 ${showFilter ? "" : "hidden"} sm:block`}>
              <p className="mb-1 text-sm font-medium tracking-wide">FILTER BY PRICE</p>

              {/* thin top rule */}
              <div className="w-6 h-px bg-gray-400 mb-4 mt-1" />

              {/* Dual-handle slider */}
              <div className="jz-slider-wrap">
                <div className="jz-slider-track" />
                <div
                  className="jz-slider-fill"
                  style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }}
                />
                {/* min thumb — step 50, use onInput for smooth mobile response */}
                <input
                  type="range"
                  min={minBound}
                  max={maxBound}
                  step={50}
                  value={priceRange[0]}
                  onChange={handleMinThumb}
                  onInput={handleMinThumb}
                  style={{ zIndex: priceRange[0] > maxBound - 100 ? 5 : 3 }}
                />
                {/* max thumb */}
                <input
                  type="range"
                  min={minBound}
                  max={maxBound}
                  step={50}
                  value={priceRange[1]}
                  onChange={handleMaxThumb}
                  onInput={handleMaxThumb}
                  style={{ zIndex: 4 }}
                />
              </div>

              {/* Filter button + price label */}
              <div className="flex items-center justify-between mt-4 gap-3">
                <button
                  type="button"
                  onClick={handleApplyPrice}
                  className="bg-black text-white text-[11px] font-bold tracking-[3px] uppercase px-5 py-2 rounded hover:bg-gray-800 transition-all duration-200 flex-shrink-0"
                >
                  FILTER
                </button>
                <span className="text-xs text-gray-600 whitespace-nowrap">
                  Price: {currency}{priceRange[0].toLocaleString("en-IN")} — {currency}{priceRange[1].toLocaleString("en-IN")}
                </span>
              </div>

              {/* Reset — only shows after filter applied */}
              {priceApplied && (
                <button
                  type="button"
                  onClick={handleResetPrice}
                  className="mt-2 w-full border border-gray-300 text-gray-500 text-xs py-1.5 rounded hover:bg-gray-100 transition-all duration-200"
                >
                  Reset Price Filter
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Right: Products ── */}
        <div className="flex-1 flex flex-col gap-6">

          {/* Title + Sort */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
            <Title text1={"ALL"} text2={"COLLECTIONS"} />
            <select
              onChange={(e) => setSortType(e.target.value)}
              className="border-2 border-gray-300 text-sm px-3 py-1 rounded-md self-start sm:self-auto"
            >
              <option value="relavent">Sort by: Relevant</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-10">
            {isLoading ? (
              Array(10).fill(0).map((_, i) => <SkeletonProductCard key={i} />)
            ) : filterProducts.length > 0 ? (
              filterProducts.map((item, index) => (
                <Link
                  key={index}
                  to={`/product/${item._id}`}
                  className="group block cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative overflow-hidden bg-[#f8f8f8] aspect-[3/4] rounded-2xl border border-gray-200 hover:border-gray-400 transition-all duration-500 shadow-sm hover:shadow-lg">
                    {item.image?.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={item.name}
                        loading="lazy"
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${
                          i === 0
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-105 group-hover:opacity-100 group-hover:scale-100"
                        }`}
                      />
                    ))}

                    {/* Out of Stock / Low Stock Badges */}
                    {(() => {
                      const stock = item.stock;
                      const isSized = ["Shirt","Jeans","Combo","Tshirt"].includes(item.category);
                      const totalStock = isSized && typeof stock === "object" && stock !== null
                        ? Object.values(stock).reduce((s, v) => s + (Number(v) || 0), 0)
                        : Number(stock) || 0;
                      if (totalStock === 0) return (
                        <div className="absolute inset-0 flex items-center justify-center z-10 rounded-2xl"
                          style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)" }}>
                          <span style={{
                            background: "linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(220,220,220,0.75) 100%)",
                            border: "1px solid rgba(0,0,0,0.12)", color: "#111",
                            backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
                            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 12px rgba(0,0,0,0.15)",
                            fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.1em",
                            padding: "6px 16px", borderRadius: "999px", textTransform: "uppercase",
                          }}>Out of Stock</span>
                        </div>
                      );
                      if (totalStock <= 5) return (
                        <div className="absolute top-3 left-3 z-10">
                          <span style={{
                            background: "linear-gradient(135deg, rgba(20,20,20,0.92) 0%, rgba(50,50,50,0.85) 100%)",
                            border: "1px solid rgba(255,255,255,0.15)", color: "#fff",
                            backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
                            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 2px 10px rgba(0,0,0,0.3)",
                            fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.08em",
                            padding: "4px 12px", borderRadius: "999px", textTransform: "uppercase",
                            display: "inline-block",
                          }}>Only {totalStock} Left</span>
                        </div>
                      );
                      return null;
                    })()}

                    {/* Wishlist */}
                    <button
                      onClick={(e) => handleWishlistClick(e, item._id)}
                      className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 border z-20 ${
                        isInWishlist(item._id)
                          ? "bg-black text-white border-black scale-110"
                          : "bg-white text-gray-800 border-gray-200 hover:bg-black hover:text-white"
                      }`}
                      title={isInWishlist(item._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                      <Heart size={18} className={isInWishlist(item._id) ? "fill-white" : ""} />
                    </button>
                  </div>

                  <div className="text-center mt-4 space-y-1">
                    <h3 className="text-sm sm:text-base font-medium text-gray-900 tracking-wide uppercase group-hover:text-gray-600 transition-colors duration-300">
                      {item.name}
                    </h3>
                    <p className="text-sm sm:text-base font-light text-gray-600">
                      {currency}{item.price}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500">
                No products found in this price range
              </div>
            )}
          </div>
        </div>
      </div>

      <WhatsAppButton />
    </>
  );
};

export default Collection;