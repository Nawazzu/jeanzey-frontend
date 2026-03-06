import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Truck, RotateCw, HelpCircle } from "lucide-react";

const ShippingReturnsPage = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  const faqData = [
    {
      question: "When will my JEANZE order be shipped?",
      answer:
        "All JEANZE pieces are processed within 1–2 business days after your order is confirmed. You’ll receive a tracking link once your order has been shipped.",
    },
    {
      question: "Do you offer same-day delivery in Mumbai?",
      answer:
        "Yes. We provide 48-hour express delivery across Mumbai on all in-stock items. This option appears automatically at checkout for eligible pin codes.",
    },
    {
      question: "Do you ship all over India?",
      answer:
        "No. As of now, JEANZE delivers within Mumbai. We shall start PAN India Service soon.",
    },
    {
      question: "How can I return or exchange a product?",
      answer:
        "Returns and exchanges are accepted within 48 hours of delivery. Items must be unworn, unused, and returned in original packaging with all tags attached.",
    },
    {
      question: "How long does it take to receive my refund?",
      answer:
        "Once we receive and inspect your return, refunds are processed within 5–7 business days through your original payment method.",
    },
    {
      question: "Can I modify or cancel my order after placing it?",
      answer:
        "Orders can only be modified or cancelled within 24 hours of placement. Please contact our support team immediately at jeanze.help@gmail.com for assistance.",
    },
  ];

  return (
    <>
      <div className="max-w-[1300px] bg-[#f8f9fc] rounded-[20px] shadow-2xl mx-auto mt-20 mb-20 px-6 py-16 font-['Playfair_Display']">
        <h1 className="text-4xl md:text-5xl text-center text-[#1c1c1e] mb-10 font-bold">
          Shipping & Returns
        </h1>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Left Section */}
          <motion.div
            className="flex flex-col gap-8 h-full"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <p className="text-[#444] text-[1.1rem] leading-8">
              At <span className="font-semibold text-black">JEANZE</span>, we
              ensure that your experience is seamless—from the moment you order
              to the day your package arrives. Every piece is carefully packed,
              quality-checked, and shipped with precision and care.
            </p>

            <div className="flex items-start gap-5 bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all">
              <Truck className="text-black w-7 h-7" />
              <div>
                <h2 className="text-lg font-semibold text-black">
                  Fast & Secure Shipping
                </h2>
                <p className="text-gray-600">
                  Express delivery within Mumbai and pan-India coverage via our
                  trusted carriers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5 bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all">
              <RotateCw className="text-black w-7 h-7" />
              <div>
                <h2 className="text-lg font-semibold text-black">
                  Effortless Returns
                </h2>
                <p className="text-gray-600">
                  Enjoy easy 15-day returns and exchanges with doorstep pickup
                  support.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-black p-5 rounded-xl text-white text-sm font-medium">
              <HelpCircle className="w-6 h-6" />
              <p>
                Still have questions?{" "}
                <a href="/contact" className="underline hover:text-gray-300">
                  Connect with our Support Team
                </a>
              </p>
            </div>
          </motion.div>

          {/* Right Section - FAQs */}
          <motion.div
            className="max-h-[600px] overflow-y-auto pr-3"
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <h2 className="text-3xl font-semibold mb-6 text-black">FAQs</h2>

            <div className="bg-white rounded-2xl p-6 shadow-md">
              {faqData.map((item, index) => (
                <div
                  key={index}
                  className="bg-black text-white mb-4 rounded-md shadow-md hover:shadow-lg transition-all"
                >
                  <div
                    className="flex justify-between items-center cursor-pointer px-4 py-3 font-semibold hover:bg-neutral-900"
                    onClick={() => toggleQuestion(index)}
                  >
                    {item.question}
                    <motion.span
                      animate={{ rotate: activeQuestion === index ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Plus className="w-5 h-5 text-white" />
                    </motion.span>
                  </div>

                  <motion.div
                    initial={false}
                    animate={{
                      height: activeQuestion === index ? "auto" : 0,
                      opacity: activeQuestion === index ? 1 : 0,
                    }}
                    transition={{ duration: 0.4 }}
                    style={{ overflow: "hidden" }}
                  >
                    {activeQuestion === index && (
                      <p className="text-sm px-4 pb-3 pt-1 text-gray-200">
                        {item.answer}
                      </p>
                    )}
                  </motion.div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ShippingReturnsPage;
