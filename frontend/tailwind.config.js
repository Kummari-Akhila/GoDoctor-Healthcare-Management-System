module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-blue': '#0f172a',
        'light-blue': '#38bdf8',
        'purple-accent': '#8b5cf6',
        'pink-accent': '#ec4899',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      backgroundColor: {
        glass: 'rgba(15, 23, 42, 0.7)',
        'glass-light': 'rgba(255, 255, 255, 0.05)',
        'glass-blue': 'rgba(56, 189, 248, 0.05)',
        'glass-purple': 'rgba(139, 92, 246, 0.05)',
      },
      backdropFilter: {
        glass: 'blur(20px)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
