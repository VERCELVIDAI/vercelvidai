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
        background: "#100A12",
        foreground: "#F5EAF4",
        card: {
          DEFAULT: "#211522",
          foreground: "#F5EAF4",
        },
        popover: {
          DEFAULT: "#170E1A",
          foreground: "#F5EAF4",
        },
        primary: {
          DEFAULT: "#F05BCE", // Hot Pink
          foreground: "#FFFFFF",
          50: "#FDF2FA",
          100: "#FCE7F6",
          200: "#FACFED",
          300: "#F7A8E0",
          400: "#F378D1",
          500: "#F05BCE",
          600: "#E046BD",
          700: "#C026D3",
          800: "#A21CAF",
          900: "#701A75",
        },
        accent: {
          DEFAULT: "#F05BCE",
          foreground: "#FFFFFF",
          50: "#FDF2FA",
          100: "#FCE7F6",
          200: "#FACFED",
          400: "#F378D1",
          500: "#F05BCE",
          600: "#E046BD",
          700: "#C026D3",
        },
        plum: {
          bg: "#100A12",
          surface: "#211522",
          sidebar: "#170E1A",
          card: "#211522",
          cardHover: "#2A1A2B",
          border: "#39233B",
          borderHover: "#553158",
          text: "#F5EAF4",
          muted: "#A99AAA",
          pink: "#F05BCE",
          pinkHover: "#E046BD",
        },
        fluvia: {
          bg: "#100A12",
          softBg: "#170E1A",
          secondaryBg: "#211522",
          textPrimary: "#F5EAF4",
          textSecondary: "#A99AAA",
          border: "#39233B",
          glass: "rgba(33, 21, 34, 0.88)",
        },
        border: "#39233B",
        input: "#39233B",
        ring: "#F05BCE",
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
