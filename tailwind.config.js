/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Dark romantic luxury — burgundy base + dusty rose accents
        noir: "#0D0709", // page base
        wine: "#160C10", // alt section
        burgundy: "#241017", // card tint
        plum: "#3A1D28", // deeper surface / borders
        dusty: "#CFA3AB", // signature dusty rose accent
        rose: "#DDAEB6", // light rose
        roseGold: "#C39A8D", // muted rose-gold (lines/icons)
        cream: "#ECE0DB", // primary text
        mauve: "#A98693", // secondary text (AA sobre noir y tarjetas)
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        editorial: "0.22em",
        wide: "0.08em",
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 6vw, 7rem)", { lineHeight: "0.95" }],
        "display-lg": ["clamp(2rem, 4vw, 4.5rem)", { lineHeight: "1.0" }],
        "display-md": ["clamp(1.5rem, 3vw, 2.5rem)", { lineHeight: "1.1" }],
      },
      boxShadow: {
        glass: "0 10px 40px rgba(0, 0, 0, 0.45)",
        "glass-lg": "0 24px 70px rgba(0, 0, 0, 0.55)",
      },
    },
  },
  plugins: [],
};
