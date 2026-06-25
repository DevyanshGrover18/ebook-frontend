/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Core brand palette from design system image
        primary: '#0F172A',           // Deep navy (Primary #0F172A shown)
        'primary-container': '#1E2B3B',
        'on-primary': '#ffffff',
        'on-primary-container': '#BEC6D4',
        'primary-fixed': '#DAE2F0',
        'primary-fixed-dim': '#BEC6D4',
        'inverse-primary': '#BEC6D4',
        'on-primary-fixed': '#0F172A',
        'on-primary-fixed-variant': '#2D3E52',

        secondary: '#47556B',         // Slate blue-grey (#47556B)
        'secondary-container': '#D0D8E8',
        'on-secondary': '#ffffff',
        'on-secondary-container': '#1A2535',
        'secondary-fixed': '#E8EDF5',
        'secondary-fixed-dim': '#C4CDD E',
        'on-secondary-fixed': '#0D1620',
        'on-secondary-fixed-variant': '#2E3D52',

        tertiary: '#F8FAFC',          // Near-white (#F8FAFC)
        'tertiary-container': '#1E2B3B',
        'on-tertiary': '#0F172A',
        'on-tertiary-container': '#A8B8CC',
        'tertiary-fixed': '#E8EEF6',
        'tertiary-fixed-dim': '#C8D4E4',
        'on-tertiary-fixed': '#0F172A',
        'on-tertiary-fixed-variant': '#2E3E52',

        // Neutral scale anchored to #1E2B3B
        neutral: '#1E2B3B',

        // Surfaces — light lavender-grey background visible in the image
        background: '#ECEEF8',
        'on-background': '#0F172A',
        surface: '#F4F6FA',
        'surface-dim': '#D4D8E4',
        'surface-bright': '#F8FAFC',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#EEF0F8',
        'surface-container': '#E6E8F0',
        'surface-container-high': '#DEE2EC',
        'surface-container-highest': '#D4D8E4',
        'surface-variant': '#D8DCE8',
        'surface-tint': '#47556B',
        'on-surface': '#0F172A',
        'on-surface-variant': '#3C4558',

        // Inverse
        'inverse-surface': '#1E2B3B',
        'inverse-on-surface': '#EEF0F8',

        // Outline
        outline: '#6B7A90',
        'outline-variant': '#C0C8D8',

        // Error
        error: '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error': '#ffffff',
        'on-error-container': '#93000a',
      },

      borderRadius: {
        DEFAULT: '0.25rem',   // base — slightly more than before, matching visible card rounding
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px',
      },

      spacing: {
        'stack-xs': '4px',
        'stack-sm': '8px',
        'stack-md': '16px',
        'stack-lg': '32px',
        'stack-xl': '64px',
        'stack-2xl': '128px',
        'margin-mobile': '16px',
        'margin-desktop': '48px',
        gutter: '24px',
        'container-max': '1280px',
      },

      fontFamily: {
        // Headline → Domine (serif, as labeled in the design system)
        'display-lg': ['Domine', 'Georgia', 'serif'],
        'display-lg-mobile': ['Domine', 'Georgia', 'serif'],
        'headline-md': ['Domine', 'Georgia', 'serif'],
        'headline-sm': ['Domine', 'Georgia', 'serif'],
        // Body + UI → Work Sans (as labeled in the design system)
        'title-lg': ['Work Sans', 'system-ui', 'sans-serif'],
        'body-lg': ['Work Sans', 'system-ui', 'sans-serif'],
        'body-md': ['Work Sans', 'system-ui', 'sans-serif'],
        'label-md': ['Work Sans', 'system-ui', 'sans-serif'],
        'label-sm': ['Work Sans', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        'display-lg': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-lg-mobile': ['32px', { lineHeight: '40px', letterSpacing: '-0.01em', fontWeight: '700' }],
        'headline-md': ['32px', { lineHeight: '40px', fontWeight: '600' }],
        'headline-sm': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'title-lg': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'label-md': ['14px', { lineHeight: '20px', letterSpacing: '0.02em', fontWeight: '500' }],
        'label-sm': ['12px', { lineHeight: '16px', letterSpacing: '0.05em', fontWeight: '600' }],
      },
    },
  },
  plugins: [],
};