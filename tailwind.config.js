/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0066FF",
        secondary: "#1A1A1A",
        accent: "#FF6B35",
        surface: "#FFFFFF",
        background: "#F8F9FA",
        success: "#00C853",
        warning: "#FFB300",
        error: "#E53935",
        info: "#0288D1"
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 16px rgba(0, 0, 0, 0.12)',
        'cart': '0 12px 32px rgba(0, 0, 0, 0.16)'
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '300': '300ms'
      }
    },
  },
  plugins: [],
}