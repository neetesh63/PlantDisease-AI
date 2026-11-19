import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        emerald: {
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-dark":
          "radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(52,211,153,0.10) 0%, transparent 50%)",
        "hero-light":
          "radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(52,211,153,0.06) 0%, transparent 50%)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
