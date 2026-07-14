/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Dusty pink system (light + glass)
        blush: "#F5E7EA", // page base tint
        cream: "#FBF4F3", // lightest warm
        petal: "#EAD1D7", // soft pink surface
        dusty: "#CBA0A8", // signature dusty pink
        rose: "#D9A6B0", // accent rose
        mauve: "#9B6B77", // deep accent / labels
        plum: "#43333A", // primary text
        plumSoft: "#705A62", // secondary text
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
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(120, 80, 90, 0.10)",
        "glass-lg": "0 20px 60px rgba(120, 80, 90, 0.14)",
      },
    },
  },
  plugins: [],
};
