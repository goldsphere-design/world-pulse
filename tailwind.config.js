/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/renderer/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Oblivion color palette
        ob: {
          'bg-primary': '#0A0A0F',
          'bg-panel': '#101820',
          'bg-elevated': '#141C26',
          'text': '#C8E6F0',
          'text-dim': 'rgba(200, 230, 240, 0.5)',
          'cyan': '#00D4FF',
          'cyan-dim': 'rgba(0, 212, 255, 0.6)',
          'amber': '#FF8C42',
          'amber-dim': 'rgba(255, 140, 66, 0.6)',
          'success': '#4AE68A',
          'danger': '#FF3D3D',
          'warning': '#FFB020',
          'border': 'rgba(200, 230, 240, 0.12)',
          'border-active': 'rgba(0, 212, 255, 0.4)',
        },
      },
      borderWidth: {
        '3': '3px',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'SF Mono', 'Fira Code', 'Consolas', 'Monaco', 'monospace'],
      },
      letterSpacing: {
        'ultrawide': '0.2em',
        'wide': '0.1em',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 212, 255, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.3), 0 0 40px rgba(0, 212, 255, 0.1)' },
        },
      },
    },
  },
  plugins: [],
};
