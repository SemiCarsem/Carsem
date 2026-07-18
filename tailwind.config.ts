import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#090909",
        card: "#101010",
        "card-soft": "#151515",
        border: "rgba(255,255,255,0.08)",
        success: "#22C55E",
        danger: "#FF4D4F",
        warning: "#F59E0B"
      },
      fontFamily: {
        sans: [
          "Inter",
          "SF Pro Display",
          "SF Pro Text",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif"
        ]
      },
      boxShadow: {
        premium: "0 24px 80px rgba(0,0,0,0.38)",
        glow: "0 0 60px rgba(34,197,94,0.12)"
      },
      borderRadius: {
        "5xl": "28px"
      }
    }
  },
  plugins: [animate]
};

export default config;
