/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7C9885',
        secondary: '#E8DDD3',
        accent: '#D4A574',
        surface: '#F5F2ED',
        background: '#FAFAF8',
        success: '#8FB996',
        warning: '#E6B87D',
        error: '#C97F7F',
        info: '#8FA4B8'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui']
      }
    },
  },
  plugins: [],
}