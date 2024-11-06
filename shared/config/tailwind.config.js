const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "src/**/*.{js,ts,jsx,tsx}",
    "../../shared/react-components/**/*.{js,ts,jsx,tsx}",
    "../../shared/ui/**/*.{js,ts,jsx,tsx}",
    "../../node_modules/flowbite-react/lib/esm/theme.js",
  ],
  darkMode: "class",
  theme: {
    fontFamily: {
      grotesk: "Grotesk",
      inter: "Inter",
      averta: "Averta",
    },
    extend: {
      colors: {
        pt: {
          purple: {
            50: "DECEFF", // headings
            100: "#c2410c", // button
            200: "B18CFF", // nav links
            300: "#c2410c", // smal texts
            400: "#9B6AFF", // none
            500: "#8050E3", // none
            600: "#fff7ed", // mid background
            700: "#fff7ed", // top and buttom background
            800: "#fff7ed",
            900: "#fff7ed",
            DEFAULT: "#8050E3",
          },
          teal: {
            light: "#35F0D0",
            dark: "#0DC5A5",
            DEFAULT: "#35F0D0",
          },
          pink: {
            light: "#FA48E8",
            dark: "#B623A7",
            DEFAULT: "#FA48E8",
          },
          bg: {
            purple: {
              light: "#5D3A97",
              dark: "#E8F5E9",
              darker: "#E8F5E9",
              DEFAULT: "#E8F5E9",
            },
          },
          warning: {
            light: "#FFB6B6",
            dark: "#8B0000",
            DEFAULT: "#8B0000",
          },
          gold: "#FFB636",
          transparent: "#F5F0FF1A",
        },
      },
      keyframes: {
        flip: {
          "0%": { transform: "rotateX(0deg)" },
          "100%": { transform: "rotateX(180deg)" },
        },
        unflip: {
          "0%": { transform: "rotateX(180deg)" },
          "100%": { transform: "rotateX(360deg)" },
        },
      },
    },
    screens: {
      smSonner: "601px",
      ...defaultTheme.screens,
      "3xl": "1900px",
      "4xl": "2200px",
      "5xl": "2500px",
    },
  },
  plugins: [
    plugin(({ addUtilities }) =>
      addUtilities({
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
      })
    ),
  ],
};
