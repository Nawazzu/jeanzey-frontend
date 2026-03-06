import React, { useState } from "react";

const sizeData = {
  men: {
    tshirt: [
      { size: "S", chest: "36-38", length: "28" },
      { size: "M", chest: "38-40", length: "29" },
      { size: "L", chest: "40-42", length: "30" },
      { size: "XL", chest: "42-44", length: "31" },
    ],
    shirt: [
      { size: "S", chest: "37-39", sleeve: "24", length: "29" },
      { size: "M", chest: "39-41", sleeve: "25", length: "30" },
      { size: "L", chest: "41-43", sleeve: "26", length: "31" },
      { size: "XL", chest: "43-45", sleeve: "27", length: "32" },
    ],
    jeans: [
      { waist: "28", hip: "36", inseam: "30" },
      { waist: "30", hip: "38", inseam: "32" },
      { waist: "32", hip: "40", inseam: "32" },
      { waist: "34", hip: "42", inseam: "34" },
    ],
    jackets: [
      { size: "S", chest: "36-38", length: "27", sleeve: "24" },
      { size: "M", chest: "38-40", length: "28", sleeve: "25" },
      { size: "L", chest: "40-42", length: "29", sleeve: "26" },
      { size: "XL", chest: "42-44", length: "30", sleeve: "27" },
    ],
  },
  women: {
    tshirt: [
      { size: "XS", bust: "32-34", length: "25" },
      { size: "S", bust: "34-36", length: "26" },
      { size: "M", bust: "36-38", length: "27" },
      { size: "L", bust: "38-40", length: "28" },
    ],
    shirt: [
      { size: "XS", bust: "33-35", sleeve: "23", length: "25" },
      { size: "S", bust: "35-37", sleeve: "24", length: "26" },
      { size: "M", bust: "37-39", sleeve: "25", length: "27" },
      { size: "L", bust: "39-41", sleeve: "26", length: "28" },
    ],
    jeans: [
      { waist: "24", hip: "34", inseam: "30" },
      { waist: "26", hip: "36", inseam: "31" },
      { waist: "28", hip: "38", inseam: "32" },
      { waist: "30", hip: "40", inseam: "33" },
    ],
    jackets: [
      { size: "XS", bust: "32-34", length: "24", sleeve: "23" },
      { size: "S", bust: "34-36", length: "25", sleeve: "24" },
      { size: "M", bust: "36-38", length: "26", sleeve: "25" },
      { size: "L", bust: "38-40", length: "27", sleeve: "26" },
    ],
  },
};

const SizeGuide = () => {
  const [gender, setGender] = useState("men");

  const categories = ["tshirt", "shirt", "jeans", "jackets"];

  return (
    <section className="w-full py-20 bg-white text-black">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-12">

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-6 tracking-wide bg-black text-white px-4 py-2 rounded-lg shadow-md">
          Size Guide
        </h1>

        {/* Gender Selector */}
        <div className="flex justify-center gap-6">
          {["men", "women"].map((g) => (
            <button
              key={g}
              onClick={() => setGender(g)}
              className={`px-6 py-2 rounded-full font-semibold transition-all border-2 ${
                gender === g
                  ? "bg-black text-white shadow-lg border-white"
                  : "bg-white text-black hover:bg-gray-100 border-black"
              }`}
            >
              {g === "men" ? "Men" : "Women"}
            </button>
          ))}
        </div>

        {/* Size Tables */}
        <div className="flex flex-col gap-16">
          {categories.map((category) => {
            const data = sizeData[gender][category];
            if (!data || !data.length) return null;

            return (
              <div
                key={category}
                className="p-6 rounded-3xl shadow-xl border-2 border-black hover:scale-105 transition-transform duration-300 bg-white/80 backdrop-blur-md"
              >
                <h2 className="text-3xl font-semibold mb-6 border-b border-black pb-2 capitalize">
                  {category}
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse border border-black">
                    <thead>
                      <tr className="bg-gray-100">
                        {Object.keys(data[0]).map((key) => (
                          <th
                            key={key}
                            className="px-6 py-3 border-b border-black text-black uppercase tracking-wide"
                          >
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-gray-200 transition-colors"
                        >
                          {Object.values(row).map((val, i) => (
                            <td
                              key={i}
                              className="px-6 py-3 border-b border-black text-black"
                            >
                              {val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SizeGuide;
