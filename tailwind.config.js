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
      // Infrastructure Blue Color Palette
      colors: {
        'burgundy': {
          DEFAULT: '#800020',
          dark: '#5c0017',
        },
      },
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
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
