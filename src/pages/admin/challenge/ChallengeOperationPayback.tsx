import { Button, Snackbar, Switch } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  ToolbarPropsOverrides,
  useGridApiContext,
} from '@mui/x-data-grid';
import { useMutation, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import {
  accountType,
  getChallengeIdApplicationsPayback,
  UpdatePaybackReq,
} from '../../../schema';
import axios from '../../../utils/axios';

type Payback = z.infer<
  typeof getChallengeIdApplicationsPayback
>['missionApplications'][number];

type Row = Payback & { th99?: string };

const bankTextMap: Record<z.infer<typeof accountType>, string> = {
  KB: 'KB국민',
  HANA: '하나',
  WOORI: '우리',
  SHINHAN: '신한',
  NH: 'NH농협',
  SH: 'SH수협',
  IBK: 'IBK기업',
  MG: '새마을금고',
  KAKAO: '카카오뱅크',
  TOSS: '토스뱅크',
};

function createColumns(ths: number[]): GridColDef<Row>[] {
  return [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: '이름', width: 100 },
    { field: 'email', headerName: '이메일', width: 200 },
    { field: 'phoneNum', headerName: '전화번호', width: 150 },
    {
      field: 'account',
      headerName: '환급계좌번호',
      width: 150,
      valueFormatter(_, row) {
        return row.accountType
          ? `${bankTextMap[row.accountType]} ${row.accountNum}`
          : '';
      },
    },
    ...ths
      .filter((th) => th !== 99)
      .map((th): GridColDef<Row> => {
        return {
          field: `th${th}`,
          headerName: `${th}회차`,
          valueGetter(_, row) {
            const score = row.scores.find((s) => s.th === th);
            return score?.score ?? '0';
          },
          sortable: false,
          filterable: false,
          editable: false,
          cellClassName: (params) => 'p-0',
          width: 50,
        };
      }),
    {
      field: 'th99',
      headerName: '운영진',
      width: 50,
      editable: true,
      cellClassName: 'p-0',
      valueGetter(_, row) {
        const score = row.scores.find((s) => s.th === 99);
        return score?.score ?? '0';
      },
    },
    { field: 'total', headerName: '총점', width: 50 },
    {
      field: 'isRefunded',
      headerName: '환급여부',
      width: 150,
      editable: true,
      renderCell({ value }) {
        return <Switch checked={value} disabled />;
      },
      cellClassName: 'p-0',
      renderEditCell(params) {
        return (
          <div className="flex h-full w-full items-center justify-start px-2">
            <Switch
              checked={params.value}
              onChange={(e) => {
                params.api.setEditCellValue({
                  id: params.id,
                  field: params.field,
                  value: e.target.checked,
                });
              }}
            />
          </div>
        );
      },
    },
  ];
}

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    onMakeRefundedClick?: (selected: Map<number, Row>) => void;
  }
}

function Toolbar({ onMakeRefundedClick }: ToolbarPropsOverrides) {
  const api = useGridApiContext();
  const hasSelected = api.current.getSelectedRows().size !== 0;

  return (
    <div>
      <p>운영진 점수와 환급여부 수정 가능합니다. 수정하려면 더블클릭 하세요</p>
      <GridToolbarContainer>
        <Button
          onClick={() => {
            api.current.exportDataAsCsv({
              fileName: `페이백_${dayjs().format('YYYY-MM-DD')}`,
              getRowsToExport(params) {
                return params.apiRef.current
                  .getAllRowIds()
                  .map((id) => ({
                    id,
                    total: params.apiRef.current.getCellValue(id, 'total'),
                  }))
                  .filter((row) => row.total >= 80)
                  .sort((a, b) => b.total - a.total)
                  .map((row) => row.id);
              },
            });
          }}
          variant="outlined"
        >
          80점 이상 데이터 추출
        </Button>
        <Button
          onClick={() => {
            onMakeRefundedClick?.(
              api.current.getSelectedRows() as Map<number, Row>,
            );
          }}
          disabled={!hasSelected}
          variant="outlined"
        >
          환급 완료로 변경
        </Button>
        <Button
          onClick={() => {
            api.current.sortColumn('total', 'desc');
          }}
          variant="outlined"
        >
          점수 정렬
        </Button>
        <Button
          onClick={() => {
            api.current.sortColumn('name', 'asc');
          }}
          variant="outlined"
        >
          이름 정렬
        </Button>
      </GridToolbarContainer>
    </div>
  );
}

