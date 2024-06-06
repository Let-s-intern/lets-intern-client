import { Pagination, ThemeProvider, useMediaQuery } from '@mui/material';

import { theme } from './mui-theme';
import { IPageInfo, IPageable } from '../../../../interfaces/interface';
import React, { memo, useCallback } from 'react';

export interface MuiPaginationProps {
  pageInfo: IPageInfo;
  setPageable: React.Dispatch<React.SetStateAction<IPageable>>;
}

const MuiPagination = ({ pageInfo, setPageable }: MuiPaginationProps) => {
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
