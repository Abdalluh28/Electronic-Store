// tailwind.config.js
module.exports = {
  content: [ "./src/**/*.{js,jsx,ts,tsx}", "./node_modules/flowbite-react/lib/esm/**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        customGreen: "#0DFC4B", // Make sure the color code is correct
        customGreenTwo: "#0dfc4b33",
        backGroundColor: '#17171799',
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}
