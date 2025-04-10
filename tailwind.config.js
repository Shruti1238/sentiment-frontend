module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'gentle-float': 'gentle-float 6s ease-in-out infinite',
        'shine': 'shine 8s linear infinite',
        'glass-shine': 'glass-shine 8s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'gentle-float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'shine': {
          'to': { backgroundPosition: '200% center' },
        },
        'glass-shine': {
          '0%': { left: '-100%' },
          '20%, 100%': { left: '100%' },
        },
      },
    },
  },
  plugins: [],
}
