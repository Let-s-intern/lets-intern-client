import { Pagination, ThemeProvider } from '@mui/material';

import { theme } from './mui-theme';
import { IPageInfo } from '../../../../interfaces/interface';

export interface MuiPaginationProps {
  pageInfo: IPageInfo;
}

const MuiPagination = ({ pageInfo }: MuiPaginationProps) => {
  if (pageInfo.totalPages >= 0)
    return (
      <ThemeProvider theme={theme}>
        <Pagination
          className="flex justify-center"
          onChange={(event, page) => console.log(event, page)}
          count={pageInfo.totalPages}
          color="primary"
          showFirstButton
          showLastButton
        />
      </ThemeProvider>
    );

  return null;
};

export default MuiPagination;
