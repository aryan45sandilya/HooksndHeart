/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cream/Beige from logo background
        cream: {
          50: '#FFFEF9',
          100: '#FFFCF0',
          200: '#FFF8E1',
          300: '#F5E6D3',
          400: '#EDD9BF',
          500: '#E5CCAB',
          600: '#D4B896',
          700: '#C3A481',
          800: '#9A8366',
          900: '#71624B',
        },
        // Rust/Terracotta from basket and text
        rust: {
          50: '#FDF5F3',
          100: '#FBEAE7',
          200: '#F7D5CF',
          300: '#F3C0B7',
          400: '#EFAB9F',
          500: '#C85A3E',
          600: '#B34A2E',
          700: '#9E3A1E',
          800: '#7A2D17',
          900: '#562010',
        },
        // Coral/Pink from yarn
        coral: {
          50: '#FEF5F4',
          100: '#FDEBE9',
          200: '#FBD7D3',
          300: '#F9C3BD',
          400: '#F7AFA7',
          500: '#E87461',
          600: '#E55B46',
          700: '#D9422B',
          800: '#B33522',
          900: '#8D2819',
        },
        // Golden/Mustard from yarn
        golden: {
          50: '#FFFBF0',
          100: '#FFF7E1',
          200: '#FFEFC3',
          300: '#FFE7A5',
          400: '#FFDF87',
          500: '#E8A857',
          600: '#D99339',
          700: '#C07E1F',
          800: '#996518',
          900: '#724C12',
        },
        // Teal/Blue-Green from yarn
        teal: {
          50: '#F2F8F9',
          100: '#E5F1F3',
          200: '#CBE3E7',
          300: '#B1D5DB',
          400: '#97C7CF',
          500: '#5B9AA0',
          600: '#4A8289',
          700: '#3A6A72',
          800: '#2D525B',
          900: '#203A44',
        }
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'bounce-slow': 'bounce 3s infinite',
        'float': 'float 3s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
    },
  },
  plugins: [],
}
