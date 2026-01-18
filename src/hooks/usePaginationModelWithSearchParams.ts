'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface PaginationModel {
  page: number;
  pageSize: number;
}

interface UsePaginationModelWithSearchParamsOptions {
  defaultPage?: number;
  defaultPageSize?: number;
}

interface UsePaginationModelWithSearchParamsReturn {
  paginationModel: PaginationModel;
  setPaginationModel: React.Dispatch<React.SetStateAction<PaginationModel>>;
  handlePaginationModelChange: (newModel: PaginationModel) => void;
}

/**
 * MUI DataGrid의 paginationModel을 searchParams와 연동하는 훅
 * @param options - 기본값 설정 (defaultPage: 0, defaultPageSize: 20)
 * @returns paginationModel, setPaginationModel, handlePaginationModelChange
 */
export function usePaginationModelWithSearchParams(
  options: UsePaginationModelWithSearchParamsOptions = {},
): UsePaginationModelWithSearchParamsReturn {
  const { defaultPage = 0, defaultPageSize = 20 } = options;
  const searchParams = useSearchParams();

  const [paginationModel, setPaginationModel] = useState<PaginationModel>(() => {
    const page = parseInt(searchParams.get('page') || defaultPage.toString(), 10);
    const pageSize = parseInt(
      searchParams.get('pageSize') || defaultPageSize.toString(),
      10,
    );
    return { page, pageSize };
  });

  // Pagination 변경 핸들러
  const handlePaginationModelChange = (newModel: PaginationModel) => {
    setPaginationModel(newModel);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newModel.page.toString());
    params.set('pageSize', newModel.pageSize.toString());
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}?${params}`,
    );
  };

  // searchParams 변경 시 paginationModel 동기화 (뒤로가기/앞으로가기 대응)
  useEffect(() => {
    const page = parseInt(searchParams.get('page') || defaultPage.toString(), 10);
    const pageSize = parseInt(
      searchParams.get('pageSize') || defaultPageSize.toString(),
      10,
    );
    setPaginationModel({ page, pageSize });
  }, [searchParams, defaultPage, defaultPageSize]);

  return {
    paginationModel,
    setPaginationModel,
    handlePaginationModelChange,
  };
}

