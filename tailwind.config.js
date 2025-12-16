/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 8pt Grid System - All spacing based on multiples of 8px
      spacing: {
        '18': '4.5rem',   // 72px
        '22': '5.5rem',  // 88px
        '26': '6.5rem',  // 104px
        '30': '7.5rem',  // 120px
        '34': '8.5rem',  // 136px
        '38': '9.5rem',  // 152px
        '42': '10.5rem', // 168px
        '46': '11.5rem', // 184px
        '50': '12.5rem', // 200px
      },
      // Typography Scale - Modern, hierarchical system
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.05em' }],      // 12px
        'sm': ['0.875rem', { lineHeight: '1.571', letterSpacing: '0.025em' }], // 14px
        'base': ['1rem', { lineHeight: '1.75', letterSpacing: '0' }],          // 16px
        'lg': ['1.125rem', { lineHeight: '1.778', letterSpacing: '-0.01em' }], // 18px
        'xl': ['1.25rem', { lineHeight: '1.6', letterSpacing: '-0.02em' }],    // 20px
        '2xl': ['1.5rem', { lineHeight: '1.5', letterSpacing: '-0.02em' }],   // 24px
        '3xl': ['1.875rem', { lineHeight: '1.333', letterSpacing: '-0.03em' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '1.222', letterSpacing: '-0.03em' }], // 36px
        '5xl': ['3rem', { lineHeight: '1.167', letterSpacing: '-0.04em' }],     // 48px
        '6xl': ['3.75rem', { lineHeight: '1.133', letterSpacing: '-0.04em' }],  // 60px
      },
      // Enhanced Color Palette with better contrast
      colors: {
        'dark': {
          '900': '#0d1224',  // Main background
          '800': '#101123',   // Card background
          '700': '#1a1443',   // Secondary background
          '600': '#25213b',   // Borders
          '500': '#281e57',   // Gradient start
          '400': '#353951',   // Lighter borders
        },
        'accent': {
          'primary': '#16f2b3',  // Main accent (cyan)
          'secondary': '#ec4899', // Pink accent
          'tertiary': '#8b5cf6',  // Violet accent
        },
        'text': {
          'primary': '#ffffff',    // Primary text (WCAG AAA: 21:1)
          'secondary': '#e5e7eb',  // Secondary text (WCAG AA: 12.6:1)
          'tertiary': '#d1d5db',   // Tertiary text (WCAG AA: 10.5:1)
          'muted': '#9ca3af',      // Muted text (WCAG AA: 7.1:1)
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-tech': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-accent': 'linear-gradient(135deg, #16f2b3 0%, #ec4899 100%)',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",   // 16px (2 × 8)
          sm: "1.5rem",       // 24px (3 × 8)
          lg: "2rem",        // 32px (4 × 8)
          xl: "2.5rem",      // 40px (5 × 8)
          "2xl": "3rem",     // 48px (6 × 8)
          "3xl": "4rem",     // 64px (8 × 8)
        },
      },
      screens: {
        "4k": "1980px",
      },
      // Premium animations and effects (2025 standards)
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'gradient-shift': 'gradientShift 3s ease infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(22, 242, 179, 0.2), 0 0 10px rgba(22, 242, 179, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(22, 242, 179, 0.4), 0 0 30px rgba(22, 242, 179, 0.4), 0 0 40px rgba(139, 92, 246, 0.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(22, 242, 179, 0.3)' },
          '50%': { boxShadow: '0 0 25px rgba(22, 242, 179, 0.6), 0 0 35px rgba(236, 72, 153, 0.4)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      // Enhanced transition timing functions
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [
    // RTL support plugin function
    function({ addUtilities, addVariant }) {
      // Add RTL variant
      addVariant('rtl', 'html[dir="rtl"] &');
      addVariant('ltr', 'html[dir="ltr"] &');
      
      // RTL-specific utilities
      addUtilities({
        '.rtl-mirror': {
          '[dir="rtl"] &': {
            transform: 'scaleX(-1)',
          },
        },
        '.rtl-flip': {
          '[dir="rtl"] &': {
            transform: 'scaleX(-1)',
          },
        },
      });
    },
  ],
}
