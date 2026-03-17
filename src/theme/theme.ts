'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0a66c2', // LinkedIn blue
      light: '#378fe9',
      dark: '#004182',
    },
    secondary: {
      main: '#057642', // LinkedIn green (for buttons like Apply/Connect)
      light: '#42a573',
      dark: '#024b2a',
    },
    background: {
      default: '#f3f2ef', // LinkedIn gray background
      paper: '#ffffff',
    },
    text: {
      primary: '#000000e6',
      secondary: '#000000e6',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'system-ui',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      '"Fira Sans"',
      'Ubuntu',
      'Oxygen',
      '"Oxygen Sans"',
      'Cantarell',
      '"Droid Sans"',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
      '"Lucida Grande"',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20, // Rounded buttons
          padding: '6px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
