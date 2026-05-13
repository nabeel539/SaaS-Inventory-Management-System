/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        geist: ['Geist', 'monospace'],
      },
      colors: {
        surface: {
          DEFAULT: '#f9f9f9',
          dim: '#dadada',
          bright: '#f9f9f9',
          container: {
            lowest: '#ffffff',
            low: '#f3f3f3',
            DEFAULT: '#eeeeee',
            high: '#e8e8e8',
            highest: '#e2e2e2',
          },
        },
        primary: {
          DEFAULT: '#000000',
          container: '#1b1b1b',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#505f76',
          container: '#d0e1fb',
        },
        muted: {
          DEFAULT: '#f3f3f3',
          foreground: '#4c4546',
        },
        outline: {
          DEFAULT: '#7e7576',
          variant: '#cfc4c5',
        },
        destructive: {
          DEFAULT: '#ba1a1a',
          foreground: '#ffffff',
          container: '#ffdad6',
        },
        stock: {
          in: '#16a34a',
          'in-bg': '#dcfce7',
          low: '#d97706',
          'low-bg': '#fef3c7',
          out: '#dc2626',
          'out-bg': '#fee2e2',
        },
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        sm: '0.25rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
      },
      spacing: {
        'sidebar': '240px',
      },
      maxWidth: {
        'container': '1440px',
      },
      fontSize: {
        'display': ['32px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '600' }],
        'headline': ['24px', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'title': ['18px', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '500' }],
        'body': ['14px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['13px', { lineHeight: '1.5', fontWeight: '400' }],
        'label': ['11px', { lineHeight: '1', letterSpacing: '0.05em', fontWeight: '600' }],
        'mono': ['13px', { lineHeight: '1', letterSpacing: '-0.01em', fontWeight: '450' }],
      },
    },
  },
  plugins: [],
};
