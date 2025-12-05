
import { useStore } from './store'

const lightColors = {
  background: '#fffaf5',
  card: '#fff3e6',
  primary: '#f28c28',
  primaryDark: '#cf731d',
  text: '#2b2b2b',
  muted: '#8a8a8a',
  border: '#f1dec9',
  success: '#1e9e63',
  danger: '#e05252',
}

const darkColors = {
  background: '#1a1a1a',
  card: '#2d2d2d',
  primary: '#f28c28', // Keep primary same or adjust slightly
  primaryDark: '#cf731d',
  text: '#ffffff',
  muted: '#a0a0a0',
  border: '#404040',
  success: '#1e9e63',
  danger: '#e05252',
}

export const useTheme = () => {
  const themeMode = useStore(s => s.themeMode)
  const colors = themeMode === 'dark' ? darkColors : lightColors

  return {
    colors,
    radius: 16,
    spacing: (n: number) => n * 8,
    shadow: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    mode: themeMode
  }
}

// Deprecated: Use useTheme() instead. Kept for backward compatibility during refactor.
export const theme = {
  colors: lightColors,
  radius: 16,
  spacing: (n: number) => n * 8,
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  }
}
