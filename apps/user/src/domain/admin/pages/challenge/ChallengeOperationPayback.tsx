'use client';

import { usePatchChallengePayback } from '@/api/challenge/challenge';
import { useAdminChallengeTitle } from '@/context/CurrentAdminChallengeProvider';
import dayjs from '@/lib/dayjs';
import { getChallengeIdApplicationsPayback, UpdatePaybackReq } from '@/schema';
import axios from '@/utils/axios';
import { Button, Modal, Snackbar, Switch } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  ToolbarPropsOverrides,
  useGridApiContext,
} from '@mui/x-data-grid';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { z } from 'zod';

type Payback = z.infer<
  typeof getChallengeIdApplicationsPayback
>['missionApplications'][number];

type Row = Payback & { th99?: string };

function createColumns(ths: number[]): GridColDef<Row>[] {
  return [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: '이름', width: 100 },
    { field: 'email', headerName: '이메일', width: 200 },
    { field: 'phoneNum', headerName: '전화번호', width: 150 },
    {
      field: 'couponName',
      headerName: '쿠폰',
      width: 150,
      valueGetter(_, row) {
        if (row.couponName === null) {
          return '-';
        } else {
          return row.couponName;
        }
      },
    },
    {
      field: 'finalPrice',
      headerName: '결제금액',
      width: 100,
      valueGetter(_, row) {
        if (row.finalPrice === null) {
          return '-';
        } else {
          return row.finalPrice.toLocaleString();
        }
      },
    },
    {
      field: 'paybackPrice',
      headerName: '페이백금액',
      width: 100,
      valueGetter(_, row) {
        if (row.paybackPrice === null) {
          return '-';
        } else {
          return row.paybackPrice.toLocaleString();
        }
      },
    },
    {
      field: 'totalPrice',
      headerName: '최종 결제금액',
      width: 100,
      valueGetter(_, row) {
        if (row.finalPrice === null) {
          return '-';
        } else if (row.paybackPrice === null) {
          return row.finalPrice.toLocaleString();
        } else {
          return (row.finalPrice - row.paybackPrice).toLocaleString();
        }
      },
    },
    ...ths
      .filter((th) => th !== 99 && th !== 999)
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
          cellClassName: () => 'p-0',
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
        const score = row.scores.find((s) => s.th === 999);
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
                if (!e.target.checked) {
                  // 이미 상태가 true인 경우 변경 불가
                  alert('이미 환급 완료된 사용자입니다.');
                  return;
                } else {
                  // 알러트 후 변경
                  if (window.confirm('환급 완료로 변경하시겠습니까?')) {
                    params.api.setEditCellValue({
                      id: params.id,
                      field: params.field,
                      value: e.target.checked,
                    });
                  }
                }
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
    handleOpenPaybackModal: () => void;
  }
}

