import { useGetRetrospectiveRoundsQuery } from '@/api/all-in-one-pass/useRetrospectives';
import EmptyContainer from '@/common/container/EmptyContainer';
import LoadingContainer from '@/common/loading/LoadingContainer';
import { RetrospectiveRound } from '@/domain/all-in-one-pass/types';
import { Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  passId: number;
}

/** A-4 회차 목록 (자동 생성) + 주차별 질문 인라인 수정 + 저장 */
export default function RoundListSection({ passId }: Props) {
  const navigate = useNavigate();
  const {
    data: rounds = [],
    isLoading,
    error,
  } = useGetRetrospectiveRoundsQuery(passId);

  // 편집값을 로컬로 들고, 하단 [저장하기]로 한 번에 저장한다.
  const [rows, setRows] = useState<RetrospectiveRound[]>([]);
  useEffect(() => {
    setRows(rounds);
  }, [rounds]);

  const processRowUpdate = (updated: RetrospectiveRound) => {
    setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    return updated;
  };

  const handleSave = () => {
    // TODO: API 연결 후 주차별 질문 저장(PATCH) 뮤테이션 연결
    // eslint-disable-next-line no-console
    console.log(
      '[회고 회차 질문 저장]',
      passId,
      rows.map((r) => ({ id: r.id, weeklyQuestion: r.weeklyQuestion })),
    );
  };

  // 패스 마지막 날이 포함된 회차 = "마무리 회고"
  const finalRound = rows.length ? Math.max(...rows.map((r) => r.round)) : null;

  const columns: GridColDef<RetrospectiveRound>[] = [
    {
      field: 'round',
      headerName: '회차',
      width: 110,
      valueGetter: (_, row) =>
        row.round === finalRound ? '마무리 회고' : `${row.round}회차`,
    },
    {
      field: 'visibleAt',
      headerName: '노출 시점',
      width: 160,
      sortable: false,
      filterable: false,
      // 회차 번호로 파생(회차 N = 패스 시작 +2N주). 마무리 회고는 종료 시점.
      valueGetter: (_, row) =>
        row.round === finalRound
          ? '패스 종료 시점'
          : `패스 시작일 + ${row.round * 2}주`,
    },
    {
      field: 'weeklyQuestion',
      headerName: '주차별 질문',
      flex: 1,
      minWidth: 320,
      sortable: false,
      filterable: false,
      editable: true, // 더블클릭하여 수정
      renderCell: ({ value }) => (
        <div className="flex h-full w-full min-w-0 items-center gap-2 pr-1">
          <span className="min-w-0 flex-1 truncate">
            {value || '(질문 없음)'}
          </span>
          <Pencil size={14} className="text-neutral-40 shrink-0" />
        </div>
      ),
    },
    {
      field: 'responseCount',
      headerName: '응답 수',
      type: 'number',
      width: 140,
      align: 'left',
      headerAlign: 'left',
    },
    {
      field: 'responseView',
      headerName: '응답 조회',
      width: 140,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <div className="flex h-full items-center">
          <Button
            variant="outlined"
            color="info"
            size="small"
            onClick={() =>
              navigate(
                `/all-in-one-pass/retrospectives/${row.id}/responses?passId=${passId}`,
              )
            }
          >
            응답 조회
          </Button>
        </div>
      ),
    },
  ];

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="text-small20 text-neutral-0 font-semibold">회차 목록</h2>
        <p className="text-xsmall14 text-neutral-40">
          회차 수는 패스 기간에 따라 자동 생성됩니다. 주차별 질문 더블클릭 시
          수정 가능합니다.
        </p>
      </div>

      {isLoading ? (
        <LoadingContainer />
      ) : error ? (
        <div className="py-4 text-center">에러 발생</div>
      ) : rows.length === 0 ? (
        <EmptyContainer text="회차가 없습니다. (패스 기간을 확인해주세요)" />
      ) : (
        <>
          <DataGrid
            autoHeight
            hideFooter
            rows={rows}
            columns={columns}
            processRowUpdate={processRowUpdate}
            disableColumnMenu
          />
          <div className="flex justify-end">
            <Button variant="contained" onClick={handleSave}>
              저장하기
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
