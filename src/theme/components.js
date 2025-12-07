// Tokens auxiliares para componentes UI
import { COLORS, RADII, SHADOWS, SPACING } from './tokens';

export const CARD = {
  background: '#ffffff',
  radius: RADII.lg,
  padding: SPACING.lg,
  shadow: SHADOWS.md,
  hoverShadow: SHADOWS.lg
};

export const BUTTON = {
  radius: RADII.md,
  paddingY: '0.75rem',
  paddingX: '1.5rem',
  fontSize: '0.875rem',
  gap: SPACING.sm,
  primary: {
    background: COLORS.primary,
    hover: COLORS.primaryDark,
    text: '#ffffff'
  },
  secondary: {
    background: COLORS.secondary,
    text: '#ffffff'
  },
  danger: {
    background: COLORS.danger,
    text: '#ffffff'
  }
};

export const BADGE = {
  radius: '9999px',
  sizes: {
    sm: { paddingY: '0.25rem', paddingX: '0.75rem', fontSize: '0.75rem' }
  },
  variants: {
    success: { background: COLORS.primaryLight, text: COLORS.primaryDark },
    warning: { background: '#fef3c7', text: '#92400e' },
    danger: { background: '#fee2e2', text: '#991b1b' },
    info: { background: '#e0f2fe', text: '#075985' },
    neutral: { background: COLORS.gray[100], text: COLORS.gray[700] }
  }
};

export const ELEVATION = {
  card: SHADOWS.md,
  cardHover: SHADOWS.lg,
  modal: SHADOWS.lg
};

export const LAYOUT = {
  containerMaxWidth: '1200px'
};
