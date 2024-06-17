/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      borderRadius: {
        'sm': '6rem',
      },
      colors: {
        burdeos: '#8e1c1c',
        persian: '#bd3534',
        sandy: '#ffa469',
        
      },
    },
  },
  plugins: [],
}



