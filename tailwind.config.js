/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          light: '#60A5FA',
          dark: '#1D4ED8',
        },
        secondary: {
          DEFAULT: '#14B8A6',
          light: '#5EEAD4',
          dark: '#0F766E',
        },
        accent: '#F59E0B',
        background: '#F8FAFC',
        surface: '#FFFFFF',
        text: '#0F172A',
        muted: '#64748B',
        border: '#E2E8F0',
      },
    },
  },
  plugins: [],
}

