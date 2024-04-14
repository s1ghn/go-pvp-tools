import colors from 'tailwindcss/colors';
import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: [ './src/**/*.{html,js,svelte,ts}' ],
  darkMode: "class",
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      stone: colors.stone,
      orange: colors.orange,
    },
    extend: {
      width: {
        "lg": defaultTheme.columns.lg,
      },
      dropShadow: {
        outlined: "0 0 0.1rem rgba(0, 0, 0, 0.45)",
        "outlined-white": "0 0 0.1rem rgba(255, 255, 255, 0.45)"
      }
    },
  },
  plugins: [],
}

