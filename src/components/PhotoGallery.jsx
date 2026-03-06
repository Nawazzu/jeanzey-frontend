import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PhotoGallery = () => {
  const images = [
    { id: 1, src: "/images/img1.jpg", title: "YouTuber - Behind the Scenes" },
    { id: 2, src: "/images/img2.jpg", title: "Pro Gamer with Gear" },
    { id: 3, src: "/images/img3.jpg", title: "Content Creator Setup" },
    { id: 4, src: "/images/img4.jpg", title: "Vlogger Travel Essentials" },
    { id: 5, src: "/images/img5.jpg", title: "Photographer on the Move" },
    { id: 7, src: "/images/img7.jpg", title: "Influencer Lifestyle Shoot" },
    { id: 8, src: "/images/img8.jpg", title: "Professional Streamer Gear" },
    { id: 9, src: "/images/img9.jpg", title: "Creative Studio Setup" },
    { id: 10, src: "/images/img10.jpg", title: "Popular Influencer Collab" },
  ];

  const [startIndex, setStartIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState(null);
  const imagesPerPage = 6;

  // Refs for animation
  const titleRef = useRef(null);
  const paragraphRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setStartIndex((prevIndex) =>
        (prevIndex + imagesPerPage) % images.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    // Animate title - fade in from top
    gsap.from(titleRef.current, {
      opacity: 0,
      y: -50,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: titleRef.current,
        start: 'top 80%',
      },
    });

    // Animate paragraph - fade in with delay
    gsap.from(paragraphRef.current, {
      opacity: 0,
      y: 30,
      duration: 1.2,
      delay: 0.3,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: paragraphRef.current,
        start: 'top 80%',
      },
    });
  }, []);

  const currentImages = images.slice(startIndex, startIndex + imagesPerPage);
  const displayedImages =
    currentImages.length < imagesPerPage
      ? [...currentImages, ...images.slice(0, imagesPerPage - currentImages.length)]
      : currentImages;

  return (
    <div className="w-full px-6 md:px-20 py-16 bg-gray-100">
      {/* Title with GSAP animation */}
      <h2
        ref={titleRef}
        className="text-4xl font-semibold text-center text-black font-['Playfair_Display'] mb-4 tracking-wide"
      >
        Our Proud Customers
      </h2>

      {/* Paragraph with GSAP animation */}
      <p
        ref={paragraphRef}
        className="text-center text-lg text-gray-600 max-w-3xl mx-auto mb-12 font-['Montserrat']"
      >
        From <span className="font-semibold">YouTubers</span> and{" "}
        <span className="font-semibold">Gamers</span> to{" "}
        <span className="font-semibold">Content Creators</span>,{" "}
        <span className="font-semibold">Professionals</span>, and{" "}
        <span className="font-semibold">Influencers</span> — our community of creators
        trust us for premium cameras, lenses, and bags that power their journeys.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {displayedImages.map((image) => (
            <motion.div
              key={image.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer transform hover:-translate-y-2 transition-all duration-500 flex flex-col"
              onClick={() => setLightboxImage(image)}
            >
              <motion.img
                src={image.src}
                alt={image.title}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
                className="w-full h-[250px] md:h-[300px] object-cover"
              />
              <motion.h3
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.7 }}
                className="text-lg font-medium text-center text-gray-800 py-4 font-['Montserrat']"
              >
                {image.title}
              </motion.h3>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setLightboxImage(null)}
          >
            <motion.img
              src={lightboxImage.src}
              alt={lightboxImage.title}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="max-h-[90vh] max-w-[90vw] rounded-2xl shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhotoGallery;