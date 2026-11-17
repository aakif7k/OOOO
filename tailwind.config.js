/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFF7F0',
        warmWhite: '#FFFDFB',
        pink: { DEFAULT: '#FFC8DD', blush: '#FFAFCC' },
        lavender: { DEFAULT: '#CDB4DB', light: '#E9DDF7' },
        blue: { DEFAULT: '#BDE0FE', sky: '#A2D2FF' },
        ink: '#2B2A4C',
        heart: '#FF5D8F',
        gold: '#FFD27D',
        lineBlue: '#2F6FED',
        lineGreen: '#2FA66A',
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        ui: ['"Bricolage Grotesque"', '"Plus Jakarta Sans"', 'sans-serif'],
        content: ['Poppins', '"Plus Jakarta Sans"', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        hand: ['Caveat', 'cursive'],
        mono: ['"JetBrains Mono"', '"Space Mono"', 'monospace'],
        tamil: ['"Noto Sans Tamil"', 'sans-serif'],
      },
      animation: {
        'pulse-soft': 'pulse-soft 2.5s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'swing': 'swing 3s ease-in-out infinite',
        'flicker': 'flicker 0.15s ease-in-out infinite',
        'ripple': 'ripple 0.6s ease-out forwards',
      },
      keyframes: {
        'pulse-soft': {
          '0%,100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(255,93,143,0.4)' },
          '50%': { transform: 'scale(1.04)', boxShadow: '0 0 0 12px rgba(255,93,143,0)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        swing: {
          '0%,100%': { transform: 'rotate(-8deg)' },
          '50%': { transform: 'rotate(8deg)' },
        },
        flicker: {
          '0%,100%': { opacity: 1 },
          '50%': { opacity: 0.85 },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: 0.6 },
          '100%': { transform: 'scale(2.5)', opacity: 0 },
        },
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
