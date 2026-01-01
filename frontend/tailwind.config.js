/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          DEFAULT: '#d0fc03',
          hover: '#b8e002',
          glow: '#d0fc0350',
        },
        dark: {
          900: '#0a0a0a',
          800: '#111827',
          700: '#1F2937',
          600: '#374151',
        },
      },
      boxShadow: {
        'neon': '0 0 20px rgba(208, 252, 3, 0.3)',
        'neon-lg': '0 0 30px rgba(208, 252, 3, 0.5)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
