import EmptyContainer from '@/common/container/EmptyContainer';
import LoadingContainer from '@/common/loading/LoadingContainer';
import { useGetAllInOnePassListQuery } from '@/api/all-in-one-pass/usePassList';
import { getListColumns } from '@/domain/all-in-one-pass/ui/list/columns';
import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';
import { usePaginationModelWithSearchParams } from '@/hooks/usePaginationModelWithSearchParams';
import { Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useMemo } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

/** A-1 올인원패스 개설(목록) */
export default function AllInOnePassList() {
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetAllInOnePassListQuery();
  const list = useMemo(() => data ?? [], [data]);
  const columns = useMemo(() => getListColumns(list), [list]);

  const { paginationModel, handlePaginationModelChange } =
    usePaginationModelWithSearchParams({ defaultPage: 0, defaultPageSize: 20 });

  return (
    <main className="flex flex-col gap-5 p-6">
      <Header>
        <Heading>올인원패스 개설</Heading>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FaPlus size={12} />}
          onClick={() => navigate('/all-in-one-pass/create')}
        >
          올인원패스 개설
        </Button>
      </Header>

      {isLoading ? (
        <LoadingContainer />
      ) : error ? (
        <div className="py-4 text-center">에러 발생</div>
      ) : list.length === 0 ? (
        <EmptyContainer text="개설된 올인원패스가 없습니다." />
      ) : (
        <DataGrid
          autoHeight
          rows={list}
          columns={columns}
          pagination
          pageSizeOptions={[10, 20, 50, 100]}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
        />
      )}
    </main>
  );
}
