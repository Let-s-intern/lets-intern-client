'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Pageable {
  page: number;
  size: number;
}

interface UsePageableWithSearchParamsOptions {
  defaultPage?: number;
  defaultSize?: number;
}

interface UsePageableWithSearchParamsReturn {
  pageable: Pageable;
  setPageable: React.Dispatch<React.SetStateAction<Pageable>>;
  handlePageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
}

/**
 * MuiPagination의 pageable을 searchParams와 연동하는 훅
 * @param options - 기본값 설정 (defaultPage: 1, defaultSize: 10)
 * @returns pageable, setPageable, handlePageChange
 */
export function usePageableWithSearchParams(
  options: UsePageableWithSearchParamsOptions = {},
): UsePageableWithSearchParamsReturn {
  const { defaultPage = 1, defaultSize = 10 } = options;
  const searchParams = useSearchParams();

  const [pageable, setPageable] = useState<Pageable>(() => {
    const page = parseInt(searchParams.get('page') || defaultPage.toString(), 10);
    const size = parseInt(searchParams.get('size') || defaultSize.toString(), 10);
    return { page, size };
  });

  // Page 변경 핸들러 (MuiPagination의 onChange 형식)
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setPageable((prev) => ({ ...prev, page }));
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    params.set('size', pageable.size.toString());
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}?${params}`,
    );
  };

  // searchParams 변경 시 pageable 동기화 (뒤로가기/앞으로가기 대응)
  useEffect(() => {
    const page = parseInt(searchParams.get('page') || defaultPage.toString(), 10);
    const size = parseInt(searchParams.get('size') || defaultSize.toString(), 10);
    setPageable({ page, size });
  }, [searchParams, defaultPage, defaultSize]);

  return {
    pageable,
    setPageable,
    handlePageChange,
  };
}

