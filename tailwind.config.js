/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/renderer/index.html', './src/renderer/src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        minecraft: ['Minecraft Ten', 'sans-serif']
      },
      textColor: {
        DEFAULT: '#FFFFFF',
        main: '#FFFFFF'
      },
      textShadow: {
        down: '0 2px 0 rgba(0, 0, 0, 0.5)'
      },
      boxShadow: {
        down: '0 4px 0 rgba(0, 0, 0, 0.2)'
      }
    }
  },
  plugins: [require('tailwindcss-textshadow')]
}
