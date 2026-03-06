import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Headphones, RotateCcw, Truck, Package } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const PremiumTimeline = () => {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);
  const itemRefs = useRef([]);

  const features = [
    {
      icon: Headphones,
      title: "24/7 Customer Support",
      description: "Round-the-clock assistance",
    },
    {
      icon: RotateCcw,
      title: "Easy Replacement",
      description: "Hassle-free returns",
    },
    {
      icon: Truck,
      title: "Priority Delivery",
      description: "Swift & secure shipping",
    },
    {
      icon: Package,
      title: "Premium Packaging",
      description: "Luxury in every detail",
    },
  ];

  useEffect(() => {
    // Animate the horizontal line
    if (lineRef.current) {
      gsap.from(lineRef.current, {
        scaleX: 0,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: lineRef.current,
          start: "top 80%",
        },
      });
    }

    // Animate each timeline item
    itemRefs.current.forEach((item, index) => {
      if (item) {
        gsap.from(item, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          delay: index * 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
          },
        });
      }
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-20 bg-transparent overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-6 py-2 border border-amber-700/30 text-amber-800 text-xs tracking-[0.3em] uppercase mb-6">
            Our Promise
          </div>
          <h2 className="text-3xl sm:text-4xl font-light text-gray-900 tracking-[0.15em] uppercase mb-3">
            Premium Experience
          </h2>
          <p className="text-gray-600 text-base tracking-wide">
            Excellence in every interaction
          </p>
        </div>
        {/* Timeline */}
        <div className="relative">
          {/* Horizontal Line */}
          <div
            ref={lineRef}
            className="absolute top-8 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-700/40 to-transparent origin-left hidden md:block"
          ></div>

          {/* Timeline Items */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={index}
                  ref={(el) => (itemRefs.current[index] = el)}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Circle Node */}
                  <div className="relative z-10 w-16 h-16 rounded-full bg-white/80 backdrop-blur-sm border-2 border-amber-700/30 flex items-center justify-center shadow-md mb-6">
                    <Icon className="w-7 h-7 text-amber-800" strokeWidth={1.5} />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2 tracking-wide">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumTimeline;