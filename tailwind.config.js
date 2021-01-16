module.exports = {
  variants: {
    extend: {
      opacity: ['disabled']
    }
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),

  ],
  theme: {
    extend: {
      colors: {
        'accent-1': '#FAFAFA',
        'accent-2': '#EAEAEA',
        'accent-7': '#333',
        success: '#0070f3',
        cyan: '#79FFE1',
        'mag-blue': {
          DEFAULT: '#029BDF',
          '100': '#41F6A2',
          '200': '#10F48A',
          '300': '#09C86F',
          '400': '#079754',
          '500': '#056639',
          '600': '#03361E',
          '700': '#000503',
          '800': '#000000',
          '900': '#000000'
        },
        'lc-yellow': {
          DEFAULT: '#edb211',
          '50': '#fffcf4',
          '100': '#fef8e8',
          '200': '#fbecc4',
          '300': '#f8e09e',
          '400': '#f3ca59',
          '500': '#edb211',
          '600': '#d39f10',
          '700': '#8f6b0b',
          '800': '#6b5108',
          '900': '#453405' 
        }
      },
      spacing: {
        28: '7rem',
      },
      letterSpacing: {
        tighter: '-.04em',
      },
      lineHeight: {
        tight: 1.2,
      },
      fontSize: {
        '5xl': '2.5rem',
        '6xl': '2.75rem',
        '7xl': '4.5rem',
        '8xl': '6.25rem',
      },
      boxShadow: {
        small: '0 5px 10px rgba(0, 0, 0, 0.12)',
        medium: '0 8px 30px rgba(0, 0, 0, 0.12)',
      },
    },
  },
}
