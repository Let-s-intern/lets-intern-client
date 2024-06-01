import { Pagination, ThemeProvider } from '@mui/material';

import { theme } from './mui-theme';

const MuiPagination = () => {
  return (
    <ThemeProvider theme={theme}>
      <Pagination count={5} color="primary" showFirstButton showLastButton />
    </ThemeProvider>
  );
};

export default MuiPagination;
