import { useGetChallengeOptions } from '@/api/challengeOption';
import { useUpdateMissionOption } from '@/hooks/useUpdateMissionOption';
import dayjs from '@/lib/dayjs';
import { Row } from '@/types/interface';
import { NO_OPTION_ID } from '@/utils/constants';
import SelectFormControl from '@components/admin/program/SelectFormControl';
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
  SelectChangeEvent,
} from '@mui/material';
import {
  GridColDef,
  GridRenderCellParams,
  GridTreeNodeWithRender,
} from '@mui/x-data-grid';
import React, { useState } from 'react';
import { FaCheck, FaTrashCan, FaX } from 'react-icons/fa6';

/** 피드백 미션 여부 renderCell  */
const ChallengeOptionRenderCell = (
  params: GridRenderCellParams<Row, any, any, GridTreeNodeWithRender>,
) => {
  const { data } = useGetChallengeOptions();
  const { updateMissionOption } = useUpdateMissionOption();

  const option = data?.challengeOptionList.find(
    (item) => item.challengeOptionId === params.value,
  );

  const handleChange = async (e: SelectChangeEvent<number>) => {
    const challengeOptionId = Number(e.target.value);
    await updateMissionOption({
      missionId: params.row.id,
      challengeOptionId,
    });
  };

  return (
    <SelectFormControl<number>
      value={params.value ?? NO_OPTION_ID}
      renderValue={() => <>{option?.code ?? '없음'}</>}
      disabled={params.row.id === -1}
      onChange={handleChange}
    >
      <MenuItem value={NO_OPTION_ID}>없음</MenuItem>
      {(data?.challengeOptionList ?? []).map((item) => (
        <MenuItem
          key={`option-${item.challengeOptionId}`}
          value={item.challengeOptionId}
        >
          {item.code}
        </MenuItem>
      ))}
    </SelectFormControl>
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
        sx={{ width: 30, height: 30 }}
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
            color="error"
          >
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export const getMissionColumns = (): GridColDef<Row>[] => {
  return [
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
      renderEditCell(params) {
        return (
          <input
            type="number"
            className="w-full"
            value={params.value ?? ''}
            onChange={(e) => {
              const value =
                e.target.value === '' ? null : Number(e.target.value);

              params.api.setEditCellValue({
                id: params.id,
                field: 'th',
                value,
              });

              const TH_TO_MISSION_TYPE_MAP = {
                100: 'BONUS',
                99: 'POOL',
                0: 'OT',
              };

              if (value !== null && value in TH_TO_MISSION_TYPE_MAP) {
                params.api.setEditCellValue({
                  id: params.id,
                  field: 'missionType',
                  value:
                    TH_TO_MISSION_TYPE_MAP[
                      value as keyof typeof TH_TO_MISSION_TYPE_MAP
                    ],
                });
              } else if (
                value !== null &&
                value > 0 &&
                value !== 99 &&
                value !== 100
              ) {
                // 1~n회차(일반)로 변경 시 missionType null로 (일반 템플릿)
                params.api.setEditCellValue({
                  id: params.id,
                  field: 'missionType',
                  value: null,
                });
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' || e.key === 'Delete') {
                e.stopPropagation();
              }
            }}
          />
        );
      },
    },
    {
      field: 'missionType',
      headerName: '미션 타입',
      editable: true,
      width: 100,
      valueFormatter(_, row) {
        const typeLabels = {
          OT: 'OT',
          POOL: '인재풀',
          BONUS: '보너스',
          EXPERIENCE_1: '경험정리1',
          EXPERIENCE_2: '경험정리2',
        };
        return row.missionType ? typeLabels[row.missionType] : '기본';
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
            value={params.row.missionType ?? ''}
            onChange={(e) => {
              const value = e.target.value === '' ? null : e.target.value;
              const currentTh = params.row.th;

              params.api.setEditCellValue({
                id: params.id,
                field: 'missionType',
                value,
              });

              if (value === 'BONUS') {
                params.api.setEditCellValue({
                  id: params.id,
                  field: 'th',
                  value: 100,
                });
              } else if (value === 'POOL') {
                params.api.setEditCellValue({
                  id: params.id,
                  field: 'th',
                  value: 99,
                });
              } else if (value === 'OT') {
                params.api.setEditCellValue({
                  id: params.id,
                  field: 'th',
                  value: 0,
                });
              } else {
                // 기본 선택 시 0회차면 1회차로 변경
                if (currentTh === 0 || currentTh === 99 || currentTh === 100) {
                  params.api.setEditCellValue({
                    id: params.id,
                    field: 'th',
                    value: 1,
                  });
                }
              }
            }}
          >
            <option value="">기본</option>
            <option value="OT">OT</option>
            <option value="POOL">인재풀</option>
            <option value="BONUS">보너스</option>
            <option value="EXPERIENCE_1">경험정리1</option>
            <option value="EXPERIENCE_2">경험정리2</option>
          </select>
        );
      },
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
      width: 200,
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
              value={params.row.additionalContentsList?.map((item) => item?.id)}
              renderValue={() =>
                params.row.additionalContentsList
                  ?.map((item) => item?.id)
                  .join(', ')
              }
              onChange={(e) => {
                const newList: any[] = [];

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
      field: 'challengeOptionId',
      headerName: '피드백 미션 여부',
      width: 160,
      renderCell: ChallengeOptionRenderCell,
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
};
