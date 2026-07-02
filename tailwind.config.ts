import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta de marca AbiQ (verde-azulado cálido). Cámbiala libremente aquí.
        marca: {
          DEFAULT: "#1f6f5c",
          oscuro: "#184f43",
          suave: "#e7f1ee",
        },
        arena: "#f7f5f0",
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
