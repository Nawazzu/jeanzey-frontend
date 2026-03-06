import React, { useEffect, useState } from "react";

const sections = [
  {
    title: "Use of Website",
    content:
      "You agree to use this website for lawful purposes only. You shall not engage in any activity that may harm the website, its users, or violate any applicable laws.",
  },
  {
    title: "Intellectual Property",
    content:
      "All content on this website, including images, text, logos, graphics, and designs, are the property of JEANZEY or its licensors and are protected by copyright and other intellectual property laws.",
  },
  {
    title: "Product Information",
    content:
      "We strive to provide accurate product descriptions, images, and pricing. However, we do not guarantee that all content is error-free, complete, or current. We reserve the right to correct any errors and update information at any time without prior notice.",
  },
  {
    title: "Orders & Payments",
    content:
      "All orders are subject to acceptance and availability. Payments are processed securely through our trusted payment partners. By placing an order, you agree to provide accurate billing and shipping information.",
  },
  {
    title: "Privacy",
    content:
      "Your personal information is handled according to our Privacy Policy. By using our website, you consent to the collection and use of your information as described therein.",
  },
  {
    title: "Limitation of Liability",
    content:
      "JEANZEY shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the website or products. Use the website at your own risk.",
  },
  {
    title: "Governing Law",
    content:
      "These terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai, India.",
  },
  {
    title: "Changes to Terms",
    content:
      "We reserve the right to modify or update these Terms & Conditions at any time. Continued use of the website constitutes acceptance of the updated terms.",
  },
];

const TermsAndConditions = () => {
  const [activeSection, setActiveSection] = useState(0);

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      const offsets = sections.map((_, idx) => {
        const el = document.getElementById(`section-${idx}`);
        return el?.offsetTop || 0;
      });

      const scrollPos = window.scrollY + 200; // Adjust for header
      const currentIndex = offsets.findIndex((top, idx) => {
        const nextTop = offsets[idx + 1] || Infinity;
        return scrollPos >= top && scrollPos < nextTop;
      });

      setActiveSection(currentIndex === -1 ? 0 : currentIndex);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (idx) => {
    const el = document.getElementById(`section-${idx}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="w-full bg-white text-black py-20 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-12">

        {/* Sidebar */}
        <div className="hidden lg:block w-64 sticky top-32 self-start">
          <ul className="space-y-4 border-l-2 border-gray-300 pl-4">
            {sections.map((sec, idx) => (
              <li
                key={idx}
                onClick={() => scrollToSection(idx)}
                className={`cursor-pointer px-3 py-1 rounded-md transition-all duration-300 ${
                  activeSection === idx
                    ? "bg-gradient-to-r from-gray-900 to-gray-600 text-white font-semibold shadow-lg border-l-4 border-black"
                    : "text-gray-600 hover:text-gray-900 hover:font-semibold"
                }`}
              >
                {idx + 1}. {sec.title}
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-12 tracking-wide bg-black text-white px-6 py-3 rounded-lg shadow-lg border-2 border-black">
            Terms & Conditions
          </h1>

          <p className="text-lg md:text-xl text-gray-700 mb-12 leading-relaxed text-center border-b-2 border-gray-300 pb-6">
            Welcome to JEANZEY. By accessing or using our website, you agree to comply
            with and be bound by the following terms and conditions. Please read them
            carefully.
          </p>

          {sections.map((sec, idx) => (
            <div
              key={idx}
              id={`section-${idx}`}
              className="space-y-6 opacity-0 animate-fadeIn border-b border-gray-300 pb-8 last:border-0"
              style={{ animationDelay: `${idx * 0.2}s`, animationFillMode: "forwards" }}
            >
              <h2 className="text-3xl md:text-4xl font-semibold flex items-center gap-4 group hover:text-gray-900 transition-colors border-l-4 border-black pl-4 py-1">
                <span className="text-gray-400 font-mono">{idx + 1}</span>
                {sec.title}
              </h2>
              <p className="text-gray-700 leading-relaxed">{sec.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease forwards;
        }
      `}</style>
    </section>
  );
};

export default TermsAndConditions;
