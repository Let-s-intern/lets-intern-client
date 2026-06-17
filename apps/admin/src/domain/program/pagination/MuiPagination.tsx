import { Pagination, ThemeProvider, useMediaQuery } from '@mui/material';
import React, { memo } from 'react';

import { theme } from './mui-theme';

const SX = { mx: 'auto' };

interface MuiPaginationProps {
  // 호출처마다 IPageInfo / zod 인퍼런스 등 다양한 shape 가 들어오고 실제로는
  // totalPages 만 사용하므로, 필요한 필드만 받아 구조적 호환성을 넓힌다.
  // (zod transform 후 admin tsconfig 의 strict 모드에서 totalPages 도 optional 로
  //  추론되는 케이스가 있어 ?: 로 둔다.)
  pageInfo: { totalPages?: number; [key: string]: unknown };
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
        count={pageInfo.totalPages ?? 0}
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
