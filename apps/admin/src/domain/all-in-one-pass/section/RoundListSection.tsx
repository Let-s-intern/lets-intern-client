import {
  useGetCommonQuestionsQuery,
  useGetRetrospectiveRoundsQuery,
} from '@/api/all-in-one-pass/useRetrospectives';
import EmptyContainer from '@/common/container/EmptyContainer';
import LoadingContainer from '@/common/loading/LoadingContainer';
import { RetrospectiveRound } from '@/domain/all-in-one-pass/types';
import RetrospectiveRoundModal from '@/domain/all-in-one-pass/ui/retrospective/RetrospectiveRoundModal';
import { usePaginationModelWithSearchParams } from '@/hooks/usePaginationModelWithSearchParams';
import { Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { FaPlus, FaTrashCan } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

type RoundTarget =
  | { mode: 'create' }
  | { mode: 'edit'; round: RetrospectiveRound };

/** A-4 회차 목록 + 추가/수정 모달 + 관리 */
export default function RoundListSection() {
  const navigate = useNavigate();
  // open 과 target 을 분리한다. 닫을 때 target 을 유지해야 닫힘 애니메이션 동안
  // 제목/필드가 흔들리지 않는다.
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<RoundTarget | null>(null);

  const openCreate = () => {
    setTarget({ mode: 'create' });
    setOpen(true);
  };
  const openEdit = (round: RetrospectiveRound) => {
    setTarget({ mode: 'edit', round });
    setOpen(true);
  };

  const { data: commonQuestions = [] } = useGetCommonQuestionsQuery();
  const {
    data: rounds = [],
    isLoading,
    error,
  } = useGetRetrospectiveRoundsQuery();

  const { paginationModel, handlePaginationModelChange } =
    usePaginationModelWithSearchParams({ defaultPage: 0, defaultPageSize: 20 });

  const handleSubmit = (values: { round: number; weeklyQuestion: string }) => {
    if (target?.mode === 'edit') {
      // TODO: API 연결 후 수정(PATCH) 뮤테이션 연결
      // eslint-disable-next-line no-console
      console.log('[회차 수정]', target.round.id, values);
    } else {
      // TODO: API 연결 후 생성(POST) 뮤테이션 연결
      // eslint-disable-next-line no-console
      console.log('[회차 생성]', values);
    }
    setOpen(false);
  };

  const handleDelete = (round: RetrospectiveRound) => {
    // TODO: API 연결 후 삭제 뮤테이션 연결
    // eslint-disable-next-line no-console
    console.log('[회차 삭제]', round);
  };

  const columns: GridColDef<RetrospectiveRound>[] = [
    {
      field: 'round',
      headerName: '회차',
      width: 90,
      valueGetter: (_, row) => `${row.round}회차`,
    },
    {
      field: 'visibleAt',
      headerName: '노출 시점',
      width: 150,
      sortable: false,
      filterable: false,
      // 저장하지 않고 회차 번호로 파생 (회차 N = 패스 시작 +2N주)
      valueGetter: (_, row) => `패스 시작일 + ${row.round * 2}주`,
    },
    {
      field: 'weeklyQuestion',
      headerName: '주차별 질문',
      flex: 1,
      minWidth: 240,
      valueGetter: (_, row) => row.weeklyQuestion || '-',
    },
    {
      field: 'responseCount',
      headerName: '응답 수',
      type: 'number',
      width: 90,
      align: 'left',
      headerAlign: 'left',
    },
    {
      field: 'responseView',
      headerName: '응답 조회',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <div className="flex h-full items-center">
          <Button
            variant="outlined"
            color="info"
            size="small"
            onClick={() =>
              navigate(`/all-in-one-pass/retrospectives/${row.id}/responses`)
            }
          >
            응답 조회
          </Button>
        </div>
      ),
    },
    {
      field: 'actions',
      headerName: '관리',
      width: 200,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <div className="flex h-full items-center gap-2">
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<Pencil />}
            onClick={() => openEdit(row)}
          >
            수정
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<FaTrashCan />}
            onClick={() => handleDelete(row)}
          >
            삭제
          </Button>
        </div>
      ),
    },
  ];

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-small20 text-neutral-0 font-semibold">회차 목록</h2>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FaPlus size={12} />}
          onClick={openCreate}
        >
          회차 추가
        </Button>
      </div>

      {isLoading ? (
        <LoadingContainer />
      ) : error ? (
        <div className="py-4 text-center">에러 발생</div>
      ) : rounds.length === 0 ? (
        <EmptyContainer text="등록된 회차가 없습니다." />
      ) : (
        <DataGrid
          autoHeight
          rows={rounds}
          columns={columns}
          pagination
          pageSizeOptions={[10, 20, 50, 100]}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
        />
      )}

      <RetrospectiveRoundModal
        open={open}
        isEdit={target?.mode === 'edit'}
        initial={target?.mode === 'edit' ? target.round : null}
        commonQuestions={commonQuestions}
        onSubmit={handleSubmit}
        onClose={() => setOpen(false)}
      />
    </section>
  );
}
