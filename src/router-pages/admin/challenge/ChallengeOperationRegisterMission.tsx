import {
  useAdminCurrentChallenge,
  useAdminMissionsOfCurrentChallenge,
  useMissionsOfCurrentChallengeRefetch,
} from '@/context/CurrentAdminChallengeProvider';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import dayjs from '@/lib/dayjs';
import {
  CreateMissionReq,
  getContentsAdminSimple,
  Mission,
  missionTemplateAdmin,
  MissionTemplateResItem,
  UpdateMissionReq,
} from '@/schema';
import axios from '@/utils/axios';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridEditCellValueParams,
  GridToolbarContainer,
  useGridApiRef,
} from '@mui/x-data-grid';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useCallback, useMemo, useState } from 'react';
import { FaCheck, FaTrashCan, FaX } from 'react-icons/fa6';
import { z } from 'zod';

type Content = z.infer<
  typeof getContentsAdminSimple
>['contentsSimpleList'][number];

type Row = Mission & {
  mode: 'normal' | 'create';
  additionalContentsOptions: Content[]; // List from API
  essentialContentsOptions: Content[]; // List from API
  missionTemplatesOptions: MissionTemplateResItem[];
  onAction(params: {
    action: 'create' | 'cancel' | 'edit' | 'delete';
    row: Row;
  }): void;
};

declare module '@mui/x-data-grid' {
  export interface ToolbarPropsOverrides {
    onRegisterButtonClick?: () => void;
  }
}

function ChallengeOperationRegisterMissionToolbar({
  onRegisterButtonClick,
}: {
  onRegisterButtonClick?: () => void;
}) {
  return (
    <GridToolbarContainer
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '8px',
      }}
    >
      <Button variant="outlined" onClick={onRegisterButtonClick}>
        등록
      </Button>
    </GridToolbarContainer>
  );
}

