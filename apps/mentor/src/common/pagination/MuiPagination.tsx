import { Pagination, ThemeProvider, useMediaQuery } from '@mui/material';
import React, { memo } from 'react';

import { IPageInfo } from '@/types/interface';
import { theme } from './mui-theme';

const SX = { mx: 'auto' };

interface MuiPaginationProps {
  pageInfo: IPageInfo;
  page: number;
  onChange?: (event: React.ChangeEvent<unknown>, page: number) => void;
  className?: string;
}

const MuiPagination = ({
  pageInfo,
  onChange,
  page,
  className,
}: MuiPaginationProps) => {
  const matches = useMediaQuery('(min-width:640px)');

  return (
    <ThemeProvider theme={theme}>
      <Pagination
        className={className}
        page={page}
        onChange={onChange}
        count={pageInfo.totalPages}
        color="primary"
        shape="rounded"
        showFirstButton
        showLastButton
        size={matches ? 'medium' : 'small'}
        sx={SX}
        boundaryCount={1}
      />
    </ThemeProvider>
  );
};

export default memo(MuiPagination);
