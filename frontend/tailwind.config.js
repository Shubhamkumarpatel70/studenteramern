module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        marquee: 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#5B21B6', // deep purple
          light: '#8B5CF6',
          dark: '#3C1E6E',
        },
        accent: {
          DEFAULT: '#F59E42', // orange accent
          light: '#FFD8A8',
        },
        background: {
          DEFAULT: '#F3F0FF', // soft gradient base
          dark: '#2D2A4A',
        },
        card: {
          DEFAULT: '#E9D8FD', // card backgrounds
        },
        success: '#22C55E',
        error: '#EF4444',
        info: '#3B82F6',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-to-br': 'linear-gradient(to bottom right, #8B5CF6, #F59E42)',
      },
    },
  },
  plugins: [],
} 