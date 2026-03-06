import React, { useContext, useMemo, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Trash2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CartTotal from "../components/CartTotal";

const Cart = () => {
  const {
    cartItems,
    products,
    currency,
    updateQuantity,
    removeFromCart,
    getCartAmount,
    navigate,
  } = useContext(ShopContext);

  const [recommended, setRecommended] = useState([]);

  /* 🧾 Build stable cart list (memoized) - FIXED: Filter out items with 0 quantity */
  const cartList = useMemo(() => {
    const list = [];
    for (const id in cartItems) {
      const product = products.find((p) => String(p._id) === String(id));
      if (!product) continue;
      const entry = cartItems[id];
      if (typeof entry === "number") {
        // Only add if quantity is greater than 0
        if (entry > 0) {
          list.push({ product, size: "Regular", quantity: entry });
        }
      } else {
        for (const size in entry) {
          // Only add if quantity is greater than 0
          if (entry[size] > 0) {
            list.push({ product, size, quantity: entry[size] });
          }
        }
      }
    }
    return list;
  }, [cartItems, products]);

  const subtotal = getCartAmount();
  const deliveryFee = 50;
  const total = subtotal + deliveryFee;

  /* 🧠 Smart Recommendation Logic */
  useEffect(() => {
    if (!cartList.length) {
      setRecommended([]);
      return;
    }

    const categories = cartList.map((item) =>
      item.product.category?.toLowerCase()
    );

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

    // Avoid flicker by picking a fixed slice once
    setRecommended([...rec].sort(() => 0.5 - Math.random()).slice(0, 4));
  }, [cartList, products]);

  return (
    <div className="min-h-[90vh] bg-gradient-to-b from-white via-gray-100 to-gray-200 py-20 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back to Wishlist */}
        <div className="flex justify-start mb-10 lg:mt-8">
          <button
            onClick={() => navigate("/wishlist")}
            className="flex items-center gap-2 text-gray-700 hover:text-black transition-all duration-300 text-base sm:text-lg font-medium tracking-wide group"
          >
            <ArrowLeft
              className="w-6 h-6 sm:w-8 sm:h-8 group-hover:-translate-x-1 transition-transform duration-300"
              strokeWidth={1.5}
            />
            <span className="uppercase text-sm sm:text-base tracking-widest">
              Back to Wishlist
            </span>
          </button>
        </div>

        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl tracking-[6px] font-light text-gray-900 uppercase">
            My <span className="font-semibold">Cart</span>
          </h1>
          <div className="mt-3 w-24 h-[1px] bg-gray-800 mx-auto"></div>
        </div>

        {/* Empty Cart */}
        {cartList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-gray-600">
            <p className="text-lg mb-4 font-light tracking-wide">
              Your cart is empty.
            </p>
            <button
              onClick={() => navigate("/collection")}
              className="border border-black px-8 py-3 text-sm tracking-wide uppercase hover:bg-black hover:text-white transition-all duration-300"
            >
              Explore Collection
            </button>
          </div>
        ) : (
          <>
            {/* Cart Section */}
            <div className="flex flex-col lg:flex-row justify-between gap-10 mt-12">
              {/* LEFT SIDE – Items */}
              <div className="flex-1 space-y-8">
                {cartList.map(({ product, size, quantity }, index) => (
                  <motion.div
                    key={`${product._id}-${size}-${index}`}
                    whileHover={{ scale: 1.01 }}
                    className="bg-white rounded-3xl shadow-md hover:shadow-xl border border-gray-200 transition-all duration-500 flex flex-col sm:flex-row items-center gap-6 p-6"
                  >
                    {/* Image */}
                    <Link
                      to={`/product/${product._id}`}
                      className="w-36 h-36 flex-shrink-0 overflow-hidden rounded-2xl border border-gray-100"
                    >
                      <img
                        src={product.image[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </Link>

                    {/* Info */}
                    <div className="flex flex-col sm:flex-row justify-between w-full items-center sm:items-start gap-6">
                      <div className="text-center sm:text-left flex-1">
                        <h3 className="text-lg font-medium uppercase text-gray-900 tracking-wide mb-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">
                          {currency}
                          {product.price}
                        </p>
                        <p className="text-xs font-medium text-gray-500 tracking-wider uppercase mb-3">
                          Size:{" "}
                          <span className="text-gray-900 font-semibold">
                            {size}
                          </span>
                        </p>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              updateQuantity(
                                product._id,
                                size,
                                Math.max(1, quantity - 1)
                              )
                            }
                            className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-400 hover:bg-gray-100 text-sm"
                          >
                            −
                          </button>
                          <span className="text-gray-800 font-medium min-w-[24px] text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(product._id, size, quantity + 1)
                            }
                            className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-400 hover:bg-gray-100 text-sm"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(product._id, size)}
                        className="text-gray-400 hover:text-red-600 transition-all duration-300"
                        title="Remove"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* RIGHT SIDE – Cart Total */}
              <div className="w-full lg:max-w-sm bg-white rounded-3xl shadow-xl border border-gray-200 p-8 self-start sticky top-24">
                <CartTotal />

                <button
                  onClick={() => navigate("/place-order")}
                  className="mt-8 w-full bg-gradient-to-r from-black via-gray-900 to-gray-800 text-white py-3 rounded-full tracking-widest uppercase text-sm hover:scale-[1.02] transition-all duration-300 shadow-lg"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>

            {/* You May Also Like */}
            {recommended.length > 0 && (
              <div className="mt-20">
                <h2 className="text-2xl sm:text-3xl font-semibold text-black text-center tracking-[3px] uppercase mb-8">
                  🖤 You May Also Like 🖤
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
                            {currency}
                            {item.price}
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

export default Cart;