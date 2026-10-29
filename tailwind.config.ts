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
        foreground: "#17191D",
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#17191D",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#17191D",
        },
        surface: {
          DEFAULT: "#F7F8FA",
          subtle: "#F1F3F5",
          hover: "#EAECEF",
        },
        primary: {
          DEFAULT: "#5145CD", // Restrained Deep Indigo
          foreground: "#FFFFFF",
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1",
          600: "#5145CD",
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
        },
        accent: {
          DEFAULT: "#5145CD",
          foreground: "#FFFFFF",
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          400: "#818CF8",
          500: "#6366F1",
          600: "#5145CD",
          700: "#4338CA",
        },
        fluvia: {
          bg: "#FFFFFF",
          surface: "#F7F8FA",
          surface2: "#F1F3F5",
          border: "#E5E7EB",
          text: "#17191D",
          muted: "#667085",
          indigo: "#5145CD",
          indigoHover: "#4338CA",
        },
        border: "#E5E7EB",
        input: "#E5E7EB",
        ring: "#5145CD",
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
