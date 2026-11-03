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
        bg: {
          light: "#faf9f6",
          dark: "#0f1115",
        },
        surface: {
          light: "#ffffff",
          "light-alt": "#f4f3ef",
          dark: "#161a22",
          "dark-alt": "#1f2430",
        },
        border: {
          light: "#e4e1d9",
          dark: "#262c3a",
        },
        txt: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)",
        },
        amber: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        electric: {
          amber: "#d97706",
          glow: "#fbbf24",
          cyan: "#0284c7",
          "cyan-glow": "#38bdf8",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "flow-line": "flowLine 2s linear infinite",
        "spark": "spark 1.5s ease-in-out infinite",
      },
      keyframes: {
        flowLine: {
          "0%": { strokeDashoffset: "100" },
          "100%": { strokeDashoffset: "0" },
        },
        spark: {
          "0%, 100%": { opacity: "0.2", transform: "scale(0.98)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        }
      }
    },
  },
  plugins: [],
};

export default config;
