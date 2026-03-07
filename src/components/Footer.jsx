import React, { useEffect, useState } from "react";
import { FaInstagram, FaPinterest, FaFacebook, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Instant scroll to top on any nav click
  const handleNavClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <footer className="relative w-full py-12 md:py-16 overflow-hidden bg-transparent">
      <div className="w-full px-6 sm:px-10 md:px-16 lg:px-24">
        {/* Logo */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-wide prata-regular text-gray-900">
            JEAN-ZEY
          </h2>
          <div className="h-[2px] w-16 bg-gray-400/60 mx-auto mt-3"></div>
        </div>

        {/* Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-14 text-center sm:text-left">
          {/* Column 1 */}
          <div className="space-y-2">
            <h4 className="text-sm uppercase tracking-widest font-semibold mb-4 text-gray-700 
                           pl-2 sm:pl-3 md:pl-4 lg:pl-6 xl:pl-8">
              About
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { name: "Our Story", path: "/about" },
                { name: "Our Policy", path: "/PolicyPage" },
                { name: "The Founder's Vision", path: "/founders-vision" },
              ].map((item, idx) => (
                <li key={idx} className="footer-link">
                  <Link to={item.path} onClick={handleNavClick}>{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 */}
          <div className="space-y-2">
            <h4 className="text-sm uppercase tracking-widest font-semibold mb-4 text-gray-700 
                           pl-2 sm:pl-3 md:pl-4 lg:pl-6 xl:pl-8">
              Customer Care
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { name: "Shipping & Returns", path: "/shipping-returns" },
                { name: "FAQs", path: "/terms-and-conditions" },
                { name: "Size Guide", path: "/size-guide" },
                { name: "Contact Us", path: "/contact" },
              ].map((item, idx) => (
                <li key={idx} className="footer-link">
                  <Link to={item.path} onClick={handleNavClick}>{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 */}
          <div className="space-y-2">
            <h4 className="text-sm uppercase tracking-widest font-semibold mb-4 text-gray-700 
                           pl-2 sm:pl-3 md:pl-4 lg:pl-6 xl:pl-8">
              Collections
            </h4>
            <ul className="space-y-3 text-sm">
              {["Coming Soon", "Our Gifts", "Limited Editions"].map((item, idx) => (
                <li key={idx} className="footer-link">
                  <Link
                    to={
                      item === "Coming Soon"
                        ? "/coming-soon"
                        : item === "Our Gifts"
                        ? "/our-gifts"
                        : item === "Limited Editions"
                        ? "/limited-editions"
                        : "#"
                    }
                    onClick={handleNavClick}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 */}
          <div className="space-y-2">
            <h4 className="text-sm uppercase tracking-widest font-semibold mb-4 text-gray-700 
                           pl-2 sm:pl-3 md:pl-4 lg:pl-6 xl:pl-8">
              Connect
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="footer-link">
                <a href="https://www.instagram.com/wear.jeanzey?igsh=OGJma3QyOXppcjY2" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
              <li className="footer-link">
                <a href="https://pinterest.com/demo" target="_blank" rel="noopener noreferrer">
                  Pinterest
                </a>
              </li>
              <li className="footer-link">
                <a href="https://facebook.com/demo" target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              </li>
              <li className="footer-link">
                <a href="https://wa.me/+919987683105" target="_blank" rel="noopener noreferrer">
                  Whatsapp
                </a>
              </li>
              <li className="footer-link">
                <a href="https://snapchat.com/add/demo" target="_blank" rel="noopener noreferrer">
                  Snapchat
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-500/40 my-10"></div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 tracking-widest">
          <p>© 2025 JEANZE. All Rights Reserved.</p>
          <div className="flex items-center gap-6 mt-4 sm:mt-0">
            <Link to="/terms-and-conditions" className="footer-link" onClick={handleNavClick}>
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 left-8 z-[9999] p-3 bg-black text-white rounded-full shadow-lg border border-gray-500/40 hover:bg-gray-900 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,0,0,0.3)]"
          aria-label="Back to top"
        >
          ↑
        </button>
      )}

      {/* Mirror Glass CSS */}
      <style>{`
        .footer-link {
          display: inline-block;
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          padding: 6px 14px;
          transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
          text-align: left;
        }
        .footer-link a {
          position: relative;
          z-index: 10;
          color: #111;
          font-weight: 500;
          text-decoration: none;
        }

        .footer-link::before {
          content: "";
          position: absolute;
          top: 0;
          left: -75%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            120deg,
            rgba(255, 255, 255, 0.0) 0%,
            rgba(255, 255, 255, 0.25) 50%,
            rgba(255, 255, 255, 0.0) 100%
          );
          transform: skewX(-25deg);
          transition: transform 0.8s ease;
        }

        .footer-link:hover::before {
          transform: translateX(200%) skewX(-25deg);
        }

        .footer-link:hover {
          transform: scale(1.08);
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1), 0 0 20px rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </footer>
  );
};

export default Footer;