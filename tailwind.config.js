/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#FFC024',
        'secondary': '#FFB600',
      },
      keyframes: {
        beeFlight: {
          '0%': { transform: 'translateX(0) translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateX(25vw) translateY(-10vh) rotate(10deg)' },
          '50%': { transform: 'translateX(50vw) translateY(10vh) rotate(-10deg)' },
          '75%': { transform: 'translateX(75vw) translateY(-5vh) rotate(5deg)' },
          '100%': { transform: 'translateX(100vw) translateY(0) rotate(0deg)' },
        },
      },
      animation: {
        beeFlight: 'beeFlight 15s linear infinite',
      },
    },
  },
  plugins: [],
};

module.exports = tailwindConfig;
