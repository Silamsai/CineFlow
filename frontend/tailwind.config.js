/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cinema: {
          black:      'rgb(var(--bg-black) / <alpha-value>)',
          dark:       'rgb(var(--bg-dark) / <alpha-value>)',
          card:       'rgb(var(--bg-card) / <alpha-value>)',
          border:     'rgb(var(--border-color) / <alpha-value>)',
          // Primary accent — red
          red:        'rgb(var(--primary-red) / <alpha-value>)',
          'red-dark': 'rgb(var(--primary-red-dark) / <alpha-value>)',
          'red-light':'rgb(var(--primary-red-light) / <alpha-value>)',
          // Secondary accent — mapped to red
          gold:       'rgb(var(--primary-red) / <alpha-value>)',
          'gold-light':'rgb(var(--primary-red-light) / <alpha-value>)',
          'gold-dark': 'rgb(var(--primary-red-dark) / <alpha-value>)',
          // Neutrals
          'off-white': 'rgb(var(--text-off-white) / <alpha-value>)',
          muted:       'rgb(var(--text-muted) / <alpha-value>)',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'cinema-gradient': 'linear-gradient(135deg, #0a0a0a 0%, #1a0000 50%, #0a0a0a 100%)',
        'red-gradient':    'linear-gradient(135deg, #E50914 0%, #FF2D2D 50%, #B20710 100%)',
        'card-gradient':   'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.9) 100%)',
      },
      animation: {
        'spin-slow':     'spin 20s linear infinite',
        'float':         'float 6s ease-in-out infinite',
        'shimmer':       'shimmer 2s infinite',
        'pulse-red':     'pulseRed 2s ease-in-out infinite',
        'slide-up':      'slideUp 0.5s ease-out',
        'fade-in':       'fadeIn 0.3s ease-out',
        'marquee':       'marquee 30s linear infinite',
        'liquid':        'liquid 3s ease-in-out infinite',
        'curtain-sway':  'curtain-sway 4s ease-in-out infinite',
        'float-glow':    'float-glow 3s ease-in-out infinite',
        'ripple':        'ripple 1s ease-out forwards',
      },
      keyframes: {
        float:    { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-20px)' } },
        shimmer:  { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        pulseRed: { '0%, 100%': { boxShadow: '0 0 0 0 rgba(229,9,20,0.4)' }, '50%': { boxShadow: '0 0 0 10px rgba(229,9,20,0)' } },
        slideUp:  { '0%': { transform: 'translateY(20px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
        fadeIn:   { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        marquee:  { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        liquid:   { '0%, 100%': { transform: 'translateX(-100%) rotate(0deg)', opacity: '0.3' }, '50%': { transform: 'translateX(100%) rotate(10deg)', opacity: '0.6' } },
        ripple:   { '0%': { width: '0', height: '0', opacity: '0.5' }, '100%': { width: '300px', height: '300px', opacity: '0', transform: 'translate(-50%,-50%)' } },
      },
      boxShadow: {
        'red':  '0 0 20px rgba(229,9,20,0.3)',
        'card': '0 25px 50px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
};
