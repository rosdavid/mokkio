import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        white: {
          5: "rgba(255, 255, 255, 0.05)",
          10: "rgba(255, 255, 255, 0.1)",
          20: "rgba(255, 255, 255, 0.2)",
          30: "rgba(255, 255, 255, 0.3)",
          40: "rgba(255, 255, 255, 0.4)",
          50: "rgba(255, 255, 255, 0.5)",
          60: "rgba(255, 255, 255, 0.6)",
          70: "rgba(255, 255, 255, 0.7)",
          80: "rgba(255, 255, 255, 0.8)",
          90: "rgba(255, 255, 255, 0.9)",
        },
        purple: {
          500: "#a855f7",
        },
        black: {
          30: "rgba(0, 0, 0, 0.3)",
        },
      },
    },
  },
  plugins: [],
};

export default config;
