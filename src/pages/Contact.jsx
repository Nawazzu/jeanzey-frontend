import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import emailjs from "@emailjs/browser";
import { Phone, Mail, MapPin, Instagram } from "lucide-react";
import Title from "../components/Title";
import WhatsAppButton from "../components/WhatsAppButton";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const sectionRef = useRef(null);
  const contactFormRef = useRef(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const sections = [heroRef, titleRef, sectionRef];
    sections.forEach((ref) => {
      if (ref.current) {
        gsap.from(ref.current, {
          y: 80,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
          },
        });
      }
    });
  }, []);

  const sendEmail = (e) => {
    e.preventDefault();
    setSending(true);

    const currentDate = new Date().toLocaleString();

    const dateInput = document.createElement("input");
    dateInput.type = "hidden";
    dateInput.name = "date";
    dateInput.value = currentDate;
    contactFormRef.current.appendChild(dateInput);

    emailjs
      .sendForm(
        "service_wv3wqyt", // ✅ your service ID
        "template_3ps8prd", // ⚠️ your EmailJS template ID
        contactFormRef.current,
        "Xn4D3QqdkvYKjRScl" // ⚠️ your public key
      )
      .then(
        () => {
          toast.success("Message sent successfully!", {
            style: {
              background: "#000",
              color: "#fff",
              borderRadius: "12px",
              border: "1px solid #333",
              fontFamily: "Poppins, sans-serif",
              textAlign: "center",
            },
            icon: "📨",
            progressStyle: { background: "#fff" },
          });
          e.target.reset();
          setSending(false);
        },
        (error) => {
          console.error("EmailJS Error:", error);
          toast.error("Failed to send message. Please try again later.", {
            style: {
              background: "#000",
              color: "#fff",
              borderRadius: "12px",
              border: "1px solid #333",
              fontFamily: "Poppins, sans-serif",
              textAlign: "center",
            },
            icon: "⚠️",
            progressStyle: { background: "#fff" },
          });
          setSending(false);
        }
      );
  };

  return (
    <>
      {/* Toast Container */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        draggable
        pauseOnHover
        theme="dark"
      />

      <section className="bg-[#f9f9f9] text-black overflow-hidden">
        {/* Hero Section */}
        <div
          ref={heroRef}
          className="relative w-full h-[70vh] flex flex-col items-center justify-center bg-white/10 backdrop-blur-xl text-black overflow-hidden"
        >
          <div className="relative z-20 w-full max-w-[1600px] mx-auto bg-white/10 backdrop-blur-xl p-8 md:p-12 flex flex-col items-center justify-center text-center">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-[0.25em] uppercase mb-4 shimmer-metallic-broader">
              JEAN-ZEY
            </h1>
            <p className="text-gray-800 text-base sm:text-lg md:text-xl tracking-[0.15em] font-light uppercase mb-6">
              Timeless Elegance. Modern Edge.
            </p>
            <button
              onClick={() =>
                sectionRef.current.scrollIntoView({ behavior: "smooth" })
              }
              className="footer-link px-8 py-3 text-sm uppercase font-semibold border border-black/20 text-black transition-all duration-500 rounded-lg"
            >
              Connect With Us
            </button>
          </div>
        </div>

        {/* Title Section */}
        <div ref={titleRef} className="text-center mt-24 mb-12 px-6">
          <Title text1="LET'S START A" text2="CONVERSATION" />
        </div>

        {/* Contact Form Section */}
        <div
          ref={sectionRef}
          className="flex flex-col lg:flex-row items-center gap-16 max-w-7xl mx-auto px-6 md:px-12 pb-24"
        >
          {/* Form */}
          <div className="w-full lg:w-1/2 bg-white/90 backdrop-blur-lg p-10 md:p-12 rounded-3xl shadow-lg">
            <h3 className="text-3xl font-bold text-center mb-10">
              Send a Message
            </h3>
            <form
              ref={contactFormRef}
              onSubmit={sendEmail}
              className="space-y-6 md:space-y-8"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-lg font-medium mb-2"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  required
                  className="w-full p-4 bg-transparent border border-black/20 rounded-xl focus:ring-2 focus:ring-black focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-lg font-medium mb-2"
                >
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  className="w-full p-4 bg-transparent border border-black/20 rounded-xl focus:ring-2 focus:ring-black focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-lg font-medium mb-2"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Write your message"
                  rows="6"
                  required
                  className="w-full p-4 bg-transparent border border-black/20 rounded-xl focus:ring-2 focus:ring-black focus:outline-none resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full py-4 bg-black text-white font-semibold tracking-wider rounded-xl hover:bg-white hover:text-black border border-black transition-all duration-500"
              >
                {sending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Info Section */}
          <div className="w-full lg:w-1/2 space-y-8 md:space-y-10">
            <h3 className="text-3xl font-bold mb-6 text-center lg:text-left">
              Reach Us Directly
            </h3>
            {[
              { icon: <Phone />, title: "Phone", value: "+91 99876 83105" },
              { icon: <Mail />, title: "Email", value: "jeanzey.help@gmail.com" },
              { icon: <MapPin />, title: "Location", value: "Mumbai, India" },
              { icon: <Instagram />, title: "Instagram", value: "@wear.jeanzey" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-6 bg-white/90 p-6 rounded-2xl border border-black/5 hover:shadow-2xl transition-all duration-300"
              >
                <div className="bg-black text-white p-4 rounded-full">
                  {item.icon}
                </div>
                <div>
                  <p className="font-semibold text-lg">{item.title}</p>
                  <p className="text-gray-600">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </>
  );
};

export default Contact;
