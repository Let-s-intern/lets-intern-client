import {
  CurationListItemType,
  useDeleteAdminCuration,
  useGetAdminCurationList,
  usePatchAdminCuration,
} from '@/api/curation';
import WarningModal from '@/common/alert/WarningModal';
import EmptyContainer from '@/common/container/EmptyContainer';
import ErrorContainer from '@/common/container/ErrorContainer';
import LoadingContainer from '@/common/loading/LoadingContainer';
import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import dayjs from '@/lib/dayjs';
import { convertCurationLocationTypeToText } from '@/utils/convert';
import { Button, Switch } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { josa } from 'es-hangul';
import { Pencil, Plus, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';

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
              onClick={() => navigate(`/home/curation/${id}/edit`)}
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
              onClick={() => navigate(`/home/curation/create`)}
            >
              큐레이션 등록
            </Button>
          </div>
        </Header>
        <p className="mt-2 text-sm text-neutral-400">
          노출 영역마다 홈에 보이는 큐레이션 개수가 다릅니다.
        </p>

        {/* 홈 노출 규칙 안내 (어드민이 왜 일부 큐레이션이 안 보이는지 알도록 표시) */}
        <div className="mb-4 mt-3 flex flex-col gap-1 rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700">
          <p className="font-semibold text-neutral-900">※ 홈 노출 규칙 안내</p>
          <p>
            • <b>배너 하단</b> : 홈에 <b>한 개만</b> 보입니다. 여러 개를 노출로
            두면 가장 나중에 등록한 것 하나만 나오고 나머지는 화면에 나타나지
            않습니다.
          </p>
          <p>
            • <b>후기 하단 · 블로그 하단</b> : 각각 <b>최대 네 개</b>까지
            보입니다. 다섯 개 이상을 노출로 두면 나중에 등록한 순으로 네 개만
            나옵니다.
          </p>
          <p>
            • <b>노출 기간</b> : 시작일 전이나 종료일 후에는 노출여부가 켜져
            있어도 홈에 나오지 않습니다. 기간이 지나면 자동으로 빠지므로, 영역별
            개수를 맞추려면 기간을 겹치지 않게 잡는 편이 안전합니다.
          </p>
          <p>
            • <b>큐레이션 리스트가 비어 있으면</b> 그 큐레이션은 노출여부와
            무관하게 홈에 나오지 않습니다.
          </p>
          <p className="mt-1 text-neutral-500">
            ※ 개수가 넘칠 때 밀려나는 기준은 노출 기간이나 우선순위가 아니라{' '}
            <b>등록 순서(최신 순)</b>입니다. 어드민 목록에는 밀려난 큐레이션도
            그대로 <b>노출 중</b>으로 표시되므로, 같은 영역에 노출 기간이 겹치는
            큐레이션이 여러 개라면 실제 홈 화면을 함께 확인해 주세요. 이 동작을
            바꾸려면 서버·웹 수정이 필요합니다.
          </p>
        </div>
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
                autoHeight
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
