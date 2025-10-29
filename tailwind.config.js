/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: [
    "./html/**/*.html",
    "./js/**/*.js",
  ],
  theme: {
    extend: {},
    screen: {
      smallScreen: "300px",
    },
  },
  plugins: [],
};