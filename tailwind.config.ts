import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        foreground: "#17211D",
        card: {
          DEFAULT: "rgba(255, 255, 255, 0.72)",
          foreground: "#17211D",
        },
        popover: {
          DEFAULT: "rgba(255, 255, 255, 0.85)",
          foreground: "#17211D",
        },
        primary: {
          DEFAULT: "#10B981", // Primary Emerald Green
          foreground: "#FFFFFF",
          50: "#ECFDF5",
          100: "#D1FAE5", // Light mint
          200: "#A7F3D0",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857", // Deep emerald
          800: "#065F46",
          900: "#064E3B",
        },
        accent: {
          DEFAULT: "#EC4899", // Accent pink
          foreground: "#FFFFFF",
          50: "#FFF1F7", // Soft rose
          100: "#FCE7F3", // Soft pink
          200: "#FBCFE8",
          400: "#F472B6",
          500: "#EC4899",
          600: "#DB2777",
          700: "#BE185D",
        },
        fluvia: {
          bg: "#FFFFFF",
          softBg: "#F8FAFC",
          secondaryBg: "#F0FDF4",
          emerald: "#10B981",
          deepEmerald: "#047857",
          mint: "#D1FAE5",
          softPink: "#FCE7F3",
          accentPink: "#EC4899",
          rose: "#FFF1F7",
          textPrimary: "#17211D",
          textSecondary: "#64748B",
          border: "rgba(16, 185, 129, 0.16)",
          glass: "rgba(255, 255, 255, 0.68)",
        },
        border: "rgba(16, 185, 129, 0.16)",
        input: "rgba(16, 185, 129, 0.2)",
        ring: "#10B981",
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-plus-jakarta)", '"Plus Jakarta Sans"', "Manrope", "system-ui", "sans-serif"],
        heading: ["var(--font-plus-jakarta)", '"Plus Jakarta Sans"', "Manrope", "sans-serif"],
      },
      keyframes: {
        "float-slow": {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-12px) scale(1.02)" },
        },
        "flow-ribbon": {
          "0%": { transform: "translate3d(-5%, -5%, 0) rotate(0deg) scale(1)" },
          "50%": { transform: "translate3d(5%, 8%, 0) rotate(6deg) scale(1.05)" },
          "100%": { transform: "translate3d(-5%, -5%, 0) rotate(0deg) scale(1)" },
        },
        "pulse-glass": {
          "0%, 100%": { opacity: "0.7" },
          "50%": { opacity: "0.95" },
        },
      },
      animation: {
        "float-slow": "float-slow 8s ease-in-out infinite",
        "flow-ribbon": "flow-ribbon 24s ease-in-out infinite",
        "pulse-glass": "pulse-glass 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
