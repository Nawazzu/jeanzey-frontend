import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { motion, AnimatePresence } from "framer-motion";
import { User, MapPin, Heart, ShoppingBag, X } from "lucide-react";
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenu]);

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

            {/* ── Mobile Hamburger ── */}
            <button
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px] cursor-pointer z-50 relative"
              onClick={() => setMobileMenu(!mobileMenu)}
              aria-label="Toggle menu"
            >
              <motion.span
                animate={mobileMenu ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className={`block w-6 h-[1.5px] origin-center ${scrolled ? "bg-white" : "bg-black"}`}
              />
              <motion.span
                animate={mobileMenu ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2 }}
                className={`block w-4 h-[1.5px] self-end ${scrolled ? "bg-white" : "bg-black"}`}
              />
              <motion.span
                animate={mobileMenu ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className={`block w-6 h-[1.5px] origin-center ${scrolled ? "bg-white" : "bg-black"}`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Premium Mobile Drawer ── */}
      <AnimatePresence>
        {mobileMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileMenu(false)}
            />

            {/* Drawer — slides in from right */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
              className="fixed top-0 right-0 h-full w-[75vw] max-w-[320px] bg-[#0c0c0c] z-50 md:hidden flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-white/10">
                <span
                  className="text-white text-lg tracking-[5px] uppercase"
                  style={{ fontFamily: "'Faster One', system-ui", fontWeight: 400 }}
                >
                  Jean-Zey
                </span>
                <button
                  onClick={() => setMobileMenu(false)}
                  className="w-8 h-8 flex items-center justify-center border border-white/20 text-white/70 hover:text-white hover:border-white/50 transition-all duration-200"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Nav Links */}
              <nav className="flex flex-col px-8 pt-8 gap-1 flex-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.07, duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setMobileMenu(false)}
                      className={`group flex items-center justify-between py-4 border-b border-white/8 transition-all duration-200 ${
                        location.pathname === link.to
                          ? "text-white"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      <span className="text-xs tracking-[4px] uppercase font-medium">
                        {link.name}
                      </span>
                      <motion.span
                        className="text-white/30 group-hover:text-white/70 transition-colors"
                        initial={{ x: 0 }}
                        whileHover={{ x: 4 }}
                      >
                        →
                      </motion.span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Drawer Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="px-8 pb-10 pt-6 border-t border-white/10"
              >
                {token && userData ? (
                  <div className="space-y-3">
                    <p className="text-white/40 text-[10px] tracking-[3px] uppercase mb-4">
                      Signed in as
                    </p>
                    <p className="text-white text-sm font-medium tracking-wide truncate">
                      {userData.name}
                    </p>
                    <p className="text-white/40 text-xs truncate mb-4">
                      {userData.email}
                    </p>
                    <button
                      onClick={() => { logout(); setMobileMenu(false); }}
                      className="w-full border border-white/20 text-white/70 text-[10px] tracking-[3px] uppercase py-3 hover:bg-white hover:text-black transition-all duration-300"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { navigate("/login"); setMobileMenu(false); }}
                    className="w-full bg-white text-black text-[10px] tracking-[3px] uppercase py-3 font-semibold hover:bg-white/90 transition-all duration-300"
                  >
                    Sign In
                  </button>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Saved Addresses Modal */}
      <SavedAddresses
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
      />
    </>
  );
};

export default Navbar;