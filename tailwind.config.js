/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        text: 'var(--color-text)',
        muted: 'var(--color-muted)',
        border: 'var(--color-border)',
        primary: 'var(--color-primary)',
        'primary-strong': 'var(--color-primary-strong)',
        accent: 'var(--color-accent)',
        gold: 'var(--color-gold)',
        'primary-foreground': 'var(--color-primary-foreground)',
        'status-connected': 'var(--color-status-connected)',
        'status-connecting': 'var(--color-status-connecting)',
        'status-disconnected': 'var(--color-status-disconnected)',
      },
      boxShadow: {
        soft: '0 16px 36px var(--shadow-soft)',
      },
      backgroundImage: {
        'map-pattern':
          'radial-gradient(circle at 1px 1px, color-mix(in oklab, var(--color-text) 16%, transparent) 1px, transparent 0)',
      },
    },
  },
  plugins: [],
}

