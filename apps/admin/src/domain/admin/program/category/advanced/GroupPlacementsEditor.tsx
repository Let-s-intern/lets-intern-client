import {
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  MenuItem,
  Select,
} from '@mui/material';
import { useState } from 'react';
import { MATCH_MODE_LABEL, MERGE_CHALLENGES_LABEL } from '../constants/wording';
import { useSavePlacements } from '../hooks/useSavePlacements';
import {
  placementTypeLabel,
  type ProgramCategoryGroup,
  type ProgramCategoryMatchMode,
  type ProgramCategoryPlacementType,
} from '../programCategoryApi';
import PageAddressField from '../ui/PageAddressField';
import {
  draftsOf,
  isDraftInvalid,
  type PlacementDraft,
} from '../utils/placementUtils';

/**
 * 노출 위치 전체 편집. 한 노출 목록을 여러 곳에 여러 방식으로 붙인다.
 * 랜딩·필터 탭에서 하는 일을 한꺼번에 하는 곳이라 고급 설정에 둔다
 */
const GroupPlacementsEditor = ({
  group,
  onDone,
}: {
  group: ProgramCategoryGroup;
  onDone: () => void;
}) => {
  const { save, isPending } = useSavePlacements();
  const [drafts, setDrafts] = useState<PlacementDraft[]>(draftsOf(group));
  const patch = (index: number, next: Partial<PlacementDraft>) =>
    setDrafts((prev) =>
      prev.map((d, i) => (i === index ? { ...d, ...next } : d)),
    );

  return (
    <div className="mb-2 ml-3 mt-1 flex flex-col gap-3 rounded-xs bg-neutral-95 p-3">
      <p className="text-xsmall14 text-neutral-30">
        이 노출 목록이 어디에 어떻게 보일지 정합니다. 위치를 여러 개 붙일 수
        있고, 하나도 없으면 어디에도 보이지 않습니다.
      </p>
      {drafts.map((d, index) => (
        <div
          key={index}
          className="flex flex-wrap items-start gap-2 rounded-xs bg-white p-2"
        >
          <Select
            size="small"
            value={d.placementType}
            onChange={(e) =>
              patch(index, {
                placementType: e.target.value as ProgramCategoryPlacementType,
              })
            }
            sx={{ minWidth: 200 }}
          >
            {(
              Object.keys(placementTypeLabel) as ProgramCategoryPlacementType[]
            ).map((type) => (
              <MenuItem key={type} value={type}>
                {placementTypeLabel[type]}
              </MenuItem>
            ))}
          </Select>
          {d.placementType === 'LANDING' ? (
            <PageAddressField
              value={d.slug}
              onChange={(slug) => patch(index, { slug })}
              required
              helperText="사이트에서 이 주소로 열립니다."
            />
          ) : (
            <Select
              size="small"
              value={d.matchMode}
              onChange={(e) =>
                patch(index, {
                  matchMode: e.target.value as ProgramCategoryMatchMode,
                })
              }
            >
              {(['ANY', 'ALL'] as const).map((mode) => (
                <MenuItem key={mode} value={mode}>
                  버튼 여러 개 고르면 {MATCH_MODE_LABEL[mode]}
                </MenuItem>
              ))}
            </Select>
          )}
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={d.mergeChallenges}
                onChange={(e) =>
                  patch(index, { mergeChallenges: e.target.checked })
                }
              />
            }
            label={
              <span className="text-xsmall14">{MERGE_CHALLENGES_LABEL}</span>
            }
          />
          <IconButton
            size="small"
            aria-label="노출 위치 삭제"
            onClick={() =>
              setDrafts((prev) => prev.filter((_, i) => i !== index))
            }
          >
            ×
          </IconButton>
        </div>
      ))}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="small"
          variant="outlined"
          onClick={() =>
            setDrafts((prev) => [
              ...prev,
              {
                placementType: 'LANDING',
                slug: '',
                mergeChallenges: true,
                matchMode: 'ANY',
              },
            ])
          }
        >
          노출 위치 추가
        </Button>
        <Button
          variant="contained"
          size="small"
          disabled={drafts.some(isDraftInvalid) || isPending}
          onClick={async () => {
            if (await save(group.id, drafts)) onDone();
          }}
        >
          저장
        </Button>
      </div>
    </div>
  );
};

export default GroupPlacementsEditor;
