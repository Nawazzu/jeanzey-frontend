import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ComingSoon = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f7f5f2] text-gray-900 px-6 sm:px-12 lg:px-24 relative">

      {/* Animated Title */}
      <motion.h1
        className="text-5xl sm:text-7xl font-extralight tracking-widest uppercase text-[#b8860b] mb-6 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Coming Soon
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="text-center text-lg sm:text-2xl text-gray-700 mb-10 max-w-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        Something luxurious is on its way. Get ready for exclusive releases and limited editions.
      </motion.p>

      {/* Button */}
      <motion.button
        onClick={() => navigate("/collection")}
        className="bg-gradient-to-r from-[#b8860b] via-[#d4af37] to-[#ffd700] text-gray-900 font-semibold px-8 py-3 rounded-full uppercase tracking-widest shadow-lg hover:scale-105 transition-transform duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Explore Collection
      </motion.button>

      {/* Decorative Line */}
      <motion.div
        className="absolute bottom-16 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#b8860b]/50 to-transparent"
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ delay: 1, duration: 1 }}
      />
    </div>
  );
};

export default ComingSoon;
