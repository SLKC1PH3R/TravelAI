import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef6ff",
          500: "#2f6fed",
          600: "#1f56c4",
          900: "#13234a",
        },
      },
    },
  },
  plugins: [],
};

export default config;
