import React from "react";

const DenimSplit = () => {
  // Function to scroll to a section by ID
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-screen h-screen flex flex-col md:flex-row overflow-hidden -mx-4 sm:-mx-[5vw] md:-mx-[7vw] lg:-mx-[9vw] left-0 right-0">
      {/* Left Side Image */}
      <div className="relative flex-1 h-1/2 md:h-full overflow-hidden">
        <picture>
          <source srcSet="/images/poster6.webp" type="image/webp" />
          <img
            src="/images/poster6.jpg"
            alt="Spring Style"
            loading="lazy"
            className="absolute top-0 left-0 w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-1000 ease-out"
          />
        </picture>

        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
          <h2 className="text-4xl md:text-6xl font-light tracking-wider">
           Denim Redefined
          </h2>
          <p className="mt-2 text-sm md:text-base font-light tracking-widest uppercase">
           Timeless denim crafted for now.
          </p>

          <button
            onClick={() => scrollToSection("latest-collection")}
            className="mt-6 border border-white px-6 py-2 text-sm uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-500"
          >
            View Our Latest Collection
          </button>
        </div>
      </div>

      {/* Right Side Image */}
      <div className="relative flex-1 h-1/2 md:h-full overflow-hidden">
        <picture>
          <source srcSet="/images/poster7.webp" type="image/webp" />
          <img
            src="/images/poster7.jpg"
            alt="Luxe Fashion"
            loading="lazy"
            className="absolute top-0 left-0 w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-1000 ease-out"
          />
        </picture>

        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
          <h2 className="text-4xl md:text-6xl font-light tracking-wider">
            Modern Blue Classics
          </h2>
          <p className="mt-2 text-sm md:text-base font-light tracking-widest uppercase">
           Confidence starts with the perfect pair.
          </p>

          <button
            onClick={() => scrollToSection("best-seller")}
            className="mt-6 border border-white px-6 py-2 text-sm uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-500"
          >
            Discover Our Best Seller
          </button>
        </div>
      </div>
    </section>
  );
};

export default DenimSplit;
