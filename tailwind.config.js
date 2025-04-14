/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/renderer/index.html', './src/renderer/src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        minecraft: ['Minecraft Ten', 'sans-serif']
      },
      colors: {
        common: {
          lighter: '#303030',
          light: '#282828',
          base: '#1e1e1e',
          dark: '#141414',
          darker: '#0a0a0a'
        },
        primary: {
          lighter: '#c084fc', // purple-400
          light: '#a855f7', // purple-500
          base: '#9333ea', // purple-600
          dark: '#7e22ce', // purple-700
          darker: '#6b21a8' // purple-800
        },
        secondary: {
          contrast: '#FFFFFF'
        }
      },
      textColor: {
        DEFAULT: '#FFFFFF',
        main: '#FFFFFF',
        muted: '#9ca3af'
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
