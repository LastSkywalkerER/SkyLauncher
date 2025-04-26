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
          lighter: '#323334',
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
        contrast: {
          base: '#bababa'
        },
        secondary: {
          contrast: '#FFFFFF'
        }
      },
      textColor: {
        DEFAULT: '#FFFFFF',
        main: '#FFFFFF',
        muted: '#bababa'
      },
      textShadow: {
        down: '0 2px 0 rgba(0, 0, 0, 0.5)'
      },
      boxShadow: {
        down: '0 4px 0 rgba(0, 0, 0, 0.2)'
      }
    }
  },
  plugins: [
    require('tailwindcss-textshadow'),
    function ({ addComponents }) {
      addComponents({
        '.cube-border': {
          borderTopWidth: '2px',
          borderRightWidth: '2px',
          borderBottomWidth: '1px',
          borderLeftWidth: '1px',
          borderTopColor: '#303030', // common-lighter
          borderRightColor: '#0a0a0a', // common-darker
          borderBottomColor: '#0a0a0a', // common-darker
          borderLeftColor: '#303030' // common-lighter
        },
        '.active-cube-border': {
          borderTopWidth: '2px',
          borderRightWidth: '2px',
          borderBottomWidth: '1px',
          borderLeftWidth: '1px',
          borderTopColor: '#0a0a0a', // common-darker
          borderRightColor: '#303030', // common-lighter
          borderBottomColor: '#303030', // common-lighter
          borderLeftColor: '#0a0a0a' // common-darker
        }
      })
    }
  ]
}
