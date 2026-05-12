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
        soft: "0 8px 32px rgba(26, 60, 94, 0.10)",
        card: "0 2px 8px rgba(26, 60, 94, 0.06)",
      },
      spacing: {
        safe: "env(safe-area-inset-bottom, 0px)",
      },
    },
  },
  plugins: [],
};
