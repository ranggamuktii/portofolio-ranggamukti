/** @type {import('tailwindcss').Config} */

import tailwindScollbar from 'tailwind-scrollbar';
import colors from 'tailwindcss/colors';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        zinc: colors.zinc,
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        slideUpFade: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px) scale(0.95)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0) scale(1)',
          },
        },
        slideDownFade: {
          '0%': {
            opacity: '1',
            transform: 'translateY(0) scale(1)',
          },
          '100%': {
            opacity: '0',
            transform: 'translateY(20px) scale(0.95)',
          },
        },
      },
      animation: {
        shimmer: 'shimmer 3s ease-in-out infinite',
        slideUpFade: 'slideUpFade 0.3s ease-in-out forwards',
        slideDownFade: 'slideDownFade 0.25s ease-in-out forwards',
      },
    },
  },
  plugins: [tailwindScollbar],
};
