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
    },
  },
  plugins: [],
}

export default tailwindConfig;
