import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000', // Black
    },
    secondary: {
      main: '#ffffff', // White
    },
    text: {
      primary: '#ffffff', // White text
      secondary: '#000000', // Black text
    },
  },
});

export default theme;
