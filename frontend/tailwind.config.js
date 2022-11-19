/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./login/**/*.{html, js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
,}
