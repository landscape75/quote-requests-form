module.exports = {
  mode: 'jit',
  purge: ['./components/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
  variants: {
    extend: {
      //opacity: ['disabled']
    }
  },
  darkMode: 'class',
  plugins: [
    //require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),

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
        "mag-grey": {
          DEFAULT: '#363636',
          "50": "#686868",
          "100": "#5e5e5e",
          "200": "#545454",
          "300": "#4a4a4a",
          "400": "#404040",
          "500": "#363636",
          "600": "#2c2c2c",
          "700": "#222222",
          "800": "#181818",
          "900": "#0e0e0e"
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
        },
        "lc-green": {
          DEFAULT: "#066639",
          "100": "#41F6A2",
          "200": "#10F48A",
          "300": "#09C86F",
          "400": "#079754",
          "500": "#056639",
          "600": "#03361E",
          "700": "#000503",
          "800": "#000000",
          "900": "#000000"
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
