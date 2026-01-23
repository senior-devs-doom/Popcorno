import { extendTheme } from '@mui/joy';

export const theme = extendTheme({
  defaultMode: 'dark',
  colorSchemes: {
    light: {
      palette: {
        primary: {
          solidBg: '#FF9900',
          solidHoverBg: '#E68700',
          solidActiveBg: '#CC7800',
          plainColor: '#FF9900',
          outlinedColor: '#FF9900',
          outlinedBorder: '#FF9900',
        },
        background: { body: '#000', surface: '#111' },
        text: { primary: '#fff', secondary: 'rgba(255,255,255,0.85)' },
      },
    },
    dark: {
      palette: {
        primary: {
          solidBg: '#FF9900',
          solidHoverBg: '#E68700',
          solidActiveBg: '#CC7800',
          plainColor: '#FF9900',
          outlinedColor: '#FF9900',
          outlinedBorder: '#FF9900',
        },
        neutral: {
          solidBg: '#0D0D0D',
          softBg: '#1A1A1A',
          softHoverBg: '#222',
          outlinedBorder: 'rgba(255,255,255,0.18)',
          plainHoverBg: 'rgba(255,255,255,0.1)',
        },
        background: { body: '#000', surface: '#111', popup: '#141414' },
        text: {
          primary: '#FFF',
          secondary: 'rgba(255,255,255,0.85)',
          tertiary: 'rgba(255,255,255,0.65)',
        },
      },
    },
  },

  fontFamily: {
    body: 'Poppins, Inter, Segoe UI, system-ui, sans-serif',
  },

  components: {
    JoyButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 700,
          textTransform: 'uppercase',
        },
        solid: {
          backgroundColor: '#FF9900',
          color: '#000',
          '&:hover': { backgroundColor: '#E68700' },
        },
        plain: {
          color: '#FFF',
          '&:hover': { backgroundColor: 'rgba(255,153,0,0.12)' },
        },
        outlined: {
          borderColor: '#FF9900',
          color: '#FF9900',
          '&:hover': { backgroundColor: 'rgba(255,153,0,0.15)' },
        },
      },
    },

    JoyChip: {
      styleOverrides: {
        root: { 
          borderRadius: 999, 
          fontWeight: 600, 
          paddingInline: 12, 
          height: 34,
        },
        outlined: {
          borderColor: 'rgba(255,255,255,0.25)',
          color: '#fff',
          '&:hover': {
            borderColor: '#FF9900',
            color: '#FF9900',
            backgroundColor: 'rgba(255,153,0,0.1)',
          },
        },
        solid: {
          backgroundColor: '#FF9900',
          color: '#000',
          '&:hover': { backgroundColor: '#E68700' },
        },
      },
    },

    JoyCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.12)',
        },
      },
    },
  },
});