function Toolbar({
  onMakeRefundedClick,
  handleOpenPaybackModal,
}: ToolbarPropsOverrides) {
  const api = useGridApiContext();
  const hasSelected = api.current?.getSelectedRows().size !== 0;

  return (
    <div>
      <p>운영진 점수와 환급여부 수정 가능합니다. 수정하려면 더블클릭 하세요</p>
      <GridToolbarContainer>
        <Button variant="outlined" onClick={handleOpenPaybackModal}>
          페이백
        </Button>
        <Button
          onClick={() => {
            api.current?.exportDataAsCsv({
              fileName: `페이백_${dayjs().format('YYYY-MM-DD')}`,
              getRowsToExport(params) {
                return (
                  params.apiRef.current
                    ?.getAllRowIds()
                    .map((id) => ({
                      id,
                      total: params.apiRef.current?.getCellValue(id, 'total'),
                    }))
                    .filter((row) => row.total >= 80)
                    .sort((a, b) => b.total - a.total)
                    .map((row) => row.id) || []
                );
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
              api.current?.getSelectedRows() as Map<number, Row>,
            );
          }}
          disabled={!hasSelected}
          variant="outlined"
        >
          환급 완료로 변경
        </Button>
        <Button
          onClick={() => {
            api.current?.sortColumn('total', 'desc');
          }}
          variant="outlined"
        >
          점수 정렬
        </Button>
        <Button
          onClick={() => {
            api.current?.sortColumn('name', 'asc');
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
  const params = useParams<{ programId: string }>();
  const challengeId = params.programId;
  const challengeTitle = useAdminChallengeTitle();
  const [isPaybackModalOpen, setIsPaybackModalOpen] = useState(false);
  const [paybackConfirm, setPaybackConfirm] = useState(false);
  const [isPaybackLoading, setIsPaybackLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [paybackInfo, sestPaybackInfo] = useState<{
    price: number | null;
    reason: string;
  }>({
    price: null,
    reason: '',
  });

  const { data: paybackRes, refetch } = useQuery({
    queryKey: ['admin', 'challenge', challengeId, 'participants'],
    enabled: Boolean(challengeId),
    queryFn: async () => {
      const res = await axios.get(
        `/challenge/${challengeId}/applications/payback`,
        { params: { page: 0, size: 1000 } },
      );
      return getChallengeIdApplicationsPayback.parse(res.data.data);
    },
  });

  const { mutate: tryTotalPayback } = usePatchChallengePayback({
    challengeId: challengeId ?? '',
    setIsPaybackFinished: () => setIsPaybackLoading(false),
    setPaybackModalClose: () => {
      setPaybackConfirm(false);
      setIsPaybackModalOpen(false);
    },
    refetchList: refetch,
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

  const handleConfirmPayback = () => {
    if (!paybackRes) return;

    // 선택된 사용자가 없을 경우 경고 메시지 표시
    if (selectedIds.length === 0) {
      alert('페이백할 사용자를 선택해주세요.');
      return;
    }

    // 선택된 사용자들 중 총점이 80점 미만인 사용자가 있는지 검사
    const hasLowScoreUser = rows.some(
      (row) =>
        selectedIds.includes(row.id) &&
        row.scores.reduce((acc, score) => acc + score.score, 0) < 80,
    );

    // 선택된 사용자들 중 이미 환급 완료된 사용자가 있는지 검사
    const hasIsRefundedUser = rows.some(
      (row) => selectedIds.includes(row.id) && row.isRefunded === true,
    );

    // 선택된 사용자들 중 결제 금액이 페이백 금액보다 적은 사용자가 있는지 검사
    const hasLowPaybackUser = rows.some(
      (row) =>
        selectedIds.includes(row.id) &&
        (row.finalPrice || 0) < (paybackInfo.price || 0),
    );

    if (hasIsRefundedUser) {
      // 이미 환급 완료된 사용자가 있을 경우 경고 메시지 표시
      alert('이미 환급 완료된 사용자가 포함되어 있습니다.');
      return;
    }

    if (hasLowScoreUser) {
      // 총점이 80점 미만인 사용자가 있을 경우 경고 메시지 표시
      alert('페이백은 총점 80점 이상의 유저를 대상으로만 가능합니다.');
      return;
    }

    if (hasLowPaybackUser) {
      // 결제 금액이 페이백 금액보다 적은 사용자가 있을 경우 경고 메시지 표시
      alert('결제 금액이 페이백 금액보다 적은 사용자가 포함되어 있습니다.');
      return;
    }

    // 페이백 정보 유효성 검사
    if (!paybackInfo.price) {
      setSnackbar({
        open: true,
        message: '페이백 금액을 입력해주세요.',
      });
      return;
    }
    if (paybackInfo.price < 0) {
      setSnackbar({
        open: true,
        message: '페이백 금액은 0보다 작을 수 없습니다.',
      });
      return;
    }
    if (paybackInfo.reason.length > 100) {
      setSnackbar({
        open: true,
        message: '취소사유는 100자 이하로 입력해주세요.',
      });
      return;
    }

    setIsPaybackModalOpen(true);
  };

  const handlePayback = () => {
    if (!paybackRes) return;

    // 선택된 사용자가 없을 경우 경고 메시지 표시
    if (selectedIds.length === 0) {
      alert('페이백할 사용자를 선택해주세요.');
      return;
    }

    // 선택된 사용자들 중 총점이 80점 미만인 사용자가 있는지 검사
    const hasLowScoreUser = rows.some(
      (row) =>
        selectedIds.includes(row.id) &&
        row.scores.reduce((acc, score) => acc + score.score, 0) < 80,
    );

    // 선택된 사용자들 중 이미 환급 완료된 사용자가 있는지 검사
    const hasIsRefundedUser = rows.some(
      (row) => selectedIds.includes(row.id) && row.isRefunded === true,
    );

    // 선택된 사용자들 중 결제 금액이 페이백 금액보다 적은 사용자가 있는지 검사
    const hasLowPaybackUser = rows.some(
      (row) =>
        selectedIds.includes(row.id) &&
        (row.finalPrice || 0) < (paybackInfo.price || 0),
    );

    if (hasIsRefundedUser) {
      // 이미 환급 완료된 사용자가 있을 경우 경고 메시지 표시
      alert('이미 환급 완료된 사용자가 포함되어 있습니다.');
      return;
    }

    if (hasLowScoreUser) {
      // 총점이 80점 미만인 사용자가 있을 경우 경고 메시지 표시
      alert('페이백은 총점 80점 이상의 유저를 대상으로만 가능합니다.');
      return;
    }

    if (hasLowPaybackUser) {
      // 결제 금액이 페이백 금액보다 적은 사용자가 있을 경우 경고 메시지 표시
      alert('결제 금액이 페이백 금액보다 적은 사용자가 포함되어 있습니다.');
      return;
    }

    // 페이백 정보 유효성 검사
    if (!paybackInfo.price) {
      setSnackbar({
        open: true,
        message: '페이백 금액을 입력해주세요.',
      });
      return;
    }
    if (paybackInfo.price < 0) {
      setSnackbar({
        open: true,
        message: '페이백 금액은 0보다 작을 수 없습니다.',
      });
      return;
    }
    if (paybackInfo.reason.length > 100) {
      setSnackbar({
        open: true,
        message: '취소사유는 100자 이하로 입력해주세요.',
      });
      return;
    }

    // 페이백 실행
    setIsPaybackLoading(true);
    tryTotalPayback({
      price: paybackInfo.price,
      reason: paybackInfo.reason === '' ? undefined : paybackInfo.reason,
      applicationIdList: selectedIds,
    });
  };

  return (
    <main className="pt-3">
      {paybackConfirm && (
        <div className="flex py-5">
          <div className="flex min-w-[500px] flex-col gap-y-4 rounded-sm bg-neutral-80 p-4">
            <div className="flex w-full items-center gap-x-4">
              <h3 className="w-28 shrink-0 text-lg font-semibold">
                페이백 금액
              </h3>
              <div className="flex flex-1 items-center gap-x-3 bg-white p-2">
                <input
                  type="number"
                  className="grow border-none outline-none focus:outline-none"
                  onWheel={(e) => e.currentTarget.blur()}
                  onChange={(e) =>
                    sestPaybackInfo({
                      ...paybackInfo,
                      price: Number(e.target.value),
                    })
                  }
                  value={paybackInfo?.price || ''}
                />
                <p>원</p>
              </div>
            </div>
            <div className="flex w-full items-center gap-x-4">
              <h3 className="w-28 shrink-0 text-lg font-semibold">
                취소사유 (선택)
              </h3>
              <div className="flex flex-1 items-center gap-x-3 bg-white p-2">
                <input
                  type="text"
                  placeholder='취소사유를 입력해주세요. (ex. "참여 취소")'
                  className="grow border-none outline-none focus:outline-none"
                  onChange={(e) =>
                    sestPaybackInfo({
                      ...paybackInfo,
                      reason: e.target.value,
                    })
                  }
                  value={paybackInfo?.reason || ''}
                />
              </div>
            </div>
            <div className="mt-4 flex w-full items-center justify-end gap-x-4">
              <Button
                variant="outlined"
                onClick={() => {
                  setPaybackConfirm(false);
                }}
              >
                취소
              </Button>
              <Button variant="contained" onClick={handleConfirmPayback}>
                진행
              </Button>
            </div>
          </div>
        </div>
      )}
      <DataGrid
        rows={
          // paybackConfirm 상태일 때는 row.scores의 합이 80점 이상인 사용자만 표시
          paybackConfirm
            ? rows.filter(
                (row) =>
                  row.scores.reduce((acc, score) => acc + score.score, 0) >= 80,
              )
            : rows
        }
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
            handleOpenPaybackModal() {
              setPaybackConfirm(true);
            },
          },
        }}
        checkboxSelection
        disableRowSelectionOnClick
        autoHeight
        hideFooter
        onRowSelectionModelChange={(selected) => {
          setSelectedIds(selected as number[]);
        }}
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
      <Modal
        open={isPaybackModalOpen}
        onClose={() => {
          setIsPaybackModalOpen(false);
        }}
      >
        <div className="absolute left-1/2 top-1/2 flex w-2/5 -translate-x-1/2 -translate-y-1/2 transform flex-col gap-y-4 rounded-xxs bg-neutral-100 p-6 shadow-md">
          <>
            <h3 className="text-lg font-bold">페이백 정보 확인</h3>
            <div className="flex w-full gap-x-4">
              <h4 className="w-52 font-semibold">챌린지 명</h4>
              <p className="grow text-end">{challengeTitle}</p>
            </div>
            <div className="flex w-full gap-x-4">
              <h4 className="w-52 font-semibold">페이백 금액</h4>
              <p className="grow text-end">
                {(paybackInfo.price?.toLocaleString() || '0') + '원'}
              </p>
            </div>
            <div className="flex w-full gap-x-4">
              <h4 className="w-52 font-semibold">인원 수(페이백/전체)</h4>
              <p className="grow text-end">
                {selectedIds.length + '명/' + rows.length + '명'}
              </p>
            </div>
            <hr />
            <div className="flex w-full gap-x-4">
              <h4 className="w-52 font-semibold">전체 페이백 금액</h4>
              <p className="grow text-end">
                {(
                  selectedIds.length * (paybackInfo.price || 0)
                ).toLocaleString() + '원'}
              </p>
            </div>
            <div className="mt-4 flex w-full items-center justify-end gap-x-4">
              <Button
                variant="outlined"
                onClick={() => {
                  setIsPaybackModalOpen(false);
                }}
              >
                취소
              </Button>
              <Button variant="contained" onClick={handlePayback}>
                완료
              </Button>
            </div>
          </>
          {isPaybackLoading && (
            <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-neutral-100 bg-opacity-90">
              <div className="flex items-center gap-x-2">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary"></div>
                <p>페이백 중...</p>
              </div>
            </div>
          )}
        </div>
      </Modal>
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
