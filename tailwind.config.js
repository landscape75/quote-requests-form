module.exports = {
  variants: {
    extend: {
      opacity: ['disabled']
    }
  },
  darkMode: 'class',
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
          "50": "#34cdff",
          "100": "#2ac3ff",
          "200": "#20b9fd",
          "300": "#16aff3",
          "400": "#0ca5e9",
          "500": "#029bdf",
          "600": "#0091d5",
          "700": "#0087cb",
          "800": "#007dc1",
          "900": "#0073b7"
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
