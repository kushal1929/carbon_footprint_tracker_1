/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/components/Login.js",
    "./src/components/Register.js",
    "./src/components/common/Header.js",
    "./src/components/Home.js",
    "./src/components/common/Home_card.js",
    "./src/components/ConsumptionData.js",
    "./src/components/Prelogin_2.js",
    "./src/components/Prelogin.js",
    
  ],
  theme: {
    fontFamily: {
      PJSbold: ["PlusJakartaSans-Bold", "sans-serif"],
      WorkSans: ["WorkSans-Regular", "sans-serif"],
    },
  },
  plugins: [
    require('tailwindcss-animated')
  ],
}

