import React from "react";
import { motion } from "framer-motion";
import Title from "../components/Title";
import AnimatedBanner from "../components/AnimatedBanner";
import { Link } from "react-router-dom";

const giftsData = [
  {
    title: "Crochet Products",
    description:
      "Enjoy complimentary crochet goodies like bags, bunny keychains, baking gloves, hair clips, handbags, caps, flowers, and more, handpicked to make your unboxing experience unforgettable.",
    img: "/images/comp2.webp",
  },
  {
    title: "Polaroid Memories",
    description:
      "We capture a special moment of you with your new purchase and gift you a Polaroid frame photo. Perfect to place behind your phone cover or anywhere you love!",
    img: "/images/comp1.webp",
  },
  {
    title: "Luxury Perfumes",
    description:
      "A small complimentary perfume accompanies every order, adding a fragrant touch to your premium shopping experience.",
    img: "/images/comp3.webp",
  },
];

const OurGifts = () => {
  return (
    <div className="min-h-screen bg-[#f7f5f2] px-6 sm:px-12 lg:px-24 py-20">
      {/* Page Title */}
      <div className="text-center mb-20">
        <motion.h1
          className="text-[3rem] sm:text-[4rem] md:text-[5rem] font-extrabold uppercase tracking-widest text-gray-900"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Our Gifts
        </motion.h1>
        <motion.p
          className="mt-4 text-gray-700 max-w-3xl mx-auto text-base sm:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          At Jeanzey, we believe in making every delivery a luxurious experience. From handcrafted crochet products to Polaroid memories and exquisite perfumes, every order comes with thoughtful complimentary gifts that celebrate you.
        </motion.p>
      </div>

      {/* Gift Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {giftsData.map((gift, idx) => (
          <motion.div
            key={idx}
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 flex flex-col items-center text-center hover:shadow-2xl transition-shadow duration-300"
            whileHover={{ scale: 1.05, boxShadow: "0px 20px 40px rgba(0,0,0,0.2)" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2, duration: 0.6 }}
          >
            <div className="w-full h-64 mb-6 overflow-hidden rounded-2xl">
              <img
                src={gift.img}
                alt={gift.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3">
              {gift.title}
            </h3>
            <p className="text-gray-700 text-sm sm:text-base">{gift.description}</p>
          </motion.div>
        ))}
      </div>

      <AnimatedBanner />

      {/* Why We Gift Section */}
      <div className="mt-20 max-w-4xl mx-auto text-center">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Why We Gift
        </motion.h2>
        <motion.p
          className="text-gray-700 text-base sm:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Every gift is carefully curated to make your experience with Jeanzey unforgettable. We believe in celebrating our customers, making every unboxing moment memorable, and adding a touch of luxury to your everyday life.
        </motion.p>
      </div>

      {/* ✅ Added Button Section */}
      <div className="flex justify-center mt-12">
        <Link
          to="/place-order"
          className="bg-black text-white px-8 py-3 rounded-full uppercase tracking-widest text-sm font-light hover:bg-gray-900 transition-colors duration-300 shadow-lg"
        >
          Place Your Order
        </Link>
      </div>

      {/* Footer Note */}
      <div className="mt-20 text-center text-sm sm:text-base font-medium tracking-wide text-gray-800 relative">
        <div className="mt-20 text-center text-black text-base sm:text-lg font-medium tracking-wide relative">
          All gifts are provided exclusively at the time of delivery with your Jeanzey purchase.
        </div>
        <div className="mt-2 w-24 h-[2px] mx-auto bg-gradient-to-r from-[#b8860b] via-[#d4af37] to-[#b8860b] rounded-full"></div>
      </div>
    </div>
  );
};

export default OurGifts;
