/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      keyframes: {
        previewPop: {
          '0%': { transform: 'scale(0.96)', opacity: '0' },
          '60%': { transform: 'scale(1.03)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      },
      animation: {
        previewPop: 'previewPop 420ms ease forwards'
      }
    }
  },
  plugins: [],
}
