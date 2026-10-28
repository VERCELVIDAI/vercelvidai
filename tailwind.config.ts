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
        background: "#090A0D",
        foreground: "#F8FAFC",
        card: {
          DEFAULT: "#151822",
          foreground: "#F8FAFC",
        },
        popover: {
          DEFAULT: "#11131A",
          foreground: "#F8FAFC",
        },
        primary: {
          DEFAULT: "#6366F1", // Primary Electric Indigo
          foreground: "#FFFFFF",
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
        },
        accent: {
          DEFAULT: "#7C3AED", // Vivid Violet
          foreground: "#FFFFFF",
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
        },
        fluvia: {
          bg: "#090A0D",
          softBg: "#0E1015",
          secondaryBg: "#14161F",
          emerald: "#10B981",
          deepEmerald: "#047857",
          mint: "#6EE7B7",
          softPink: "#F472B6",
          accentPink: "#EC4899",
          rose: "#FDA4AF",
          textPrimary: "#F8FAFC",
          textSecondary: "#94A3B8",
          border: "rgba(255, 255, 255, 0.08)",
          glass: "rgba(21, 24, 34, 0.88)",
        },
        border: "rgba(255, 255, 255, 0.08)",
        input: "rgba(255, 255, 255, 0.1)",
        ring: "#6366F1",
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
