import { useGetChallengeOptions } from '@/api/challenge/challengeOption';
import {
  formatMissionVersions,
  isMissionVersionLocked,
} from '@/domain/admin/challenge/version/utils/missionVersion';
import SelectFormControl from '@/domain/admin/program/ui/form/SelectFormControl';
import { useUpdateMissionOption } from '@/hooks/useUpdateMissionOption';
import dayjs from '@/lib/dayjs';
import { ChallengeVersion, Mission } from '@/schema';
import { Row } from '@/types/interface';
import {
  BONUS_MISSION_TH,
  NO_OPTION_ID,
  TALENT_POOL_MISSION_TH,
} from '@/utils/constants';
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
  GridRenderEditCellParams,
  GridTreeNodeWithRender,
} from '@mui/x-data-grid';
import React, { useState } from 'react';
import { FaCheck, FaTrashCan, FaX } from 'react-icons/fa6';

const TYPE_LABEL: Record<string, string> = {
  WRITTEN_FEEDBACK: '서면',
  LIVE_FEEDBACK: '라이브',
};

const TYPE_BADGE_CLASS: Record<string, string> = {
  WRITTEN_FEEDBACK:
    'ml-1 rounded px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700',
  LIVE_FEEDBACK: 'ml-1 rounded px-1.5 py-0.5 text-xs bg-red-100 text-red-700',
};

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
      missionType: params.row.missionType,
      challengeOptionId,
    });
  };

  return (
    <SelectFormControl<number>
      value={params.value ?? NO_OPTION_ID}
      renderValue={() => (
        <>
          {option?.code ?? '없음'}
          {option?.type && (
            <span className={TYPE_BADGE_CLASS[option.type]}>
              {TYPE_LABEL[option.type]}
            </span>
          )}
        </>
      )}
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
          {item.type && (
            <span className={TYPE_BADGE_CLASS[item.type]}>
              {TYPE_LABEL[item.type]}
            </span>
          )}
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

const TH_TO_MISSION_TYPE_MAP = {
  100: 'BONUS',
  99: 'POOL',
  0: 'OT',
} as const;

/**
 * 회차를 바꿀 때의 미션 타입. 0·99·100 은 OT·인재풀·보너스로 바꾸고,
 * 그 밖의 양수 회차는 기본(null)으로 되돌리되 경험정리 타입은 유지한다
 */
export const getMissionTypeForTh = (
  th: number | null,
  currentType: Mission['missionType'],
): Mission['missionType'] => {
  if (th === null || th < 0) return currentType;
  if (th in TH_TO_MISSION_TYPE_MAP) {
    return TH_TO_MISSION_TYPE_MAP[th as keyof typeof TH_TO_MISSION_TYPE_MAP];
  }
  if (currentType === 'EXPERIENCE_1' || currentType === 'EXPERIENCE_2') {
    return currentType;
  }
  return null;
};

/** 미션 대상 버전 편집 셀. 비우면 공통이고, 잠긴 미션(V13)은 공통으로 고정한다 */
function MissionVersionEditCell({
  params,
  versions,
}: {
  params: GridRenderEditCellParams<Row>;
  versions: ChallengeVersion[];
}) {
  if (isMissionVersionLocked(params.row)) {
    return <span className="px-2 text-gray-400">공통</span>;
  }

  const selectedIds = params.row.challengeVersionList.map(
    (version) => version.challengeVersionId,
  );

  return (
    <Select
      multiple
      displayEmpty
      fullWidth
      size="small"
      value={selectedIds}
      renderValue={() => formatMissionVersions(params.row.challengeVersionList)}
      onChange={(e) => {
        const ids = e.target.value as number[];
        params.api.setEditCellValue({
          id: params.id,
          field: 'challengeVersionList',
          value: versions
            .filter((version) => ids.includes(version.challengeVersionId))
            .map(({ challengeVersionId, title }) => ({
              challengeVersionId,
              title,
            })),
        });
      }}
    >
      {versions.map((version) => (
        <MenuItem
          key={version.challengeVersionId}
          value={version.challengeVersionId}
        >
          <Checkbox
            checked={selectedIds.includes(version.challengeVersionId)}
          />
          {version.title}
        </MenuItem>
      ))}
    </Select>
  );
}

export const getMissionColumns = (
  versions: ChallengeVersion[] = [],
): GridColDef<Row>[] => {
  // 버전 없는 챌린지는 버전 컬럼을 숨긴다
  const versionColumns: GridColDef<Row>[] =
    versions.length > 0
      ? [
          {
            field: 'challengeVersionList',
            headerName: '버전',
            width: 160,
            editable: true,
            sortable: false,
            valueFormatter(_, row) {
              return formatMissionVersions(row.challengeVersionList);
            },
            renderEditCell(params) {
              return (
                <MissionVersionEditCell params={params} versions={versions} />
              );
            },
          },
        ]
      : [];

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
        // 서버가 준 미션명(row.title)을 우선 표시해 템플릿 목록 완전성에 의존하지 않는다.
        // 신규 생성/템플릿 재선택 등 title 이 아직 없을 때만 템플릿에서 파생 폴백한다.
        const templateTitle = row.missionTemplateId
          ? row.missionTemplatesOptions.find(
              (t) => t.id === row.missionTemplateId,
            )?.title
          : undefined;
        const name = row.title || templateTitle || '';
        return `${row.missionTemplateId ? `(${row.missionTemplateId}) ` : ''}${name}`;
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
      // 같은 회차의 버전별 미션이 붙어 보이도록 회차가 같으면 id 순
      sortComparator: (th1, th2, params1, params2) =>
        th1 - th2 || Number(params1.id) - Number(params2.id),
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

              params.api.setEditCellValue({
                id: params.id,
                field: 'missionType',
                value: getMissionTypeForTh(value, params.row.missionType),
              });
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
                if (
                  currentTh === 0 ||
                  currentTh === TALENT_POOL_MISSION_TH ||
                  currentTh === BONUS_MISSION_TH
                ) {
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
    ...versionColumns,
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
      width: 220,
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
                className="text-primary px-2 py-2"
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
              className="text-primary px-2 py-2"
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
              className="text-primary px-2 py-2"
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
