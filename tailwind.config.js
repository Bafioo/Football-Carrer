/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#171717',
        ink: '#fdfcfc',
        'ink-deep': '#d8d5d5',
        charcoal: '#d0cdcd',
        body: '#c8c5c5',
        mute: '#9a9797',
        stone: '#8f8c8c',
        ash: '#6e6b6b',
        'surface-soft': '#232323',
        'surface-card': '#2b2b2b',
        'surface-dark': '#171717',
        'surface-dark-elevated': '#2b2b2b',
        hairline: 'rgba(253,252,252,0.14)',
        'hairline-strong': '#8a8787',
        accent: '#007aff',
        'accent-hover': '#0056b3',
        danger: '#ff3b30',
        'danger-hover': '#d70015',
        warning: '#ff9f0a',
        'warning-hover': '#cc7f08',
        success: '#30d158',
        'success-hover': '#28a745',
      },
      fontFamily: {
        sans: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
        display: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      }
    },
  },
  plugins: [],
}
