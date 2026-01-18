/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2D3748',
          light: '#4A5568',
          dark: '#1A202C',
        },
        secondary: {
          DEFAULT: '#718096',
          light: '#A0AEC0',
          dark: '#4A5568',
        },
        accent: {
          DEFAULT: '#C4A35A',
          light: '#D4B96A',
          dark: '#A88B4A',
        },
        background: '#F7FAFC',
        'card-bg': '#FFFFFF',
        'text-main': '#1A202C',
        border: {
          DEFAULT: '#E2E8F0',
          light: '#EDF2F7',
        },
      },
      fontFamily: {
        sans: [
          '"Noto Sans JP"',
          '"游ゴシック"',
          'YuGothic',
          'sans-serif'
        ]
      },
      boxShadow: {
        'elegant': '0 4px 20px -2px rgba(0, 0, 0, 0.08)',
        'card': '0 2px 8px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 25px -5px rgba(0, 0, 0, 0.1)',
        'input-focus': '0 0 0 3px rgba(196, 163, 90, 0.2)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      transitionDuration: {
        '250': '250ms',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    }
  },
  plugins: []
}
