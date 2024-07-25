import { Pagination, ThemeProvider, useMediaQuery } from '@mui/material';

import React, { memo } from 'react';
import { IPageInfo } from '../../../../types/interface';
import { theme } from './mui-theme';

interface MuiPaginationProps {
  pageInfo: IPageInfo;
  page: number;
  onChange?: (event: React.ChangeEvent<unknown>, page: number) => void;
}

const MuiPagination = ({ pageInfo, onChange, page }: MuiPaginationProps) => {
  const matches = useMediaQuery('(min-width:640px)');

  if (pageInfo.totalPages > 1)
    return (
      <ThemeProvider theme={theme}>
        <Pagination
          page={page}
          onChange={onChange}
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
