// Design tokens base para reuso em JS

export const COLORS = {
  primary: '#10b981',
  primaryDark: '#059669',
  primaryLight: '#d1fae5',
  secondary: '#3b82f6',
  danger: '#ef4444',
  danger50: '#fef2f2',
  warning: '#f59e0b',
  accentNavy: '#2c3e50',
  accentAmber: '#FFC72C',
  accentBlue: '#2980b9',
  accentGold: '#f1c40f',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    600: '#4b5563',
    500: '#6b7280',
    700: '#374151',
    900: '#111827'
  }
};

export const TYPOGRAPHY = {
  fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },
  sizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem'
  }
};

export const SPACING = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
  xxl: '2rem'
};

export const RADII = {
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem'
};

export const SHADOWS = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 12px 25px -3px rgba(0, 0, 0, 0.12)'
};

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px'
};

export const Z_INDEX = {
  base: 1,
  dropdown: 900,
  modal: 1000,
  fab: 1000,
  tooltip: 1100
};

export const TRANSITIONS = {
  fast: '0.15s ease',
  base: '0.2s ease',
  slow: '0.3s ease'
};
