// @see https://vike.dev/broken-npm-package#named-export-not-found
import * as pkg from '@mui/material/styles';
const { createTheme } = pkg;

export const theme = createTheme({
  palette: {
    primary: {
      main: '#DBDDFD',
    },
  },
});
