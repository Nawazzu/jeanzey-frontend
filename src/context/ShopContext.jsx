import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₹";
  const delivery_fee = 50; // ✅ Updated from 10 → 50
   const priorityDeliveryFee = 100; // ✅ Add this new constant
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  /* ------------------ 🖤 GLASSY TOAST ------------------ */
  const glassToast = (message, type = "info") =>
    toast[type](message, {
      style: {
        background: "rgba(15, 15, 15, 0.75)",
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

  /* ---------------- CART ---------------- */
  const addToCart = async (itemId, size = null, silent = false) => {
    const id = String(itemId).trim();
    const product = products.find((p) => String(p._id) === id);

    const requiresSize =
      product &&
      ["shirt", "tshirt", "jeans", "combo"].some((cat) =>
        product.category?.toLowerCase().includes(cat)
      );

    if (requiresSize && !size) {
      if (!silent)
        glassToast("Please select a size before adding to cart.", "info");
      navigate(`/product/${id}`);
      return;
    }

    let cartData = structuredClone(cartItems);
    if (!cartData[id]) cartData[id] = {};
    if (typeof cartData[id] === "number")
      cartData[id] = { Regular: cartData[id] };

    const selectedSize = size || "Regular";
    cartData[id][selectedSize] = (cartData[id][selectedSize] || 0) + 1;
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/add`,
          { itemId: id, size: selectedSize },
          { headers: { token } }
        );
      } catch (error) {
        if (!silent) glassToast(error.message, "error");
      }
    }

    if (!silent) glassToast("Item added to cart", "success");
  };

  const updateQuantity = async (itemId, size = "Regular", quantity) => {
    const id = String(itemId).trim();
    let cartData = structuredClone(cartItems);

    if (quantity <= 0) {
      if (cartData[id] && cartData[id][size] !== undefined) {
        delete cartData[id][size];
        if (Object.keys(cartData[id]).length === 0) delete cartData[id];
      }
    } else {
      if (!cartData[id]) cartData[id] = {};
      cartData[id][size] = quantity;
    }

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/update`,
          { itemId: id, size, quantity },
          { headers: { token } }
        );
      } catch (error) {
        glassToast(error.message, "error");
      }
    }
  };

  const removeFromCart = async (itemId, size = "Regular") => {
    await updateQuantity(itemId, size, 0);
    glassToast("Removed from cart", "info");
  };

  const getCartCount = () => {
    let total = 0;
    for (const id in cartItems) {
      const item = cartItems[id];
      if (typeof item === "number") total += item;
      else if (typeof item === "object")
        for (const sz in item) total += item[sz];
    }
    return total;
  };

  const getCartAmount = () => {
    let amount = 0;
    for (const id in cartItems) {
      const product = products.find(
        (p) => String(p._id).trim() === String(id).trim()
      );
      if (!product) continue;

      const entry = cartItems[id];
      if (typeof entry === "number")
        amount += entry * Number(product.price || 0);
      else if (typeof entry === "object")
        for (const sz in entry)
          amount += entry[sz] * Number(product.price || 0);
    }
    return amount;
  };

  /* ---------------- PRODUCTS ---------------- */
  const getProductsData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/product/list`);
      if (res.data.success) setProducts(res.data.products.reverse());
    } catch (err) {
      glassToast(err.message, "error");
    }
  };

  /* ---------------- USER CART ---------------- */
  const getUserCart = async (tk) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/cart/get`,
        {},
        { headers: { token: tk } }
      );
      if (res.data.success) {
        const normalized = {};
        for (const key in res.data.cartData || {}) {
          const id = String(key).trim();
          normalized[id] = {};
          for (const size in res.data.cartData[key]) {
            const validSize = size || "Regular";
            normalized[id][validSize] = res.data.cartData[key][size];
          }
        }
        setCartItems(normalized);
      }
    } catch (err) {
      glassToast(err.message, "error");
    }
  };

  /* ---------------- WISHLIST ---------------- */
  const getWishlist = async (tk) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/wishlist/get`,
        {},
        { headers: { token: tk } }
      );
      if (res.data.success) {
        const ids = Array.isArray(res.data.wishlist)
          ? res.data.wishlist.map((p) => p._id || p)
          : [];
        setWishlist(ids);
        localStorage.setItem("wishlist", JSON.stringify(ids));
      }
    } catch {
      const local = localStorage.getItem("wishlist");
      if (local) setWishlist(JSON.parse(local));
    }
  };

  const isInWishlist = (pid) => wishlist.includes(pid);

  const addToWishlist = async (pid, silent = false) => {
    if (wishlist.includes(pid)) return;
    const updated = [pid, ...wishlist];
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/wishlist/add`,
          { productId: pid },
          { headers: { token } }
        );
      } catch {}
    }
    if (!silent) glassToast("Added to wishlist", "success");
  };

  const removeFromWishlist = async (pid, silent = false) => {
    const updated = wishlist.filter((id) => id !== pid);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/wishlist/remove`,
          { productId: pid },
          { headers: { token } }
        );
      } catch {}
    }
    if (!silent) glassToast("Removed from wishlist", "info");
  };

  const toggleWishlist = async (pid, silent = false) =>
    isInWishlist(pid)
      ? removeFromWishlist(pid, silent)
      : addToWishlist(pid, silent);

  /* ---------------- LIFECYCLE ---------------- */
  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("token");
    const storedUser = localStorage.getItem("userData");
    const localWish = localStorage.getItem("wishlist");

    if (localWish) {
      try {
        setWishlist(JSON.parse(localWish));
      } catch {}
    }

    if (!token && stored) {
      setToken(stored);
      getUserCart(stored);
      getWishlist(stored);
    } else if (token) {
      getUserCart(token);
      getWishlist(token);
    }

    if (storedUser) {
      try {
        setUserData(JSON.parse(storedUser));
      } catch {}
    }
  }, [token]);

  return (
    <ShopContext.Provider
      value={{
        products,
        currency,
        delivery_fee,
         priorityDeliveryFee, // ✅ Add this line
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        setCartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        getCartCount,
        getCartAmount,
        backendUrl,
        navigate,
        token,
        setToken,
        userData,
        setUserData,
        wishlist,
        isInWishlist,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        glassToast,
      }}
    >
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
