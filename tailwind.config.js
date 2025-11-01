/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#F0F3F5',
        text: '#0C0D15',
        muted: '#7D8598',
        muted2: '#ACB0B2',
        brown: '#4D3E32',
        accent: '#C33C0F',
        teal: '#62CEB1',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
