import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F4F5F7",
        ink: "#111826",
        navy: {
          50: "#EEF1F7",
          100: "#D7DEEC",
          300: "#8C9BC2",
          500: "#3B4E85",
          700: "#1C2C52",
          900: "#0D1730",
        },
        amber: {
          400: "#E8B04B",
          500: "#D9A441",
          600: "#B9862B",
        },
        teal: {
          500: "#1F7A6C",
          600: "#166357",
        },
        clay: {
          500: "#C1502E",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "ticket-notch":
          "radial-gradient(circle at 0 50%, transparent 10px, #F4F5F7 10.5px), radial-gradient(circle at 100% 50%, transparent 10px, #F4F5F7 10.5px)",
      },
    },
  },
  plugins: [],
};
export default config;
