import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const Wishlist = () => {
  const { products, wishlist, removeFromWishlist, addToCart, currency } =
    useContext(ShopContext);
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [recommended, setRecommended] = useState([]);

  // ✅ Glassy Toast Function
  const glassToast = (message, type = "info") =>
    toast[type](message, {
      style: {
        background: "rgba(15,15,15,0.75)",
        color: "#fff",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: "16px",
        fontFamily: "Poppins, sans-serif",
        letterSpacing: "0.5px",
        padding: "12px 16px",
      },
      progressStyle: { background: "#fff" },
      icon: false,
      autoClose: 2000,
      position: "top-right",
    });

  // Smart Recommendations
  useEffect(() => {
    if (wishlist?.length > 0) {
      const items = products.filter((p) => wishlist.includes(p._id));
      setWishlistItems(items);

      const categories = items.map((p) => p.category?.toLowerCase());
      const hasUpper = categories.some((c) =>
        ["shirt", "tshirt", "t-shirt", "top", "upperwear"].includes(c)
      );
      const hasLower = categories.some((c) =>
        ["jeans", "pant", "bottom", "trouser"].includes(c)
      );
      const hasCombo = categories.some((c) =>
        ["combo", "co-ord", "set"].includes(c)
      );
      const hasBag = categories.some((c) => ["bag", "bags"].includes(c));
      const hasPerfume = categories.some((c) =>
        ["perfume", "perfumes"].includes(c)
      );

      let rec = [];
      if (hasUpper && !hasLower) {
        rec = products.filter((p) =>
          ["jeans", "pant", "bag"].some((t) =>
            p.category?.toLowerCase().includes(t)
          )
        );
      } else if (hasLower && !hasUpper) {
        rec = products.filter((p) =>
          ["shirt", "tshirt", "t-shirt"].some((t) =>
            p.category?.toLowerCase().includes(t)
          )
        );
      } else if (hasUpper && hasLower) {
        rec = products.filter((p) =>
          ["combo", "co-ord", "set"].some((t) =>
            p.category?.toLowerCase().includes(t)
          )
        );
      } else if (hasCombo) {
        rec = products.filter((p) =>
          ["bag", "perfume"].some((t) =>
            p.category?.toLowerCase().includes(t)
          )
        );
      } else if (hasBag || hasPerfume) {
        rec = products.filter((p) =>
          ["shirt", "jeans", "combo"].some((t) =>
            p.category?.toLowerCase().includes(t)
          )
        );
      } else {
        rec = products.filter((p) => p.bestseller === true);
      }

      setRecommended(rec.sort(() => 0.5 - Math.random()).slice(0, 4));
    } else {
      setWishlistItems([]);
      setRecommended([]);
    }
  }, [wishlist, products]);

  const handleRemove = async (id) => {
    await removeFromWishlist(id);
  };

  const handleMoveToCart = async (item) => {
    const needsSize = ["shirt", "tshirt", "combo", "jeans"].includes(
      item.category?.toLowerCase()
    );

    if (needsSize) {
      glassToast("Please select a size before adding to cart.", "info");
      navigate(`/product/${item._id}`);
      return;
    }

    await addToCart(item._id, null, true);
    await removeFromWishlist(item._id, true);
    glassToast("Item added to cart", "success");
  };

  return (
    <div className="min-h-[90vh] bg-gradient-to-b from-white via-gray-100 to-gray-200 py-20 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="flex justify-start mb-10 lg:mt-8">
          <button
            onClick={() => navigate("/collection")}
            className="flex items-center gap-2 text-gray-700 hover:text-black transition-all duration-300 text-base sm:text-lg font-medium tracking-wide group"
          >
            <ArrowLeft
              className="w-6 h-6 sm:w-8 sm:h-8 group-hover:-translate-x-1 transition-transform duration-300"
              strokeWidth={1.5}
            />
            <span className="uppercase text-sm sm:text-base tracking-widest">
              Back to Collection
            </span>
          </button>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <h1 className="text-4xl sm:text-5xl tracking-[6px] font-light text-gray-900 uppercase">
            My <span className="font-semibold">Wishlist</span>
          </h1>
          <div className="mt-3 w-24 h-[1px] bg-gray-800 mx-auto"></div>
          <p className="text-sm sm:text-base text-gray-600 mt-4 font-light">
            Your handpicked luxury favorites — ready to make them yours ✨
          </p>
        </motion.div>

        {/* Wishlist Content */}
        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-gray-600">
            <Heart className="w-16 h-16 text-gray-400 mb-6" />
            <p className="text-lg mb-4 font-light">Your wishlist is empty</p>
            <button
              onClick={() => navigate("/collection")}
              className="border border-black px-8 py-3 text-sm tracking-wide uppercase hover:bg-black hover:text-white transition-all duration-300"
            >
              Explore Collection
            </button>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 lg:gap-8"
            >
              {wishlistItems.map((item) => (
                <motion.div
                  key={item._id}
                  whileHover={{ scale: 1.04 }}
                  className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-200 overflow-hidden group"
                >
                  {/* Image — navigate on click, no buttons here */}
                  <Link
                    to={`/product/${item._id}`}
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={item.image[0]}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                  </Link>

                  {/* 
                    ── DESKTOP: hover overlay on the image (pointer devices only) ──
                    pointer-events-none on mobile so tapping image never hits these 
                  */}
                  <div className="absolute top-0 left-0 right-0 bottom-[88px] 
                    bg-black/0 group-hover:bg-black/10 transition-all duration-500 
                    hidden sm:flex items-center justify-center gap-3 
                    opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
                    <button
                      onClick={() => handleMoveToCart(item)}
                      className="bg-white/90 text-black rounded-full p-3 hover:bg-black hover:text-white transition-all duration-300"
                      title="Move to Cart"
                    >
                      <ShoppingBag size={18} />
                    </button>
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="bg-white/90 text-red-600 rounded-full p-3 hover:bg-red-600 hover:text-white transition-all duration-300"
                      title="Remove"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Product name + price — always a link */}
                  <Link
                    to={`/product/${item._id}`}
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    <div className="p-3 text-center">
                      <h3 className="text-sm font-medium uppercase text-gray-900 tracking-wide">
                        {item.name}
                      </h3>
                      <p className="text-sm font-light text-gray-600 mt-1">
                        {currency}{item.price}
                      </p>
                    </div>
                  </Link>

                  {/* 
                    ── MOBILE ONLY: always-visible action buttons below the name ──
                    sm:hidden so they only show on small screens 
                  */}
                  <div className="flex sm:hidden items-center justify-center gap-3 px-3 pb-3">
                    <button
                      onClick={() => handleMoveToCart(item)}
                      className="p-2 rounded-xl bg-black text-white
                        active:scale-95 transition-all duration-200"
                      title="Add to Cart"
                    >
                      <ShoppingBag size={16} />
                    </button>
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="p-2 rounded-xl border border-red-200 text-red-500
                        active:scale-95 transition-all duration-200"
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Smart Recommendations */}
            {recommended.length > 0 && (
              <div className="mt-20">
                <h2 className="text-2xl sm:text-3xl font-semibold text-black text-center tracking-[3px] uppercase mb-8">
                  🖤You May Also Like !
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {recommended.map((item) => (
                    <motion.div
                      key={item._id}
                      whileHover={{ scale: 1.03 }}
                      className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-200 transition-all duration-500 overflow-hidden group"
                    >
                      <Link
                        to={`/product/${item._id}`}
                        onClick={() => window.scrollTo(0, 0)}
                      >
                        <div className="aspect-[3/4] overflow-hidden relative">
                          <img
                            src={item.image[0]}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 flex justify-center items-center transition-all duration-500">
                            <span className="bg-white text-black px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300">
                              View Product
                            </span>
                          </div>
                        </div>
                        <div className="p-4 text-center">
                          <h3 className="text-sm font-medium uppercase text-gray-900 tracking-wide mb-1">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600 font-light">
                            {currency}{item.price}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;