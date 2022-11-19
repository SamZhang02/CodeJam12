/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./frontend/**/*.{html, js}", './node_modules/tw-elements/dist/js/**/*.js'], 
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tw-elements/dist/plugin')
  ],
}
,}
