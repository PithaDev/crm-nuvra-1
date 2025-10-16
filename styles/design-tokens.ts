export const colors = {
  background: {
    primary: '#0b0b15',
    secondary: '#12121f',
    tertiary: '#1a1a2e',
    hover: '#1f1f33',
  },
  accent: {
    purple: '#7f00ff',
    purpleLight: '#9933ff',
    purpleDark: '#6600cc',
    cyan: '#00e6e6',
    cyanLight: '#33ffff',
    cyanDark: '#00b8b8',
  },
  text: {
    primary: '#ffffff',
    secondary: '#b8b8d4',
    tertiary: '#8888a8',
    muted: '#5a5a7a',
  },
  border: {
    default: '#2a2a3e',
    hover: '#3a3a52',
    focus: '#7f00ff',
  },
  status: {
    success: '#00ff88',
    warning: '#ffaa00',
    error: '#ff3366',
    info: '#00e6e6',
  },
} as const;

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
} as const;

export const typography = {
  fontFamily: {
    sans: 'var(--font-sans)',
    mono: 'var(--font-mono)',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(127, 0, 255, 0.05)',
  md: '0 4px 6px -1px rgba(127, 0, 255, 0.1)',
  lg: '0 10px 15px -3px rgba(127, 0, 255, 0.2)',
  xl: '0 20px 25px -5px rgba(127, 0, 255, 0.25)',
  glow: '0 0 20px rgba(127, 0, 255, 0.5)',
  glowCyan: '0 0 20px rgba(0, 230, 230, 0.5)',
} as const;

export const animation = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

export const borderRadius = {
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  full: '9999px',
} as const;