const ChallengeOperationRegisterMission = () => {
  const missions = useAdminMissionsOfCurrentChallenge();
  const { currentChallenge } = useAdminCurrentChallenge();
  const refetchMissions = useMissionsOfCurrentChallengeRefetch();
  const { snackbar: setSnackbar } = useAdminSnackbar();

  const [editingMission, setEditingMission] = useState<Mission | null>(null);
  const [additionalContentsList, setAdditionalContentsList] = useState();

  const columns: GridColDef<Row>[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      editable: false,
    },
    {
      field: 'tag',
      headerName: '태그',
      valueGetter(_, row) {
        return (
          row.missionTemplatesOptions.find(
            (t) => t.id === row.missionTemplateId,
          )?.missionTag ?? ''
        );
      },
    },
    {
      field: 'missionTemplateId',
      headerName: '미션명',
      editable: true,
      width: 140,
      valueFormatter(_, row) {
        return `${row.missionTemplateId ? `(${row.missionTemplateId}) ` : ''}${
          row.missionTemplatesOptions.find(
            (t) => t.id === row.missionTemplateId,
          )?.title || ''
        }`;
      },
      renderCell(params) {
        return (
          params.formattedValue || (
            <span className="text-gray-400">더블클릭하여 편집</span>
          )
        );
      },
      renderEditCell(params) {
        return (
          <select
            className="w-full"
            value={params.row.missionTemplateId ?? ''}
            onChange={(e) => {
              params.api.setEditCellValue({
                id: params.id,
                field: 'missionTemplateId',
                value: e.target.value ? Number(e.target.value) : null,
              });
            }}
          >
            <option value="">선택</option>
            {params.row.missionTemplatesOptions.map((t) => (
              <option key={t.id} value={t.id}>
                ({t.id}) {t.title}
              </option>
            ))}
          </select>
        );
      },
    },
    {
      field: 'th',
      headerName: '회차',
      editable: true,
      width: 70,
      type: 'number',
    },
    {
      field: 'startDate',
      headerName: '공개일',
      width: 200,
      editable: true,
      valueFormatter(_, row) {
        return row.startDate.format('YYYY-MM-DD HH:mm');
      },
      renderEditCell(params) {
        return (
          <input
            type="datetime-local"
            className="w-full"
            value={params.row.startDate.format('YYYY-MM-DDTHH:mm')}
            onChange={(e) => {
              params.api.setEditCellValue({
                id: params.id,
                field: 'startDate',
                value: dayjs(e.target.value),
              });
            }}
          />
        );
      },
    },
    {
      field: 'endDate',
      headerName: '마감일',
      width: 200,
      editable: true,
      valueFormatter(_, row) {
        return row.endDate.format('YYYY-MM-DD HH:mm');
      },
      renderEditCell(params) {
        return (
          <input
            type="datetime-local"
            className="w-full"
            value={params.row.endDate.format('YYYY-MM-DDTHH:mm')}
            onChange={(e) => {
              params.api.setEditCellValue({
                id: params.id,
                field: 'endDate',
                value: dayjs(e.target.value),
              });
            }}
          />
        );
      },
    },
    {
      field: 'score',
      headerName: '미션점수',
      editable: true,
      type: 'number',
      width: 70,
    },
    {
      field: 'lateScore',
      headerName: '지각점수',
      editable: true,
      type: 'number',
      width: 70,
    },
    {
      field: 'essentialContentsList',
      headerName: '필수 콘텐츠',
      width: 160,
      editable: true,
      valueFormatter(_, row) {
        return `${
          row.essentialContentsList?.[0]?.id
            ? `(${row.essentialContentsList?.[0]?.id}) `
            : ''
        }${row.essentialContentsList?.map((c) => c?.title)?.join(', ') || ''}`;
      },
      renderCell(params) {
        return (
          params.formattedValue || (
            <span className="text-gray-400">더블클릭하여 편집</span>
          )
        );
      },
      renderEditCell(params) {
        return (
          <select
            className="w-full"
            value={params.row.essentialContentsList?.[0]?.id ?? ''}
            onChange={(e) => {
              const content = params.row.essentialContentsOptions.find(
                (c) => String(c.id) === e.target.value,
              );
              params.api.setEditCellValue({
                id: params.id,
                field: 'essentialContentsList',
                value: content ? [content] : [],
              });
            }}
          >
            <option value="">선택</option>
            {params.row.essentialContentsOptions.map((c) => (
              <option key={c.id} value={c.id ?? ''}>
                ({c.id}) {c.title}
              </option>
            ))}
          </select>
        );
      },
    },
    {
      field: 'additionalContentsList',
      headerName: '추가 콘텐츠',
      width: 400,
      editable: true,
      valueFormatter(_, row) {
        return row.additionalContentsList
          ?.map((item) => `(${item?.id}) ${item?.title}`)
          .join(', ');
      },
      renderCell(params) {
        return (
          params.formattedValue ?? (
            <span className="text-gray-400">더블클릭하여 편집</span>
          )
        );
      },
      renderEditCell(params) {
        return (
          <FormControl fullWidth>
            <InputLabel id="additionalContentsList-label">
              추가 콘텐츠
            </InputLabel>
            <Select
              labelId="additionalContentsList-label"
              multiple
              className="w-full"
              // 콘텐츠1, 콘텐츠2 문자열로 표시
              value={params.row.additionalContentsList?.map((item) => item?.id)}
              renderValue={() =>
                params.row.additionalContentsList
                  ?.map((item) => item?.id)
                  .join(', ')
              }
              onChange={(e) => {
                const newList: GridEditCellValueParams['value'] = [];

                // additionalContentsOptions에서 선택한 id를 찾아 배열에 추가
                (e.target.value as Array<number>).forEach((v) => {
                  const newItem = params.row.additionalContentsOptions.find(
                    (item) => item.id === v,
                  );
                  newList.push(newItem);
                });

                params.api.setEditCellValue({
                  id: params.id,
                  field: 'additionalContentsList',
                  value: newList,
                });
              }}
            >
              {params.row.additionalContentsOptions.map((c) => (
                <MenuItem key={c.id} value={c.id ?? ''}>
                  <Checkbox
                    checked={
                      params.row.additionalContentsList?.findIndex(
                        (item) => item?.id === c.id,
                      ) !== -1
                    }
                  />
                  ({c.id}) {c.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      },
    },
    {
      field: 'actions',
      editable: true,
      headerName: '',
      cellClassName: 'flex items-center justify-center',
      renderEditCell(params) {
        if (params.row.mode === 'normal') {
          return (
            <div className="flex items-center justify-center gap-2 px-2">
              <button
                className="px-2 py-2 text-primary"
                onClick={() => {
                  params.row.onAction({ action: 'edit', row: params.row });
                }}
              >
                <FaCheck />
              </button>
              <button
                className="px-2 py-2"
                onClick={() => {
                  params.row.onAction({ action: 'cancel', row: params.row });
                }}
              >
                <FaX />
              </button>
            </div>
          );
        }

        return (
          <div className="flex items-center justify-center gap-2 px-2">
            <button
              className="px-2 py-2 text-primary"
              onClick={() => {
                params.row.onAction({ action: 'create', row: params.row });
              }}
            >
              <FaCheck />
            </button>
            <button
              className="px-2 py-2"
              onClick={() => {
                params.row.onAction({ action: 'cancel', row: params.row });
              }}
            >
              <FaX />
            </button>
          </div>
        );
      },
      renderCell(params) {
        if (params.row.mode === 'normal') {
          return (
            <RemoveAlertDialog
              onAction={params.row.onAction}
              row={params.row}
            />
          );
        }

        return (
          <div className="flex items-center justify-center gap-2 px-2">
            <button
              className="px-2 py-2 text-primary"
              onClick={() => {
                params.row.onAction({ action: 'create', row: params.row });
              }}
            >
              <FaCheck />
            </button>
            <button
              className="px-2 py-2"
              onClick={() => {
                params.row.onAction({ action: 'cancel', row: params.row });
              }}
            >
              <FaX />
            </button>
          </div>
        );
      },
    },
  ];

  const createMissionMutation = useMutation({
    mutationFn: async (mission: CreateMissionReq) => {
      return axios.post(`/mission/${currentChallenge?.id}`, mission);
    },
    onError(error) {
      setSnackbar('미션 생성에 실패했습니다. ' + error);
    },
  });

  const apiRef = useGridApiRef();

  const updateMission = useMutation({
    mutationFn: async (mission: UpdateMissionReq & { id: number }) => {
      const { id, ...payload } = mission;
      return axios.patch(`/mission/${id}`, payload);
    },
    onError(error) {
      setSnackbar('미션 수정에 실패했습니다. ' + error);
    },
  });

  const deleteMission = useMutation({
    mutationFn: async (id: number) => {
      return axios.delete(`/mission/${id}`);
    },
    onError(error) {
      setSnackbar('미션 삭제에 실패했습니다. ' + error);
    },
  });

  const { data: missionTemplates } = useQuery({
    queryKey: ['admin', 'challenge', 'missionTemplates'],
    enabled: Boolean(currentChallenge),
    queryFn: async (): Promise<MissionTemplateResItem[]> => {
      const res = await axios.get(`/mission-template/admin`);
      return missionTemplateAdmin.parse(res.data.data).missionTemplateAdminList;
    },
  });

  const { data: additionalContents = [] } = useQuery({
    queryKey: [
      'admin',
      'challenge',
      currentChallenge?.id,
      'missions',
      'contents',
      'additional',
    ],
    queryFn: async (): Promise<Content[]> => {
      if (!currentChallenge) {
        return [];
      }
      const res = await axios.get(`/contents/admin/simple?type=ADDITIONAL`);
      return getContentsAdminSimple.parse(res.data.data).contentsSimpleList;
    },
  });

  const { data: essentialContents = [] } = useQuery({
    queryKey: [
      'admin',
      'challenge',
      currentChallenge?.id,
      'missions',
      'contents',
      'essential',
    ],
    queryFn: async (): Promise<Content[]> => {
      if (!currentChallenge) {
        return [];
      }
      const res = await axios.get(`/contents/admin/simple?type=ESSENTIAL`);
      return getContentsAdminSimple.parse(res.data.data).contentsSimpleList;
    },
  });

  // TODO: [나중에...] 최선은 아님... column 자체에 action을 넣는게 좋을듯.
  const onAction = useCallback(
    async ({
      action,
      row,
    }: {
      action: 'create' | 'edit' | 'delete' | 'cancel';
      row: Row;
    }) => {
      switch (action) {
        case 'create':
          await createMissionMutation.mutateAsync({
            additionalContentsIdList:
              row.additionalContentsList
                ?.map((c) => c?.id)
                .filter((id): id is number => Boolean(id)) || [],
            essentialContentsIdList:
              row.essentialContentsList
                ?.map((c) => c?.id)
                .filter((id): id is number => Boolean(id)) || [],
            lateScore: row.lateScore,
            missionTemplateId: row.missionTemplateId,
            score: row.score,
            startDate: row.startDate.tz().format('YYYY-MM-DDTHH:mm:ss'),
            endDate: row.endDate.tz().format('YYYY-MM-DDTHH:mm:ss'),
            th: row.th,
            title:
              row.missionTemplatesOptions.find(
                (t) => t.id === row.missionTemplateId,
              )?.title ?? '',
          });
          if (apiRef.current?.getRowMode(row.id) === 'edit') {
            apiRef.current?.stopRowEditMode({
              id: row.id,
            });
          }
          setSnackbar('미션을 생성했습니다.');
          setEditingMission(null);
          refetchMissions();
          apiRef.current?.forceUpdate();
          return;

        case 'edit':
          if (!row.missionTemplateId) {
            return;
          }
          await updateMission.mutateAsync({
            additionalContentsIdList:
              row.additionalContentsList
                ?.map((c) => c?.id)
                .filter((id): id is number => Boolean(id)) || [],
            essentialContentsIdList:
              row.essentialContentsList
                ?.map((c) => c?.id)
                .filter((id): id is number => Boolean(id)) || [],
            id: row.id,
            lateScore: row.lateScore,
            missionTemplateId: row.missionTemplateId,
            score: row.score,
            startDate: row.startDate.tz().format('YYYY-MM-DDTHH:mm:ss'),
            endDate: row.endDate.tz().format('YYYY-MM-DDTHH:mm:ss'),
            th: row.th,
            title:
              row.missionTemplatesOptions.find(
                (t) => t.id === row.missionTemplateId,
              )?.title ?? '',
          });
          if (apiRef.current?.getRowMode(row.id) === 'edit') {
            apiRef.current?.stopRowEditMode({
              id: row.id,
            });
          }
          setSnackbar('미션을 수정했습니다.');
          setEditingMission(null);
          refetchMissions();
          apiRef.current?.forceUpdate();
          return;

        case 'delete':
          await deleteMission.mutateAsync(row.id);
          setSnackbar('미션을 삭제했습니다.');
          refetchMissions();
          apiRef.current?.forceUpdate();
          return;

        case 'cancel':
          if (apiRef.current?.getRowMode(row.id) === 'edit') {
            apiRef.current?.stopRowEditMode({
              id: row.id,
            });
          }
          refetchMissions();
          apiRef.current?.forceUpdate();
          setEditingMission(null);
          return;
      }
    },
    [
      apiRef,
      createMissionMutation,
      deleteMission,
      refetchMissions,
      setSnackbar,
      updateMission,
    ],
  );

  const rows = useMemo((): Row[] => {
    const result: Row[] = (missions || []).map((m) => ({
      ...m,
      mode: 'normal',
      additionalContentsOptions: additionalContents,
      essentialContentsOptions: essentialContents,
      missionTemplatesOptions: missionTemplates ?? [],
      onAction,
    }));

    if (editingMission) {
      result.push({
        ...editingMission,
        mode: 'create',
        additionalContentsOptions: additionalContents,
        essentialContentsOptions: essentialContents,
        missionTemplatesOptions: missionTemplates ?? [],
        onAction,
      });
    }

    return result;
  }, [
    missions,
    editingMission,
    additionalContents,
    essentialContents,
    missionTemplates,
    onAction,
  ]);

  return (
    <main>
      <DataGrid
        apiRef={apiRef}
        editMode="row"
        initialState={{
          sorting: { sortModel: [{ field: 'id', sort: 'desc' }] },
        }}
        slots={{
          toolbar: ChallengeOperationRegisterMissionToolbar,
        }}
        slotProps={{
          toolbar: {
            onRegisterButtonClick: () => {
              setEditingMission({
                attendanceCount: 0,
                endDate: dayjs(),
                startDate: dayjs(),
                id: 99,
                lateScore: 5,
                score: 10,
                th: 1,
                missionTemplateId: null,
                missionStatusType: 'WAITING',
                lateAttendanceCount: 0,
                applicationCount: 0,
                additionalContentsList: [],
                essentialContentsList: [],
                missionType: '',
              });
            },
          },
        }}
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        rowHeight={48}
        autoHeight
        getDetailPanelContent={() => 'hello!'}
        hideFooter
        processRowUpdate={(updatedRow, originalRow) => {
          return originalRow;
        }}
      />
    </main>
  );
};

function RemoveAlertDialog({
  onAction,
  row,
}: {
  onAction: (params: {
    action: 'create' | 'cancel' | 'edit' | 'delete';
    row: Row;
  }) => void;
  row: Row;
}) {
  const [removeDialog, setRemoveDialog] = useState({
    open: false,
    id: 0,
  });

  return (
    <React.Fragment>
      <IconButton
        sx={{
          width: 30,
          height: 30,
        }}
        onClick={() => {
          setRemoveDialog({ open: true, id: row.id });
        }}
        color="error"
      >
        <FaTrashCan />
      </IconButton>
      <Dialog
        open={removeDialog.open}
        onClose={() => setRemoveDialog({ open: false, id: 0 })}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">미션 삭제</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            정말로 삭제하시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setRemoveDialog({ open: false, id: 0 });
            }}
          >
            취소
          </Button>
          <Button
            onClick={async () => {
              onAction({ action: 'delete', row });
              setRemoveDialog({ open: false, id: 0 });
            }}
            autoFocus
            // variant='contained'
            color="error"
          >
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default ChallengeOperationRegisterMission;
