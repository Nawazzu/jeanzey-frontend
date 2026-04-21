import React, { useContext, useState, useEffect, useCallback, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import SkeletonProductCard from "../components/SkeletonProductCard";
import WhatsAppButton from "../components/WhatsAppButton";
import { ChevronLeft, Heart, SlidersHorizontal, X } from "lucide-react";
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

  const [showFilter, setShowFilter]         = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory]             = useState([]);
  const [sortType, setSortType]             = useState("relavent");
  const [isLoading, setIsLoading]           = useState(true);
  const [gridCols, setGridCols]             = useState(3);
  const [hoveredCard, setHoveredCard]       = useState(null);

  const [minBound, setMinBound]         = useState(0);
  const [maxBound, setMaxBound]         = useState(10000);
  const [priceRange, setPriceRange]     = useState([0, 10000]);
  const [appliedRange, setAppliedRange] = useState([0, 10000]);
  const [priceApplied, setPriceApplied] = useState(false);

  useEffect(() => {
    if (products && products.length > 0) {
      const prices = products.map((p) => Number(p.price));
      const lo = Math.floor(Math.min(...prices));
      const hi = Math.ceil(Math.max(...prices));
      setMinBound(lo);
      setMaxBound(hi);
      setPriceRange([lo, hi]);
      setAppliedRange([lo, hi]);
    }
  }, [products]);

  const toggleCategory = (val) => {
    setCategory((prev) =>
      prev.includes(val) ? prev.filter((c) => c !== val) : [...prev, val]
    );
  };

  const applyFilter = useCallback((cats = category, range = appliedRange) => {
    let copy = products.slice();
    if (showSearch && search) {
      copy = copy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (cats.length > 0) {
      copy = copy.filter((item) =>
        cats.some((cat) => cat.toLowerCase() === item.category.toLowerCase())
      );
    }
    copy = copy.filter(
      (item) => Number(item.price) >= range[0] && Number(item.price) <= range[1]
    );
    return copy;
  }, [products, search, showSearch]);

  useEffect(() => {
    if (products && products.length > 0) {
      setIsLoading(false);
      setFilterProducts(applyFilter(category, appliedRange));
    }
  }, [category, search, showSearch, products, appliedRange]);

  useEffect(() => {
    setFilterProducts((prev) => {
      const copy = prev.slice();
      if (sortType === "low-high") return copy.sort((a, b) => a.price - b.price);
      if (sortType === "high-low") return copy.sort((a, b) => b.price - a.price);
      return applyFilter(category, appliedRange);
    });
  }, [sortType]);

  const handleWishlistClick = (e, itemId) => {
    e.preventDefault();
    e.stopPropagation();
    const button = e.currentTarget;
    button.classList.add("heart-burst");
    toggleWishlist(itemId);
    setTimeout(() => button.classList.remove("heart-burst"), 400);
  };

  const sliderTrackRef = useRef(null);
  const dragging = useRef(null);

  const snapTo50 = (val) => Math.round(val / 50) * 50;

  const getPercent = (val) =>
    maxBound === minBound ? 0
      : ((val - minBound) / (maxBound - minBound)) * 100;

  const valFromClientX = (clientX) => {
    const track = sliderTrackRef.current;
    if (!track) return 0;
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    const raw = minBound + ratio * (maxBound - minBound);
    return snapTo50(raw);
  };

  const onPointerDown = (thumb) => (e) => {
    e.preventDefault();
    dragging.current = thumb;
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const onPointerMove = useCallback((e) => {
    if (!dragging.current) return;
    const val = valFromClientX(e.clientX);
    setPriceRange((prev) => {
      if (dragging.current === "min") {
        return [Math.min(val, prev[1] - 50), prev[1]];
      } else {
        return [prev[0], Math.max(val, prev[0] + 50)];
      }
    });
  }, [minBound, maxBound]);

  const onPointerUp = useCallback(() => {
    dragging.current = null;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
  }, [onPointerMove]);

  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [onPointerMove, onPointerUp]);

  const handleApplyPrice = () => {
    setAppliedRange(priceRange);
    setPriceApplied(true);
  };

  const handleResetPrice = () => {
    const reset = [minBound, maxBound];
    setPriceRange(reset);
    setAppliedRange(reset);
    setPriceApplied(false);
  };

  const minPct = getPercent(priceRange[0]);
  const maxPct = getPercent(priceRange[1]);
  const hasActiveFilters = category.length > 0 || priceApplied;

  const gridClass = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  const GridIcon2 = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="14" rx="1" fill="currentColor"/>
      <rect x="9" y="1" width="6" height="14" rx="1" fill="currentColor"/>
    </svg>
  );
  const GridIcon3 = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="4" height="14" rx="1" fill="currentColor"/>
      <rect x="6" y="1" width="4" height="14" rx="1" fill="currentColor"/>
      <rect x="11" y="1" width="4" height="14" rx="1" fill="currentColor"/>
    </svg>
  );
  const GridIcon4 = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="3" height="14" rx="1" fill="currentColor"/>
      <rect x="5" y="1" width="3" height="14" rx="1" fill="currentColor"/>
      <rect x="9" y="1" width="3" height="14" rx="1" fill="currentColor"/>
      <rect x="13" y="1" width="3" height="14" rx="1" fill="currentColor"/>
    </svg>
  );

  const filterContent = (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">Categories</p>
        <div className="flex flex-col gap-2.5">
          {["Shirt", "Jeans", "Combo", "Tshirt", "Bags", "Perfumes"].map((cat) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => toggleCategory(cat)}
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 cursor-pointer ${
                  category.includes(cat)
                    ? "bg-black border-black"
                    : "border-gray-300 group-hover:border-gray-500"
                }`}
              >
                {category.includes(cat) && (
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1 4L3 6L7 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span
                onClick={() => toggleCategory(cat)}
                className={`text-sm cursor-pointer transition-colors ${
                  category.includes(cat) ? "text-gray-900 font-medium" : "text-gray-600 font-light"
                }`}
              >
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      <div>
        <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-1">Price Range</p>
        <p className="text-sm font-medium text-gray-800 mb-5">
          {currency}{priceRange[0].toLocaleString("en-IN")}
          <span className="text-gray-400 mx-1">—</span>
          {currency}{priceRange[1].toLocaleString("en-IN")}
        </p>

        <div
          ref={sliderTrackRef}
          className="relative mx-3"
          style={{ height: "4px", background: "#e5e7eb", borderRadius: "2px", touchAction: "none" }}
        >
          <div
            style={{
              position: "absolute",
              left: `${minPct}%`,
              width: `${maxPct - minPct}%`,
              height: "4px",
              background: "#111",
              borderRadius: "2px",
            }}
          />
          <div
            onPointerDown={onPointerDown("min")}
            style={{
              position: "absolute",
              left: `${minPct}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "22px",
              height: "22px",
              borderRadius: "50%",
              background: "#111",
              border: "3px solid #fff",
              boxShadow: "0 1px 8px rgba(0,0,0,0.3)",
              cursor: "grab",
              touchAction: "none",
              userSelect: "none",
              zIndex: 3,
            }}
          />
          <div
            onPointerDown={onPointerDown("max")}
            style={{
              position: "absolute",
              left: `${maxPct}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "22px",
              height: "22px",
              borderRadius: "50%",
              background: "#111",
              border: "3px solid #fff",
              boxShadow: "0 1px 8px rgba(0,0,0,0.3)",
              cursor: "grab",
              touchAction: "none",
              userSelect: "none",
              zIndex: 4,
            }}
          />
        </div>

        <div className="flex gap-2 mt-6">
          <button
            type="button"
            onClick={handleApplyPrice}
            className="flex-1 bg-black text-white text-xs font-bold tracking-widest uppercase py-2.5 rounded-lg hover:bg-gray-900 transition-all"
          >
            Apply
          </button>
          {priceApplied && (
            <button
              type="button"
              onClick={handleResetPrice}
              className="flex-1 border border-gray-200 text-gray-500 text-xs py-2.5 rounded-lg hover:bg-gray-50 transition-all"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <>
          <div className="h-px bg-gray-100" />
          <button
            onClick={() => {
              setCategory([]);
              handleResetPrice();
            }}
            className="text-xs text-gray-400 hover:text-black transition-colors text-center underline underline-offset-2"
          >
            Clear all filters
          </button>
        </>
      )}
    </div>
  );

  return (
    <>
      <style>{`
        .drawer-open {
          transform: translateX(0);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .prod-card-img { transition: transform 0.7s cubic-bezier(0.4,0,0.2,1); }
        .prod-card-img.hovered { transform: scale(1.04); }
        .prod-card-overlay {
          position: absolute; inset: 0;
          background: rgba(0,0,0,0);
          transition: background 0.4s ease;
          pointer-events: none;
        }
        .prod-card-overlay.hovered { background: rgba(0,0,0,0.08); }
        .quick-add {
          position: absolute; bottom: 0; left: 0; right: 0;
          background: rgba(10,10,10,0.92);
          color: #fff;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-family: sans-serif;
          padding: 12px;
          text-align: center;
          transform: translateY(100%);
          transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
          pointer-events: none;
        }
        .quick-add.hovered { transform: translateY(0); pointer-events: auto; }
        .grid-btn { transition: all 0.2s ease; }
        .grid-btn.active { background: #111; color: #fff; }
        .grid-btn:not(.active) { background: transparent; color: #bbb; }
        .grid-btn:not(.active):hover { color: #555; }
      `}</style>

      <Helmet>
        <title>Shop All Collection – Shirts, Jeans, T-Shirts | Jean-Zey</title>
        <meta name="description" content="Browse Jean-Zey's full collection of men's and women's fashion. Filter by shirts, jeans, t-shirts and combo outfits. Free delivery across Mumbai." />
        <meta name="keywords" content="buy jeans Mumbai, shirts online Mumbai, t-shirts, combo outfits, Jean-Zey collection, fashion Mumbai" />
        <link rel="canonical" href="https://jeanzey.com/collection" />
      </Helmet>

      <h1 className="sr-only">Shop All Collections — Men's & Women's Fashion</h1>

      <h2 style={{position:'absolute',width:'1px',height:'1px',padding:0,margin:'-1px',overflow:'hidden',clip:'rect(0,0,0,0)',whiteSpace:'nowrap',border:0}}>
        Shop Men's &amp; Women's Fashion — Jeans, Shirts, T-Shirts &amp; Combos | Jean-Zey Mumbai
      </h2>

      {/* ── MOBILE LEFT DRAWER ── */}
      {showFilter && (
        <div className="fixed inset-0 z-50 sm:hidden flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowFilter(false)}
          />
          <div className="relative w-[78vw] max-w-[300px] h-full bg-white shadow-2xl flex flex-col drawer-open z-10">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <p className="text-sm font-bold uppercase tracking-widest text-gray-900">Filters</p>
              <button
                onClick={() => setShowFilter(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={17} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              {filterContent}
            </div>
            <div className="px-5 py-4 border-t border-gray-100">
              <button
                onClick={() => setShowFilter(false)}
                className="w-full bg-black text-white text-sm font-bold tracking-widest uppercase py-3 rounded-xl hover:bg-gray-900 transition-all"
              >
                Show {filterProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PAGE ── */}
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 pt-16 sm:pt-24 border-t max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

        {/* ── DESKTOP SIDEBAR ── */}
        <div className="hidden sm:flex flex-col min-w-[220px] gap-6">
          <button
            onClick={() => navigate("/")}
            className="self-start flex items-center text-gray-600 hover:text-black transition-colors gap-2 text-base font-light tracking-wide"
          >
            <ChevronLeft size={22} />
            <span>Back to Home</span>
          </button>
          <div>
            <p className="my-2 text-xl font-medium tracking-wide uppercase">FILTERS</p>
            <div className="mt-4">
              {filterContent}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Products ── */}
        <div className="flex-1 flex flex-col gap-4">

          {/* Mobile top bar */}
          <div className="flex items-center justify-between sm:hidden mb-1">
            <button
              onClick={() => navigate("/")}
              className="flex items-center text-gray-500 gap-1 text-sm font-light"
            >
              <ChevronLeft size={17} />
              Back
            </button>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-800">
              Collections
            </p>
            <button
              onClick={() => setShowFilter(true)}
              className="relative flex items-center gap-1.5 border border-gray-300 rounded-full px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-black hover:text-black transition-all"
            >
              <SlidersHorizontal size={12} />
              Filter
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-black border-2 border-white" />
              )}
            </button>
          </div>

          {/* Mobile: sort + grid switcher */}
          <div className="sm:hidden flex flex-col gap-2 mb-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-gray-400 flex-shrink-0">{filterProducts.length} items</p>
              <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-0.5">
                {[
                  { cols: 2, Icon: GridIcon2 },
                  { cols: 3, Icon: GridIcon3 },
                  { cols: 4, Icon: GridIcon4 },
                ].map(({ cols, Icon }) => (
                  <button
                    key={cols}
                    onClick={() => setGridCols(cols)}
                    className={`grid-btn p-1.5 rounded-md ${gridCols === cols ? 'active' : ''}`}
                    title={`${cols} columns`}
                    aria-label={`${cols} column grid`}
                  >
                    <Icon />
                  </button>
                ))}
              </div>
              <select
                onChange={(e) => setSortType(e.target.value)}
                value={sortType}
                className="border border-gray-200 text-xs px-2 py-1.5 rounded-full bg-white focus:outline-none focus:ring-1 focus:ring-black flex-shrink-0"
              >
                <option value="relavent">Relevant</option>
                <option value="low-high">Price: Low → High</option>
                <option value="high-low">Price: High → Low</option>
              </select>
            </div>

            {hasActiveFilters && (
              <div className="flex flex-wrap gap-1.5">
                {category.map((cat) => (
                  <span key={cat} className="flex items-center gap-1 bg-black text-white text-[11px] px-2.5 py-1 rounded-full">
                    {cat}
                    <button onClick={() => toggleCategory(cat)} aria-label={`Remove ${cat} filter`}><X size={9} /></button>
                  </span>
                ))}
                {priceApplied && (
                  <span className="flex items-center gap-1 bg-black text-white text-[11px] px-2.5 py-1 rounded-full">
                    {currency}{appliedRange[0].toLocaleString("en-IN")}–{currency}{appliedRange[1].toLocaleString("en-IN")}
                    <button onClick={handleResetPrice} aria-label="Remove price filter"><X size={9} /></button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Desktop title + grid switcher + sort */}
          <div className="hidden sm:flex justify-between items-center mb-6 gap-4">
            <div className="flex items-center gap-6">
              <Title text1={"ALL"} text2={"COLLECTIONS"} />
              <span className="text-sm text-gray-400 font-light">{filterProducts.length} items</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
                {[
                  { cols: 2, Icon: GridIcon2 },
                  { cols: 3, Icon: GridIcon3 },
                  { cols: 4, Icon: GridIcon4 },
                ].map(({ cols, Icon }) => (
                  <button
                    key={cols}
                    onClick={() => setGridCols(cols)}
                    className={`grid-btn p-1.5 rounded-md ${gridCols === cols ? 'active' : ''}`}
                    title={`${cols} columns`}
                    aria-label={`${cols} column grid`}
                  >
                    <Icon />
                  </button>
                ))}
              </div>
              <select
                onChange={(e) => setSortType(e.target.value)}
                value={sortType}
                className="border-2 border-gray-300 text-sm px-3 py-1 rounded-md"
              >
                <option value="relavent">Sort by: Relevant</option>
                <option value="low-high">Sort by: Low to High</option>
                <option value="high-low">Sort by: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div className={`grid ${gridClass[gridCols]} gap-3 sm:gap-5`}>
            {isLoading ? (
              Array(10).fill(0).map((_, i) => <SkeletonProductCard key={i} />)
            ) : filterProducts.length > 0 ? (
              filterProducts.map((item, index) => (
                <Link
                  key={index}
                  to={`/product/${item._id}`}
                  className="prod-card group block cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="relative overflow-hidden bg-[#f2f2f0] aspect-[3/4]" style={{ borderRadius: '4px' }}>

                    {item.image?.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={item.name}
                        loading="lazy"
                        className={`prod-card-img absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${hoveredCard === index ? 'hovered' : ''} ${
                          i === 0
                            ? "opacity-100"
                            : `opacity-0 ${hoveredCard === index ? 'opacity-100' : ''}`
                        }`}
                      />
                    ))}

                    <div className={`prod-card-overlay ${hoveredCard === index ? 'hovered' : ''}`} />

                    {(() => {
                      const stock = item.stock;
                      const isSized = ["Shirt","Jeans","Combo","Tshirt"].includes(item.category);
                      const totalStock = isSized && typeof stock === "object" && stock !== null
                        ? Object.values(stock).reduce((s, v) => s + (Number(v) || 0), 0)
                        : Number(stock) || 0;
                      if (totalStock === 0) return (
                        <div className="absolute inset-0 flex items-center justify-center z-10"
                          style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)", borderRadius: '4px' }}>
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
                            background: "rgba(10,10,10,0.85)",
                            color: "#fff",
                            backdropFilter: "blur(8px)",
                            fontWeight: 500, fontSize: "0.65rem", letterSpacing: "0.1em",
                            padding: "3px 10px", borderRadius: "2px", textTransform: "uppercase",
                            display: "inline-block", fontFamily: 'sans-serif',
                          }}>Only {totalStock} Left</span>
                        </div>
                      );
                      return null;
                    })()}

                    {/* Wishlist button — aria-label added for accessibility */}
                    <button
                      onClick={(e) => handleWishlistClick(e, item._id)}
                      className={`absolute top-3 right-3 p-1.5 sm:p-2 rounded-full transition-all duration-300 border z-20 ${
                        isInWishlist(item._id)
                          ? "bg-black text-white border-black"
                          : "bg-white/90 text-gray-700 border-transparent hover:bg-black hover:text-white"
                      }`}
                      title={isInWishlist(item._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                      aria-label={isInWishlist(item._id) ? `Remove ${item.name} from Wishlist` : `Add ${item.name} to Wishlist`}
                    >
                      <Heart size={14} className={isInWishlist(item._id) ? "fill-white" : ""} />
                    </button>

                    <div className={`quick-add ${hoveredCard === index ? 'hovered' : ''}`}>View Product</div>

                  </div>

                  <div className="mt-3 px-0.5">
                    <h3 className="text-xs sm:text-sm font-light text-gray-900 tracking-wide uppercase leading-snug group-hover:text-gray-500 transition-colors duration-300 truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 font-light mt-0.5" style={{ fontFamily: 'sans-serif', letterSpacing: '0.02em' }}>
                      {currency}{item.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-16 text-gray-400 text-sm">
                No products found matching your filters
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