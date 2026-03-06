import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WhatsAppButton from "../components/WhatsAppButton";
import { Quote } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const FoundersVision = () => {
  const heroTextRef = useRef(null);
  const heroImageRef = useRef(null);

  useEffect(() => {
    // Hero text animation
    gsap.from(heroTextRef.current, {
      opacity: 0,
      y: 50,
      duration: 1.5,
      ease: "power3.out",
      delay: 0.3,
    });

    // Fade-up animation for each section
    gsap.utils.toArray(".fade-up").forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
        }
      );
    });

    // Parallax effect on images
    gsap.utils.toArray(".parallax-img").forEach((img) => {
      gsap.to(img, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: img,
          scrub: 1,
        },
      });
    });
  }, []);

  return (
    <div className="bg-white text-gray-900 overflow-hidden">
      {/* Hero Section */}
  {/* Hero Section - Minimalist */}
<section className="relative h-[80vh] flex items-center justify-center overflow-hidden mt-24">
  {/* Background Image with Overlay */}
  <div className="absolute inset-0">
    <img
      ref={heroImageRef}
      src="/images/poster11.webp"
      alt="Founder Vision"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-black/50"></div>
  </div>

  {/* Hero Content */}
  <div
    ref={heroTextRef}
    className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white"
  >
    <div className="mb-8">
      <div className="w-24 h-px bg-white mx-auto mb-8 opacity-50"></div>
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-light tracking-wider mb-6 leading-tight">
        Crafting <span className="italic font-normal">Elegance</span>
        <br />
        Defining <span className="italic font-normal">Style</span>
      </h1>
      <div className="w-24 h-px bg-white mx-auto mt-8 opacity-50"></div>
    </div>
    <p className="text-lg sm:text-xl font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
      At Jeanzy, we don't just design fashion — we craft emotions.
      Every piece tells a story of elegance, artistry, and passion.
    </p>
  </div>
</section>


      {/* Philosophy Section */}
      <section className="fade-up py-24 px-6 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="order-2 lg:order-1 relative overflow-hidden group">
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src="/images/poster11.webp"
                alt="Luxury details"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 parallax-img"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 w-48 h-48 border-2 border-gray-900 -z-10"></div>
          </div>

          {/* Text */}
          <div className="order-1 lg:order-2 space-y-8">
            <div>
              <div className="w-16 h-px bg-gray-900 mb-6"></div>
              <h2 className="text-4xl sm:text-5xl font-light tracking-wide leading-tight mb-6">
                Luxury Lies in the <span className="italic">Details</span>
              </h2>
            </div>
            <p className="text-lg text-gray-600 font-light leading-relaxed">
              Every Jeanzy creation embodies sophistication without compromise. 
              From the threads we choose to the final stitch, we ensure that excellence 
              is not just achieved — it's celebrated.
            </p>
            <p className="text-lg text-gray-600 font-light leading-relaxed">
              Our commitment to quality extends beyond aesthetics, ensuring every piece 
              carries longevity and timeless appeal.
            </p>
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="fade-up bg-gray-900 text-white py-24 px-6 sm:px-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="w-16 h-px bg-white mx-auto opacity-50"></div>
          <h2 className="text-4xl sm:text-5xl font-light tracking-wide leading-tight">
            Our Commitment to <span className="italic">Excellence</span>
          </h2>
          <p className="text-xl text-gray-300 font-light leading-relaxed max-w-3xl mx-auto">
            Each product is a dialogue between art and precision. We collaborate with 
            master artisans and ethically source the finest materials, ensuring every 
            creation stands the test of time — beautifully and responsibly.
          </p>
          <div className="w-16 h-px bg-white mx-auto opacity-50 mt-8"></div>
        </div>
      </section>

      {/* Inspiration Section */}
      <section className="fade-up py-24 px-6 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div className="space-y-8">
            <div>
              <div className="w-16 h-px bg-gray-900 mb-6"></div>
              <h2 className="text-4xl sm:text-5xl font-light tracking-wide leading-tight mb-6">
                Designed to <span className="italic">Empower</span>
              </h2>
            </div>
            <p className="text-lg text-gray-600 font-light leading-relaxed">
              Inspired by the modern visionary, our collections resonate with confidence, 
              grace, and individuality — each design reflecting who you are and where 
              you aspire to be.
            </p>
            <p className="text-lg text-gray-600 font-light leading-relaxed">
              Fashion is more than clothing; it’s an expression of your authentic self — 
              a celebration of your unique journey.
            </p>
          </div>

          {/* Image */}
          <div className="relative overflow-hidden group">
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src="/images/poster11.webp"
                alt="Inspiration"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 parallax-img"
              />
            </div>
            <div className="absolute -top-8 -left-8 w-48 h-48 border-2 border-gray-900 -z-10"></div>
          </div>
        </div>
      </section>

      {/* Founder’s Message */}
      <section className="fade-up py-24 px-6 sm:px-12 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-px bg-gray-900 mx-auto mb-6"></div>
            <h2 className="text-4xl sm:text-5xl font-light tracking-wide leading-tight">
              A Vision Rooted in <span className="italic">Passion</span>
            </h2>
          </div>

          <div className="bg-white border-2 border-gray-900 p-12 relative rounded-2xl shadow-lg">
            <Quote className="absolute top-8 left-8 w-12 h-12 text-gray-200" />
            <div className="relative z-10 space-y-6">
              <p className="text-xl text-gray-700 font-light leading-relaxed italic">
                What started as a dream to redefine modern luxury has grown into a movement — 
                one that celebrates authenticity, craftsmanship, and self-expression.
              </p>
              <p className="text-xl text-gray-700 font-light leading-relaxed italic">
                Every piece we create invites you to embrace your individuality and wear 
                your confidence boldly.
              </p>
              <div className="pt-6 mt-8 border-t border-gray-200">
                <p className="text-lg font-normal tracking-wide">— Founder, Jeanzy</p>
                <p className="text-sm text-gray-500 font-light tracking-widest uppercase mt-2">
                  Visionary & Creative Director
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="fade-up py-24 px-6 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <div className="w-16 h-px bg-gray-900 mx-auto mb-6"></div>
          <h2 className="text-4xl sm:text-5xl font-light tracking-wide">
            Our <span className="italic">Core Values</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Authenticity",
              description:
                "We stay true to our vision, creating pieces that reflect genuine artistry and timeless design.",
            },
            {
              title: "Excellence",
              description:
                "From concept to creation, every detail is refined to meet the highest standards of quality.",
            },
            {
              title: "Sustainability",
              description:
                "We are committed to ethical practices, ensuring our luxury has a positive impact on the world.",
            },
          ].map((value, idx) => (
            <div
              key={idx}
              className="group border-2 border-gray-900 p-10 hover:bg-gray-900 transition-all duration-500 rounded-xl"
            >
              <h3 className="text-2xl font-light tracking-wide mb-4 group-hover:text-white transition-colors duration-500">
                {value.title}
              </h3>
              <div className="w-12 h-px bg-gray-900 group-hover:bg-white mb-6 transition-colors duration-500 mx-auto"></div>
              <p className="text-gray-600 font-light leading-relaxed group-hover:text-gray-300 transition-colors duration-500">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <WhatsAppButton />
    </div>
  );
};

export default FoundersVision;
