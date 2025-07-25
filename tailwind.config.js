/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'matcha': '#88B04B',
        'sakura': '#F8B7CC',
        'washi': '#F5F5F5',
        'neon-matcha': '#A3D865',
        'neon-sakura': '#FFC1CC',
      },
      fontFamily: {
        'noto-sans-jp': ['"Noto Sans JP"', 'sans-serif'],
      },
      backgroundImage: {
        'washi-texture': "url('/src/assets/washi-texture.jpg')",
        'matcha-gradient': 'linear-gradient(135deg, #88B04B 0%, #A3D865 100%)',
        'sakura-gradient': 'linear-gradient(135deg, #F8B7CC 0%, #FFC1CC 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'neon': '0 0 10px rgba(163, 216, 101, 0.7), 0 0 20px rgba(163, 216, 101, 0.3)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}