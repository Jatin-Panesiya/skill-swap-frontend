export const theme = {
  colors: {
    primary: '#6366F1',
    primaryDark: '#4F46E5',
    secondary: '#14B8A6',
    
    bgLight: '#F9FAFB',
    bgCard: '#FFFFFF',
    bgDark: '#0F172A',
    
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    
    border: '#E2E8F0',
    borderInput: '#CBD5E1',
    
    error: '#EF4444',
    errorHover: '#DC2626',
    warning: '#F59E0B',
    
    buttonSecondaryBg: '#F1F5F9',
    buttonSecondaryHover: '#E2E8F0',
  },
  
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    fontWeights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    fontSizes: {
      h1: '2rem',
      h2: '1.5rem',
      h3: '1.25rem',
      h4: '1.125rem',
      base: '1rem',
      sm: '0.875rem',
      xs: '0.75rem',
    },
  },
  
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
  },
  
  borderRadius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
  },
  
  shadows: {
    card: 'rgba(0, 0, 0, 0.04) 0 3px 6px',
  },
  
  buttons: {
    primary: {
      backgroundColor: '#6366F1',
      hoverBackgroundColor: '#4F46E5',
      color: '#FFFFFF',
      borderRadius: '0.5rem',
      padding: '0.75rem 1.25rem',
    },
    secondary: {
      backgroundColor: '#F1F5F9',
      hoverBackgroundColor: '#E2E8F0',
      color: '#0F172A',
      border: '1px solid #CBD5E1',
      borderRadius: '0.5rem',
      padding: '0.75rem 1.25rem',
    },
    danger: {
      backgroundColor: '#EF4444',
      hoverBackgroundColor: '#DC2626',
      color: '#FFFFFF',
      borderRadius: '0.5rem',
      padding: '0.75rem 1.25rem',
    },
  },
  
  cards: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: 'rgba(0, 0, 0, 0.04) 0 3px 6px',
    padding: '1.25rem',
  },
  
  inputs: {
    border: '1px solid #CBD5E1',
    borderRadius: '8px',
    padding: '0.65rem',
    focusBorder: '#6366F1',
  },
} as const;

