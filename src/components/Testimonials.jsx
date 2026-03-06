import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const Testimonial = () => {
 const testimonials = [
    {
      name: "Sayed Nawaz",
      city: "Mumbai",
      content:
        "I honestly wasn’t expecting this level of quality at this price. The fit is perfect and the fabric feels really comfortable. Definitely ordering again!",
    },
    {
      name: "Nazia Khan",
      city: "Delhi",
      content:
        "What I love most is how stylish yet affordable everything is. The stitching and finishing are neat, and the jeans fit exactly as shown in the pictures.",
    },
    {
      name: "Imran Shaikh",
      city: "Bangalore",
      content:
        "Finally found a brand that balances trend and comfort. The denim feels premium, doesn’t lose shape, and looks great even after multiple washes.",
    },
];


  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      gsap.from(sectionRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    }

    if (titleRef.current) {
      gsap.from(titleRef.current, {
        opacity: 0,
        y: -30,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 90%",
        },
      });
    }
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 px-6 sm:px-12 overflow-hidden border border-gray-200/30 backdrop-blur-sm rounded-2xl"
      style={{
        backgroundColor: "transparent",
      }}
    >
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <h2
            ref={titleRef}
            className="text-3xl sm:text-4xl font-light text-gray-900 tracking-[0.15em] uppercase relative inline-block"
          >
            What Our Customers Says
            {/* Underline with shadow */}
            <span className="block w-16 h-[2px] bg-gray-800 mx-auto mt-3 shadow-[0_2px_6px_rgba(0,0,0,0.3)] rounded-full"></span>
          </h2>
        </div>

        {/* Testimonial Content */}
        <div className="text-center mb-16">
          {/* Quote */}
          <div className="mb-12">
            <p className="text-gray-700 text-2xl sm:text-3xl md:text-4xl font-light leading-relaxed italic tracking-wide">
              "{currentTestimonial.content}"
            </p>
          </div>

          {/* Stars */}
          <div className="flex gap-2 justify-center mb-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} width="20" height="20" viewBox="0 0 20 20" fill="#D4AF37">
                <path d="M10 0l2.245 6.91h7.265l-5.878 4.27 2.245 6.91L10 13.82l-5.877 4.27 2.245-6.91L.49 6.91h7.265L10 0z" />
              </svg>
            ))}
          </div>

          {/* Name and City */}
          <div className="mb-3">
            <h3 className="font-medium text-xl text-gray-900 tracking-wide">
              {currentTestimonial.name}
            </h3>
          </div>
          <p className="text-gray-500 text-sm tracking-widest uppercase mb-12">
            {currentTestimonial.city}
          </p>

          {/* Navigation Arrows */}
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full bg-transparent border border-gray-300 flex items-center justify-center text-gray-800 hover:bg-gray-100/50 transition-all shadow-sm"
            >
              <ChevronLeft size={24} strokeWidth={1.5} />
            </button>

            {/* Pagination Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-gray-800 w-8"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full bg-transparent border border-gray-300 flex items-center justify-center text-gray-800 hover:bg-gray-100/50 transition-all shadow-sm"
            >
              <ChevronRight size={24} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
