/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Typography Scale - Major Third (1.250 ratio)
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5' }],       // 12px
        'sm': ['0.875rem', { lineHeight: '1.571' }],    // 14px
        'base': ['1rem', { lineHeight: '1.75' }],       // 16px
        'lg': ['1.125rem', { lineHeight: '1.778' }],    // 18px
        'xl': ['1.25rem', { lineHeight: '1.6' }],       // 20px
        '2xl': ['1.5rem', { lineHeight: '1.5' }],       // 24px
        '3xl': ['1.875rem', { lineHeight: '1.333' }],   // 30px
        '4xl': ['2.25rem', { lineHeight: '1.222' }],    // 36px
        '5xl': ['3rem', { lineHeight: '1.167' }],       // 48px
      },
      // Systems Backbone brand palette; existing utility names remain stable.
      colors: {
        slate: {
          50: '#F3F6F8',
          100: '#F3F6F8',
          200: '#E6E8F0',
          300: '#A7ADB5',
          400: '#A7ADB5',
          500: '#A7ADB5',
          600: '#4C5560',
          700: '#4C5560',
          800: '#101B27',
          900: '#071018',
          950: '#071018',
        },
        cyan: {
          300: '#16F2B3',
          400: '#16F2B3',
          500: '#16F2B3',
          600: '#0A7B68',
          700: '#0A7B68',
          800: '#0A7B68',
          900: '#071018',
          950: '#071018',
        },
        blue: {
          400: '#16F2B3',
          500: '#16F2B3',
          600: '#0A7B68',
          700: '#0A7B68',
        },
        burgundy: {
          DEFAULT: '#0A7B68',
          dark: '#071018',
        },
      },
      fontFamily: {
        sans: ['var(--font-body)', 'Inter', 'Arial', 'sans-serif'],
        display: ['var(--font-display)', 'Sora', 'Manrope', 'Inter', 'sans-serif'],
        mono: ['var(--font-mono)', 'IBM Plex Mono', 'monospace'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1.5rem",
          lg: "2rem",
          xl: "2.5rem",
          "2xl": "3rem",
        },
      },
      screens: {
        "4k": "1980px",
      },
      // Minimal animations only
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [
    function({ addVariant }) {
      addVariant('rtl', 'html[dir="rtl"] &');
      addVariant('ltr', 'html[dir="ltr"] &');
    },
  ],
}
