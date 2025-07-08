import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        blink: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        blink: 'blink 1s infinite alternate',
      },
      fontFamily: {
        josefin: ['Josefin Sans', ...defaultTheme.fontFamily.sans],
        maven: ['Maven Pro', ...defaultTheme.fontFamily.sans],
        oblik: ['Oblik', 'sans-serif'],
      },
      colors: {
        text: '#212121',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '15px',
          sm: '15px',
          md: '32px',
          lg: '16px',
        },
      },
      spacing: {
        sectionMobile: '20px',
        sectionTablet: '30px',
        sectionDesktop: '50px',
      },
      screens: {
        mobile: '425px',
        tablet: '768px',
        desktop: '1280px',
      },
      maxWidth: {
        mobile: '425px',
        tablet: '768px',
        desktop: '1280px',
      },
      zIndex: {
        60: '60',
        70: '70',
        100: '100',
      },
    },
  },
  plugins: [],
} satisfies Config;
