import { Pagination, ThemeProvider } from '@mui/material';

import { theme } from './mui-theme';
import { IPageInfo, IPageable } from '../../../../interfaces/interface';
import React from 'react';

export interface MuiPaginationProps {
  pageInfo: IPageInfo;
  setPageable: React.Dispatch<React.SetStateAction<IPageable>>;
}

const MuiPagination = ({ pageInfo, setPageable }: MuiPaginationProps) => {
  const handleChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPageable((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (pageInfo.totalPages > 1)
    return (
      <ThemeProvider theme={theme}>
        <Pagination
          className="flex justify-center"
          onChange={handleChange}
          count={pageInfo.totalPages}
          color="primary"
          showFirstButton
          showLastButton
        />
      </ThemeProvider>
    );

  return null;
};

export default React.memo(MuiPagination);
