import React from 'react';

const WhatsAppButton = ({ 
  phoneNumber = '919987683105', 
  message = "Hello Team Jean-Zey! I’m interested in your fashion collection and would like some assistance."
}) => {
  return (
    <a
      href={`https://api.whatsapp.com/send?phone=${phoneNumber.replace(/\D/g, '')}&text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-black/90 backdrop-blur-sm border border-white/20 text-white rounded-full p-4 shadow-xl transition-all duration-300 hover:scale-110 hover:bg-black/70 group flex items-center justify-center"
      aria-label="Chat on WhatsApp"
    >
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
        alt="WhatsApp" 
        className="w-7 h-7 filter grayscale invert transition-all duration-300 group-hover:brightness-125"
      />
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black/70 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Chat with us
      </span>
    </a>
  );
};

export default WhatsAppButton;
