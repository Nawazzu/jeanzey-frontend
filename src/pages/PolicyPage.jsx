import React, { useEffect, useState } from "react";

const sections = [
  {
    title: "Privacy Policy",
    content:
      "At JEANZEY, we value your privacy and are committed to protecting your personal information. We collect only necessary details required to process orders, enhance user experience, and improve our services. Your data is stored securely and will never be shared or sold to third parties, except when required by law or to fulfill your order. By using our website, you consent to the collection and use of your data in accordance with this policy.",
  },
  {
    title: "Shipping Policy",
    content:
      "All orders are processed within 1–3 business days. Once shipped, you will receive an email with tracking details. Delivery timelines vary depending on your location, but we strive to ensure all domestic orders reach you within 5–7 working days. International orders may take longer. In case of unforeseen delays or logistic issues, our team will inform you promptly. We work with trusted delivery partners to ensure your package arrives safely and securely.",
  },
  {
    title: "Replacement Policy",
    content:
      "JEANZEY offers an easy replacement policy for defective, damaged, or incorrect items received. If you encounter any such issue, please contact our customer support within 3 days of delivery. To initiate a replacement, you must provide clear images of the received product, packaging, and invoice. Upon verification, we will arrange a pickup and send you a replacement product at no additional cost. Replacement requests beyond 3 days may not be accepted.",
  },
  {
    title: "Return Policy",
    content:
      "We want you to be fully satisfied with your purchase. Returns are accepted only if the item is unused, unwashed, in its original packaging, and with all tags intact. To initiate a return, please contact us within 7 days of receiving your order. Once approved, our team will arrange a return pickup. After inspection, the refund or replacement will be processed as per your preference. JEANZEY reserves the right to decline returns that do not meet these conditions.",
  },
  {
    title: "Refund Policy",
    content:
      "Once your returned item is received and inspected, you will receive an email confirmation. Refunds for eligible returns are initiated within 5–7 business days through the original payment method. Depending on your bank, the credited amount may take additional time to reflect. Shipping charges and COD fees (if applicable) are non-refundable. For partial returns, only the value of the returned item will be refunded. If you haven’t received your refund within 10 working days, please contact our support team.",
  },
  {
    title: "Exchange Policy",
    content:
      "We understand that sometimes a size or style may not be perfect. JEANZEY allows product exchanges for size or color variants of the same item, subject to availability. Exchanges must be requested within 7 days of delivery and will be processed only after the returned item passes inspection. If the requested variant is unavailable, a refund will be issued instead. Please note that items purchased during clearance or sale events are not eligible for exchange.",
  },
  {
    title: "Cancellation Policy",
    content:
      "Orders can be canceled within 24 hours of placement, provided they have not been shipped. Once an order is dispatched, it cannot be canceled. In case of a successful cancellation before dispatch, the full amount will be refunded to your original payment method within 5–7 business days. JEANZEY reserves the right to cancel any order due to unforeseen circumstances, stock unavailability, or payment issues, in which case customers will be notified immediately and refunded in full.",
  },
  {
    title: "Contact & Support",
    content:
      "For any queries regarding returns, replacements, or refunds, you can reach out to our customer support team via email at support@jeanzey.com or through the Contact Us page on our website. Our support team operates Monday to Saturday, 10 AM to 7 PM (IST), and will respond within 24–48 hours. We strive to ensure a seamless shopping experience and are always here to assist you.",
  },
];

const PolicyPage = () => {
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const offsets = sections.map((_, idx) => {
        const el = document.getElementById(`section-${idx}`);
        return el?.offsetTop || 0;
      });

      const scrollPos = window.scrollY + 200;
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
            Policy, Replacement & Refund
          </h1>

          <p className="text-lg md:text-xl text-gray-700 mb-12 leading-relaxed text-center border-b-2 border-gray-300 pb-6">
            At JEANZEY, customer satisfaction is our top priority. Please read
            the following policies carefully to understand how we handle privacy,
            shipping, replacements, returns, and refunds.
          </p>

          {sections.map((sec, idx) => (
            <div
              key={idx}
              id={`section-${idx}`}
              className="space-y-6 opacity-0 animate-fadeIn border-b border-gray-300 pb-8 last:border-0"
              style={{
                animationDelay: `${idx * 0.2}s`,
                animationFillMode: "forwards",
              }}
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

export default PolicyPage;
