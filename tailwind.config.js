/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#1A3C5E",
        teal: "#2E7D9B",
      },
      boxShadow: {
        soft: "0 16px 40px rgba(26, 60, 94, 0.08)",
      },
    },
  },
  plugins: [],
};
