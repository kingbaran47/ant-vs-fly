/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      fontFamily: {
        ranchers: ['Ranchers', 'cursive'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        correctBounce: {
          '0%, 100%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(1.5)' },
          '60%': { transform: 'scale(0.9)' },
          '80%': { transform: 'scale(1.15)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-8px)' },
          '40%': { transform: 'translateX(8px)' },
          '60%': { transform: 'translateX(-6px)' },
          '80%': { transform: 'translateX(6px)' },
        },
      },
      animation: {
        float: 'float 2.5s ease-in-out infinite',
        'float-delayed': 'float 2.5s ease-in-out infinite 1.2s',
        'slide-left': 'slideInLeft 0.3s ease-out',
        'slide-right': 'slideInRight 0.3s ease-out',
        'correct-bounce': 'correctBounce 0.6s ease-in-out',
        shake: 'shake 0.5s ease-in-out',
      },
    },
  },
  plugins: [],
}

