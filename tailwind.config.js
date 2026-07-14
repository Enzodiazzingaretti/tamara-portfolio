/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#090909",
        ivory: "#F5F1EB",
        warmGray: "#A8A29E",
        gold: "#B89B6A",
        goldLight: "#D4BC8A",
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        editorial: "0.18em",
        wide: "0.08em",
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 6vw, 7rem)", { lineHeight: "0.95" }],
        "display-lg": ["clamp(2rem, 4vw, 4.5rem)", { lineHeight: "1.0" }],
        "display-md": ["clamp(1.5rem, 3vw, 2.5rem)", { lineHeight: "1.1" }],
      },
    },
  },
  plugins: [],
};
