import { Pagination, ThemeProvider, useMediaQuery } from '@mui/material';

import { theme } from './mui-theme';
import { IPageInfo, IPageable } from '../../../../interfaces/interface';
import React, { memo, useCallback } from 'react';

interface MuiPaginationProps {
  pageInfo: IPageInfo;
  page: number;
  setPageable: React.Dispatch<React.SetStateAction<IPageable>>;
}

const MuiPagination = ({ pageInfo, setPageable, page }: MuiPaginationProps) => {
  const matches = useMediaQuery('(min-width:640px)');

  const handleChange = useCallback(
    (event: React.ChangeEvent<unknown>, page: number) => {
      setPageable((prev) => ({ ...prev, page }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [],
  );

  if (pageInfo.totalPages > 1)
    return (
      <ThemeProvider theme={theme}>
        <Pagination
          page={page}
          onChange={handleChange}
          count={pageInfo.totalPages}
          color="primary"
          showFirstButton
          showLastButton
          size={matches ? 'medium' : 'small'}
          sx={{ mx: 'auto' }}
          boundaryCount={1}
        />
      </ThemeProvider>
    );

  return null;
};

export default memo(MuiPagination);
