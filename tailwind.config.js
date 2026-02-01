/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'molt-dark': '#0a0a0f',
        'molt-gray': '#1a1a24',
        'molt-accent': '#ff4d2a',
        'molt-orange': '#ff6b35',
        'molt-neon': '#ff3d00',
      },
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'cursive'],
        'pixel-mono': ['"VT323"', 'monospace'],
        'mono': ['"VT323"', 'monospace'],
        'display': ['"Press Start 2P"', 'cursive'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'particle': 'particle 0.6s ease-out forwards',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 77, 42, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 77, 42, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        particle: {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-100px) scale(0)' },
        },
      },
    },
  },
  plugins: [],
}
