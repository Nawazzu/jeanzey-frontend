import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { motion, AnimatePresence } from "framer-motion";
import { User, MapPin, Heart, ShoppingBag } from "lucide-react";
import SavedAddresses from "./SavedAddresses";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const dropdownRef = useRef(null);

  const {
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
    userData,
    setUserData,
    wishlist,
  } = useContext(ShopContext);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setVisible(false);
      }
    };
    const handleScroll = () => setVisible(false);
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (location.pathname === "/login") return null;

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setToken("");
    setCartItems({});
    setUserData(null);
    setVisible(false);
  };

  const navLinks = [
    { name: "HOME", to: "/" },
    { name: "COLLECTION", to: "/collection" },
    { name: "ABOUT", to: "/about" },
    { name: "CONTACT", to: "/contact" },
  ];

  const getFirstName = () =>
    userData?.name ? userData.name.split(" ")[0] : "Guest";

  return (
    <>
      <nav
        className={`w-screen fixed top-0 left-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/80 backdrop-blur-md shadow-md"
            : "bg-white bg-opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span
              className={`text-lg sm:text-2xl tracking-[5px] ${
                scrolled ? "text-white" : "text-black"
              }`}
              style={{ fontFamily: "'Faster One', system-ui", fontWeight: 400 }}
            >
              JEAN-ZEY
            </span>
          </Link>

          {/* Desktop Navigation */}
          {/* ✅ font size bumped from text-sm to text-[15px], wrapped each link in motion.div for glow */}
          <ul className="hidden md:flex gap-10 text-[15px] tracking-wider font-semibold uppercase">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              const color = scrolled
                ? isActive ? "text-white" : "text-gray-300"
                : isActive ? "text-black" : "text-black";

              return (
                <motion.li
                  key={link.to}
                  whileHover={{
                    filter: "drop-shadow(0 0 6px rgba(255,255,255,0.85))",
                  }}
                  transition={{ duration: 0.2 }}
                  className="list-none"
                >
                  <NavLink
                    to={link.to}
                    className={`relative group transition-all duration-300 ${color}`}
                  >
                    {link.name}
                    <span className="absolute bottom-[-6px] left-0 w-0 group-hover:w-full h-[1px] bg-current transition-all duration-300"></span>
                  </NavLink>
                </motion.li>
              );
            })}
          </ul>

          {/* Right Icons */}
          <div className="flex items-center gap-4 md:gap-6">

            {/* Wishlist Icon */}
            <Link to="/wishlist" className="relative">
              <motion.div
                whileHover={{
                  scale: 1.1,
                  filter: "drop-shadow(0 0 4px white)",
                }}
                className="cursor-pointer flex items-center justify-center"
              >
                <Heart
                  className={`w-5 h-5 ${scrolled ? "text-white" : "text-black"}`}
                  fill={wishlist.length > 0 ? (scrolled ? "white" : "black") : "none"}
                />
              </motion.div>
              {wishlist.length > 0 && (
                <span className="absolute -right-2 -bottom-2 w-4 h-4 flex items-center justify-center bg-white text-black text-[9px] font-semibold rounded-full">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* User Profile */}
            <div
              className="relative group"
              ref={dropdownRef}
              onMouseEnter={() => setVisible(true)}
              onMouseLeave={() => setVisible(false)}
            >
              {token && userData ? (
                <motion.div
                  whileHover={{
                    scale: 1.1,
                    filter: "drop-shadow(0 0 4px white)",
                  }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setVisible(!visible)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <User
                    className={`w-5 h-5 ${scrolled ? "text-white" : "text-black"}`}
                  />
                  <span
                    className={`hidden sm:inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      scrolled
                        ? "bg-white text-black shadow-md"
                        : "bg-black text-white shadow-lg"
                    }`}
                  >
                    {getFirstName()}
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  whileHover={{
                    scale: 1.1,
                    filter: "drop-shadow(0 0 4px white)",
                  }}
                  transition={{ duration: 0.2 }}
                  onClick={() => navigate("/login")}
                  className="cursor-pointer flex items-center justify-center"
                >
                  <User
                    className={`w-5 h-5 ${scrolled ? "text-white" : "text-black"}`}
                  />
                </motion.div>
              )}

              {/* Dropdown Menu */}
              <AnimatePresence>
                {visible && token && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 bg-white text-black rounded-lg shadow-xl py-2 w-56 border border-gray-100 z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">
                        {userData?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {userData?.email || ""}
                      </p>
                    </div>
                    <Link
                      to="/orders"
                      className="block px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2 border-b border-gray-100"
                    >
                      <ShoppingBag size={16} />
                      My Orders
                    </Link>
                    <Link
                      to="/wishlist"
                      className="block px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2 border-b border-gray-100"
                    >
                      <Heart size={16} />
                      My Wishlist
                    </Link>
                    <button
                      onClick={() => {
                        setShowAddressModal(true);
                        setVisible(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2 border-b border-gray-100"
                    >
                      <MapPin size={16} />
                      Saved Addresses
                    </button>
                    <div className="flex justify-center items-center py-3">
                      <button
                        onClick={logout}
                        className="w-11/12 bg-black text-white py-2 text-sm font-semibold rounded-md hover:bg-red-600 transition-all duration-300 border border-gray-200"
                      >
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart Icon */}
            <Link to="/cart" className="relative" id="cart-icon">
              <motion.div
                whileHover={{
                  scale: 1.1,
                  filter: "drop-shadow(0 0 4px white)",
                }}
                transition={{ duration: 0.2 }}
                className="cursor-pointer flex items-center justify-center"
              >
                <ShoppingBag
                  className={`w-5 h-5 ${scrolled ? "text-white" : "text-black"}`}
                />
              </motion.div>
              {getCartCount() > 0 && (
                <p className="absolute right-[-6px] bottom-[-6px] w-4 h-4 flex items-center justify-center bg-white text-black text-[9px] font-semibold rounded-full">
                  {getCartCount()}
                </p>
              )}
            </Link>

            {/* Mobile Menu Icon */}
            <div
              className="md:hidden flex flex-col gap-1 cursor-pointer z-50"
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              <span className={`w-6 h-0.5 transition-all duration-300 ${scrolled ? "bg-white" : "bg-black"} ${mobileMenu ? "rotate-45 translate-y-1.5" : ""}`}></span>
              <span className={`w-6 h-0.5 transition-all duration-300 ${scrolled ? "bg-white" : "bg-black"} ${mobileMenu ? "opacity-0" : ""}`}></span>
              <span className={`w-6 h-0.5 transition-all duration-300 ${scrolled ? "bg-white" : "bg-black"} ${mobileMenu ? "-rotate-45 -translate-y-1.5" : ""}`}></span>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenu && (
              <div className="absolute top-16 left-0 w-full bg-white/95 backdrop-blur-xl flex flex-col items-center gap-6 py-6 shadow-xl transition-all duration-500 z-40">
                <a href="/" className="text-black text-lg tracking-wide hover:text-gray-700 transition-all" onClick={() => setMobileMenu(false)}>Home</a>
                <a href="/collection" className="text-black text-lg tracking-wide hover:text-gray-700 transition-all" onClick={() => setMobileMenu(false)}>Collection</a>
                <a href="/about" className="text-black text-lg tracking-wide hover:text-gray-700 transition-all" onClick={() => setMobileMenu(false)}>About</a>
                <a href="/contact" className="text-black text-lg tracking-wide hover:text-gray-700 transition-all" onClick={() => setMobileMenu(false)}>Contact</a>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Saved Addresses Modal */}
      <SavedAddresses
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
      />
    </>
  );
};

export default Navbar;