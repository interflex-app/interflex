/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./theme.config.tsx",
    "./pages/**/*.{js,jsx,ts,tsx,mdx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  darkMode: "class",
};
