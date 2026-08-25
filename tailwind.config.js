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
      // Systems documentation — navy surfaces, cyan interaction, and amber diagrams.
      colors: {
        slate: {
          50: '#F3F7FB',
          100: '#F3F7FB',
          200: '#DCE7F2',
          300: '#A7B4C5',
          400: '#A7B4C5',
          500: '#7D8EA4',
          600: '#52657A',
          700: '#243A52',
          800: '#13243A',
          900: '#0D1A2B',
          950: '#08111F',
        },
        cyan: {
          50: '#ECFEFF',
          100: '#CFFAFE',
          200: '#A5F3FC',
          300: '#67E8F9',
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
          700: '#0E7490',
          800: '#155E75',
          900: '#164E63',
          950: '#083344',
        },
        blue: {
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
        },
        burgundy: {
          DEFAULT: '#F59E0B',
          dark: '#B45309',
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