const ChallengeOperationPayback = () => {
  const params = useParams();
  const challengeId = params.programId;

  const { data: paybackRes, refetch } = useQuery({
    queryKey: ['admin', 'challenge', challengeId, 'participants'],
    enabled: Boolean(challengeId),
    queryFn: async () => {
      const res = await axios.get(
        `/challenge/${challengeId}/applications/payback`,
      );
      return getChallengeIdApplicationsPayback.parse(res.data.data);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (req: UpdatePaybackReq & { id: number }) => {
      const { id, ...payload } = req;
      const res = await axios.patch(
        `/challenge/${challengeId}/application/${id}/payback`,
        payload,
      );
      if (res.status !== 200) {
        console.warn(res);
      }
    },
    onError: console.error,
  });

  const ths = useMemo(() => {
    const ths = new Set<number>();
    paybackRes?.missionApplications?.forEach((application) => {
      application.scores.forEach((score) => {
        if (typeof score.th !== 'number') {
          return;
        }
        ths.add(score.th);
      });
    });
    return Array.from(ths).sort();
  }, [paybackRes?.missionApplications]);

  const columns = useMemo(() => {
    return createColumns(ths);
  }, [ths]);

  const rows = useMemo((): Row[] => {
    return (
      paybackRes?.missionApplications?.map((application) => {
        const total = application.scores.reduce(
          (acc, score) => acc + score.score,
          0,
        );
        return {
          ...application,
          total,
        };
      }) || []
    );
  }, [paybackRes?.missionApplications]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
  });

  return (
    <main className="pt-3">
      <DataGrid
        rows={rows}
        columns={columns}
        slots={{ toolbar: Toolbar }}
        slotProps={{
          toolbar: {
            async onMakeRefundedClick(selected) {
              const selectedArray = [...selected.entries()];
              const res = await Promise.allSettled(
                selectedArray.map(([id, row]) => {
                  return updateMutation.mutateAsync({ id, isRefunded: true });
                }),
              );

              const success: string[] = [];
              const failed: string[] = [];

              res.forEach((r, i) => {
                if (r.status === 'rejected') {
                  console.error(r.reason);
                  failed.push(selectedArray[i][1].name || '');
                } else {
                  success.push(selectedArray[i][1].name || '');
                }
              });

              setSnackbar({
                open: true,
                message: `${
                  success.length !== 0
                    ? `환급 완료: ${success.join(', ')}${
                        failed.length !== 0 ? ', ' : ''
                      }`
                    : ''
                }${failed.length !== 0 ? `실패: ${failed.join(', ')}` : ''}`,
              });

              refetch();
            },
          },
        }}
        checkboxSelection
        disableRowSelectionOnClick
        autoHeight
        hideFooter
        processRowUpdate={async (updatedRow, originalRow) => {
          const payload: UpdatePaybackReq = {};

          if (
            updatedRow.isRefunded !== originalRow.isRefunded &&
            typeof updatedRow.isRefunded === 'boolean'
          ) {
            payload.isRefunded = updatedRow.isRefunded;
          }

          if (updatedRow.th99) {
            payload.adminScore = Number(updatedRow.th99);
          }

          if (Object.keys(payload).length === 0) {
            return updatedRow;
          }

          await updateMutation.mutateAsync({ ...payload, id: updatedRow.id });
          setSnackbar({
            open: true,
            message: '점수 정보가 업데이트 되었습니다.',
          });
          refetch();

          return updatedRow;
        }}
        onProcessRowUpdateError={console.error}
      />
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </main>
  );
};

export default ChallengeOperationPayback;
