import {
  CurationListItemType,
  useDeleteAdminCuration,
  useGetAdminCurationList,
  usePatchAdminCuration,
} from '@/api/curation';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import dayjs from '@/lib/dayjs';
import { convertCurationLocationTypeToText } from '@/utils/convert';
import Header from '@components/admin/ui/header/Header';
import Heading from '@components/admin/ui/heading/Heading';
import EmptyContainer from '@components/common/ui/EmptyContainer';
import ErrorContainer from '@components/common/ui/ErrorContainer';
import LoadingContainer from '@components/common/ui/loading/LoadingContainer';
import WarningModal from '@components/ui/alert/WarningModal';
import { Button, Switch } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { josa } from 'es-hangul';
import { Pencil, Plus, Trash } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Row = CurationListItemType & {
  id: number | string;
};

const HomeCurationListPage = () => {
  const navigate = useNavigate();
  const { snackbar } = useAdminSnackbar();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading, error } = useGetAdminCurationList();

  const { mutateAsync: updateCuration, isPending: updateIsLoading } =
    usePatchAdminCuration({});

  const { mutateAsync: deleteCuration, isPending: deleteIsLoading } =
    useDeleteAdminCuration({});

  const columns = useMemo<GridColDef<Row>[]>(
    () => [
      {
        field: 'locationType',
        headerName: '노출 영역',
        width: 150,
        valueGetter: (_, row) =>
          convertCurationLocationTypeToText(row.locationType),
      },
      {
        field: 'title',
        headerName: '제목',
        flex: 1,
        valueGetter: (_, row) => row.title,
      },
      {
        field: 'visiblePeriod',
        headerName: '노출 기간',
        width: 200,
        valueGetter: (_, row) =>
          `${dayjs(row.startDate).format('YY.MM.DD')} ~ ${dayjs(row.endDate).format('YY.MM.DD')}`,
      },
      {
        field: 'isVisible',
        headerName: '노출여부',
        width: 150,
        type: 'boolean',
        renderCell: ({ row }) => (
          <Switch
            checked={row.isVisible}
            disabled={updateIsLoading}
            onChange={async (e) => {
              const checked = e.target.checked;
              await updateCuration({
                id: row.curationId,
                body: { isVisible: checked },
              });
              snackbar(
                `노출여부가 ${checked ? '노출' : '비노출'} 상태로 변경되었습니다.`,
              );
            }}
          />
        ),
      },
      {
        field: 'action',
        headerName: '관리',
        width: 150,
        type: 'actions',
        getActions: (params) => {
          const id = params.row.curationId;
          return [
            <GridActionsCellItem
              key={'edit' + id}
              icon={<Pencil size={16} />}
              label="수정"
              onClick={() => navigate(`/admin/home/curation/${id}`)}
            />,
            <GridActionsCellItem
              key={'delete' + id}
              icon={<Trash color="red" size={16} />}
              label="삭제"
              onClick={() => setDeleteId(id)}
            />,
          ];
        },
      },
    ],
    [navigate, snackbar, updateCuration, updateIsLoading],
  );

  return (
    <>
      <div className="mx-6 mb-40 mt-6">
        <Header>
          <Heading>홈 큐레이션 관리</Heading>
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="contained"
              color="primary"
              startIcon={<Plus size={12} />}
              onClick={() => navigate(`/admin/home/curation/create`)}
            >
              등록
            </Button>
          </div>
        </Header>
        <main>
          {isLoading ? (
            <LoadingContainer />
          ) : error ? (
            <ErrorContainer />
          ) : data?.curationList.length === 0 ? (
            <EmptyContainer text="등록된 큐레이션이 없습니다." />
          ) : (
            <>
              <DataGrid
                rows={
                  data?.curationList.map((item) => ({
                    ...item,
                    id: item.curationId,
                  })) as Row[]
                }
                columns={columns}
                hideFooter
              />
            </>
          )}
        </main>
      </div>
      <WarningModal
        isOpen={!!deleteId}
        isLoading={deleteIsLoading}
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          await deleteCuration(deleteId as number);
          setDeleteId(null);
          snackbar('삭제되었습니다.');
        }}
        title={`${josa(data?.curationList.find((item) => item.curationId === deleteId)?.title ?? '-', '을/를')} 삭제하시겠습니까?`}
        content="삭제된 데이터는 복구할 수 없습니다."
        cancelText="취소"
        confirmText="삭제"
      />
    </>
  );
};

export default HomeCurationListPage;
