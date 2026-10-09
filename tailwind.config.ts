import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Green theme - sesuai DESIGN.md
        primary: {
          DEFAULT: '#16a34a', // green-600
          dark: '#15803d',    // green-700
          light: '#22c55e',   // green-500
          bright: '#4ade80',  // green-400
        },
        // Custom colors jika dibutuhkan
        whatsapp: '#25D366',
      },
      fontFamily: {
        display: ['var(--font-bricolage)', 'sans-serif'],
        body: ['var(--font-figtree)', 'sans-serif'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1.5rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
    },
  },
  plugins: [],
};

export default config;
