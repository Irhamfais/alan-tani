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
        // Background colors
        bg: 'var(--bg)',
        'bg-alt': 'var(--bg-alt)',
        'bg-deep': 'var(--bg-deep)',
        
        // Surface colors
        surface: 'var(--surface)',
        'surface-hi': 'var(--surface-hi)',
        canopy: 'var(--canopy)',
        
        // Accent colors
        accent: 'var(--accent)',
        'accent-hi': 'var(--accent-hi)',
        'on-accent': 'var(--on-accent)',
        
        // Text colors
        text: 'var(--text)',
        'text-2': 'var(--text-2)',
        'text-3': 'var(--text-3)',
        
        // Border
        line: 'var(--line)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
      },
      spacing: {
        'header': 'var(--header-h)',
      },
    },
  },
  plugins: [],
};

export default config;
