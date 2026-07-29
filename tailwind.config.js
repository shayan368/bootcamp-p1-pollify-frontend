/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        // page background is pure black, cards sit one step up on near-black
        surface: {
          DEFAULT: "#0d0f0e",
          card: "#111312",
          input: "#0b0d0c",
        },
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
  plugins: [],
};
