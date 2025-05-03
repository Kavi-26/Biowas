export const theme = {
  colors: {
    background: {
      default: '#FAFAFE',
      gradient: ['#F8F9FF', '#F0F3FF'],
    },
    primary: {
      default: '#7F00FF',
      gradient: ['#7F00FF', '#E100FF'],
    },
    secondary: {
      default: '#00E5FF', // Bright cyan
      light: '#73FDFF',
      dark: '#00B8D4',
      gradient: ['#00E5FF', '#2979FF'], // Cyan to blue gradient
    },
    accent: {
      success: '#00D9A6',
      warning: '#FFB300',
      error: '#FF5252',
      info: '#2979FF',
    },
    text: {
      primary: '#1A1A3C',
      secondary: '#666687',
      disabled: '#B2B2BF',
      inverse: '#FFFFFF',
      accent: '#7F00FF',
    },
    border: {
      default: '#E2E8F7',
      focused: '#7F00FF',
    },
    glass: {
      background: 'rgba(255, 255, 255, 0.8)',
      border: 'rgba(255, 255, 255, 0.3)',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    h1: {
      fontSize: 44,
      fontWeight: '800',
      letterSpacing: -1,
      lineHeight: 52,
    },
    h2: {
      fontSize: 32,
      fontWeight: '700',
      letterSpacing: -0.5,
      lineHeight: 40,
    },
    subtitle: {
      fontSize: 18,
      letterSpacing: 0.2,
      lineHeight: 28,
      fontWeight: '500',
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
    button: {
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: 0.8,
    },
  },
  borderRadius: {
    sm: 10,
    md: 20,
    lg: 28,
    xl: 36,
    full: 9999,
  },
  shadows: {
    small: {
      shadowColor: '#7F00FF',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
    },
    medium: {
      shadowColor: '#7F00FF',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.18,
      shadowRadius: 12,
      elevation: 6,
    },
    large: {
      shadowColor: '#7F00FF',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 10,
    },
    glass: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
  },
  animation: {
    scale: {
      pressed: 0.95,
      focused: 1.02,
    },
    duration: {
      short: 150,
      medium: 300,
      long: 450,
    },
    timing: {
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      spring: 'spring',
    },
  },
  layout: {
    containerPadding: 24,
    maxWidth: 500,
    inputHeight: 58,
    buttonHeight: 54,
    headerHeight: 60,
  },
  // New glass effect styles
  glass: {
    background: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      borderColor: 'rgba(255, 255, 255, 0.3)',
      borderWidth: 1,
    },
  }
};