const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')

module.exports = {
  purge: [
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,vue}'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        gray: colors.blueGray,
        primary: {
          DEFAULT: colors.purple['600'],
          ...colors.purple
        }
      },
      boxShadow: {
        'inner-md': 'inset 0 4px 6px -1px rgba(0, 0, 0, 0.1), inset 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      },
      inset: {
        15: '3.75rem'
      }
    }
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
      borderColor: ['active']
    }
  },
  plugins: [
    // require('@tailwindcss/forms')
  ]
}
