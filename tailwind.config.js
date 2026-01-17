/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2D3748',
        secondary: '#718096',
        accent: '#C4A35A',
        background: '#F7FAFC',
        'card-bg': '#FFFFFF',
        'text-main': '#1A202C'
      },
      fontFamily: {
        sans: [
          '"Noto Sans JP"',
          '"游ゴシック"',
          'YuGothic',
          'sans-serif'
        ]
      }
    }
  },
  plugins: []
}
