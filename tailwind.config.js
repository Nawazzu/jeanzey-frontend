/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        lora: ['Lora', 'serif'],
      },
      colors: {
        silver: '#C0C0C0', // Silver metallic color
      },
    },
  },
  plugins: [],
}
