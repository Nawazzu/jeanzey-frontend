import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Title from "../components/Title";
import { Award, Shield, Truck, Star, Heart, Users } from "lucide-react";
import WhatsAppButton from "../components/WhatsAppButton";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const featureRef = useRef(null);
  const expRef = useRef(null);
  const testimonialRef = useRef(null);
  const statsRef = useRef(null);
  const heritageRef = useRef(null);
  const craftsmanshipRef = useRef(null);
  const mumbaiRef = useRef(null);

  useEffect(() => {
    const sections = [
      contentRef,
      featureRef,
      expRef,
      testimonialRef,
      statsRef,
      heritageRef,
      craftsmanshipRef,
      mumbaiRef,
    ];
    sections.forEach((ref) => {
      if (ref.current) {
        gsap.from(ref.current, {
          y: 80,
          opacity: 0,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
          },
        });
      }
    });

    if (titleRef.current) {
      gsap.from(titleRef.current, {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.3,
      });
    }
  }, []);

  return (
    <>
      <div className="bg-white text-gray-900">
        {/* Hero Section with Luxury Title */}
        <div
          ref={titleRef}
          className="relative h-[45vh] flex items-center justify-center bg-white text-gray-900 pt-16"
        >
          <div className="text-center space-y-8">
            <div className="mb-6 scale-150">
              <Title text1="ABOUT" text2="JEANZY" />
            </div>
            <p className="text-2xl tracking-[0.3em] uppercase font-light">
              Defining Luxury Since Inception
            </p>
            <div className="w-32 h-px bg-gray-900 mx-auto opacity-50"></div>
          </div>
        </div>

        {/* Intro Content */}
        <div ref={contentRef} className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-light tracking-wide leading-tight">
                Where <span className="italic">Elegance</span> Meets{" "}
                <span className="italic">Excellence</span>
              </h2>
              <div className="w-24 h-px bg-gray-900"></div>
              <p className="text-lg leading-relaxed text-gray-600 font-light">
                Jeanzy is not merely a brand—it is an embodiment of refined
                taste and uncompromising quality. Founded on the principles of
                timeless elegance, our collections span luxury apparel,
                exquisite fragrances, handcrafted accessories, and premium
                cosmetics.
              </p>
              <p className="text-lg leading-relaxed text-gray-600 font-light">
                Each piece is meticulously curated to reflect sophistication,
                representing a lifestyle where every detail matters. We invite
                you to experience fashion that transcends trends and embraces
                the art of living beautifully.
              </p>
            </div>
            <div className="relative">
              <picture>
                <source srcSet="/images/about1.webp" type="image/webp" />
                <img
                  src="/images/about1.jpg"
                  alt="About Jeanzy - Luxury Fashion Brand"
                  className="w-full h-[600px] object-cover shadow-2xl"
                  loading="lazy"
                />
              </picture>
              <div className="absolute -bottom-8 -left-8 w-48 h-48 border-2 border-gray-900 -z-10"></div>
            </div>
          </div>
        </div>

        {/* Premium Stats Section */}
        <div ref={statsRef} className="bg-gray-50 py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
              {[
                { number: "50K+", label: "Discerning Clients" },
                { number: "10+", label: "Years of Mastery" },
                { number: "200+", label: "Curated Pieces" },
                { number: "98%", label: "Client Satisfaction" },
              ].map(({ number, label }, idx) => (
                <div key={idx} className="text-center space-y-3">
                  <h3 className="text-5xl font-light text-gray-900">
                    {number}
                  </h3>
                  <p className="text-sm uppercase tracking-widest text-gray-600">
                    {label}
                  </p>
                  <div className="w-12 h-px bg-gray-900 mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 🌆 Proudly Born in Mumbai Section */}
        <div ref={mumbaiRef} className="relative bg-black text-white py-24 px-6">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-light tracking-wide leading-tight">
              Proudly Born in <span className="italic text-silver">Mumbai</span>
            </h2>
            <div className="w-24 h-px bg-white mx-auto opacity-50"></div>
            <p className="text-lg text-gray-300 leading-relaxed font-light max-w-3xl mx-auto">
              From the heart of India's fashion capital, Jeanzey emerged with a
              vision to redefine modern luxury. Each design captures the vibrant
              rhythm of Mumbai — a city where tradition meets innovation,
              energy meets elegance, and every detail tells a story. We're
              proud to serve our city and craft every piece with the passion,
              culture, and creativity that make Mumbai extraordinary.
            </p>
            <p className="text-sm tracking-widest text-gray-400 uppercase">
              Delivering Exclusively Across Mumbai 🏙️
            </p>
          </div>
          <div className="absolute inset-0 bg-[url('/images/mumbai-skyline.jpg')] bg-cover bg-center opacity-10"></div>
        </div>

        {/* Heritage & Philosophy */}
        <div ref={heritageRef} className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16 space-y-6">
            <h2 className="text-4xl font-light tracking-wide">Our Heritage</h2>
            <div className="w-24 h-px bg-gray-900 mx-auto"></div>
            <p className="text-lg text-gray-600 font-light max-w-3xl mx-auto leading-relaxed">
              Born from a passion for perfection, Jeanzy represents the
              convergence of traditional craftsmanship and contemporary
              aesthetics. Our philosophy is simple: create pieces that stand the
              test of time.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                icon: Heart, 
                title: "Passion for Perfection", 
                desc: "Every creation begins with an unwavering commitment to excellence and attention to the finest details." 
              },
              { 
                icon: Shield, 
                title: "Uncompromising Quality", 
                desc: "We source only the finest materials and employ artisans who share our dedication to superior craftsmanship." 
              },
              { 
                icon: Users, 
                title: "Exclusive Experience", 
                desc: "Our clients are part of an elite community that values sophistication, elegance, and timeless style." 
              },
            ].map(({ icon: Icon, title, desc }, idx) => (
              <div key={idx} className="text-center space-y-4 group">
                <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-gray-900 rounded-full mb-4 group-hover:bg-gray-900 transition-all duration-500">
                  <Icon className="w-7 h-7 text-gray-900 group-hover:text-white transition-colors duration-500" />
                </div>
                <h4 className="text-xl font-light tracking-wide">{title}</h4>
                <p className="text-gray-600 font-light leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Craftsmanship Showcase */}
        <div ref={craftsmanshipRef} className="bg-black text-white py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-6">
              <h2 className="text-4xl font-light tracking-wide">The Art of Craftsmanship</h2>
              <div className="w-24 h-px bg-white mx-auto opacity-50"></div>
              <p className="text-lg text-gray-300 font-light max-w-3xl mx-auto leading-relaxed">
                Behind every Jeanzy piece lies hours of meticulous work, where tradition meets innovation 
                to create something truly extraordinary.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { img: "/images/packing1", title: "Exquisite Packaging", desc: "Unboxing luxury" },
                { img: "/images/about2", title: "Artisan Touch", desc: "Handcrafted with care" },
                { img: "/images/about3", title: "Timeless Collections", desc: "Curated for connoisseurs" },
              ].map(({ img, title, desc }, i) => (
                <div key={i} className="group relative overflow-hidden">
                  <div className="aspect-[3/4] overflow-hidden">
                    <picture>
                      <source srcSet={`${img}.webp`} type="image/webp" />
                      <img
                        src={`${img}.jpg`}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    </picture>
                  </div>
                  <div className="mt-6 text-center space-y-2">
                    <h3 className="text-xl font-light tracking-wide">{title}</h3>
                    <p className="text-sm text-gray-400 uppercase tracking-widest">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features - Luxury Style */}
        <div ref={featureRef} className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16 space-y-6">
            <h2 className="text-4xl font-light tracking-wide">The Jeanzy Collections</h2>
            <div className="w-24 h-px bg-gray-900 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Premium Clothing", desc: "Tailored to perfection with the finest fabrics" },
              { title: "Luxury Accessories", desc: "Handcrafted pieces that elevate every ensemble" },
              { title: "Exclusive Cosmetics", desc: "Beauty products that define elegance" }
            ].map((item, idx) => (
              <div
                key={idx}
                className="group relative border-2 border-gray-900 p-12 hover:bg-gray-900 transition-all duration-500"
              >
                <div className="space-y-4 text-center">
                  <h4 className="text-2xl font-light tracking-wide group-hover:text-white transition-colors duration-500">
                    {item.title}
                  </h4>
                  <div className="w-12 h-px bg-gray-900 group-hover:bg-white mx-auto transition-colors duration-500"></div>
                  <p className="text-gray-600 font-light leading-relaxed group-hover:text-gray-300 transition-colors duration-500">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Refined Testimonials */}
        <div ref={testimonialRef} className="bg-gray-50 py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-6">
              <h2 className="text-4xl font-light tracking-wide">Client Testimonials</h2>
              <div className="w-24 h-px bg-gray-900 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sophie Tan",
                  title: "Fashion Curator",
                  quote: "Jeanzy's attention to detail is unparalleled. Every piece feels like a work of art.",
                },
                {
                  name: "Arjun Mehra",
                  title: "Entrepreneur",
                  quote: "The quality and elegance of Jeanzy products speak volumes. Truly exceptional.",
                },
                {
                  name: "Laura Kim",
                  title: "Style Consultant",
                  quote: "A brand that understands luxury. From packaging to product, everything is perfection.",
                },
              ].map(({ name, title, quote }, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 p-10 space-y-6 group hover:shadow-xl transition-shadow duration-500"
                >
                  <div className="flex gap-1 justify-center">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-gray-900 text-gray-900" />
                    ))}
                  </div>
                  <p className="text-center text-gray-600 italic font-light leading-relaxed">
                    "{quote}"
                  </p>
                  <div className="text-center space-y-1 pt-6 border-t border-gray-200">
                    <p className="font-light tracking-wide">{name}</p>
                    <p className="text-sm text-gray-500 uppercase tracking-widest">{title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* The Jeanzy Experience */}
        <div ref={expRef} className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <picture>
                <source srcSet="/images/about2.webp" type="image/webp" />
                <img
                  src="/images/about2.jpg"
                  alt="Jeanzy Luxury Experience"
                  className="w-full h-[600px] object-cover shadow-2xl"
                  loading="lazy"
                />
              </picture>
              <div className="absolute -top-8 -right-8 w-48 h-48 border-2 border-gray-900 -z-10"></div>
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <h2 className="text-4xl md:text-5xl font-light tracking-wide leading-tight">
                The Jeanzy <span className="italic">Experience</span>
              </h2>
              <div className="w-24 h-px bg-gray-900"></div>
              <p className="text-lg leading-relaxed text-gray-600 font-light">
                At Jeanzy, we believe luxury extends beyond the product. It encompasses every interaction, 
                from the moment you discover our collections to the unboxing of your carefully packaged purchase.
              </p>
              <p className="text-lg leading-relaxed text-gray-600 font-light">
                Our commitment to excellence ensures that every touchpoint reflects the sophistication and 
                refinement that define the Jeanzy brand. Experience fashion that transforms the ordinary into 
                the extraordinary.
              </p>
            </div>
          </div>
        </div>
      </div>
      <WhatsAppButton />
    </>
  );
};

export default About;