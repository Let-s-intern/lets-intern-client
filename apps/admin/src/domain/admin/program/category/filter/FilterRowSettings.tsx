import {
  Button,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { useState } from 'react';
import {
  MATCH_MODE_HELP,
  MATCH_MODE_LABEL,
  MERGE_CHALLENGES_HELP,
  MERGE_CHALLENGES_LABEL,
} from '../constants/wording';
import { useSavePlacements } from '../hooks/useSavePlacements';
import type { ProgramCategoryMatchMode } from '../programCategoryApi';
import AdvancedArea from '../ui/AdvancedArea';
import {
  draftsWith,
  draftsWithout,
  type FilterRow,
} from '../utils/placementUtils';

/** 필터 줄 하나의 설정. 버튼 여러 개 고를 때 조건은 고급 설정에 접어 둔다 */
const FilterRowSettings = ({ row }: { row: FilterRow }) => {
  const { save, isPending } = useSavePlacements();
  const [mergeChallenges, setMergeChallenges] = useState(row.mergeChallenges);
  const [matchMode, setMatchMode] = useState(row.matchMode);
  const changed =
    mergeChallenges !== row.mergeChallenges || matchMode !== row.matchMode;

  const remove = () => {
    if (
      !window.confirm(
        `"${row.group.title}" 줄을 전체 프로그램 필터에서 내립니다. 버튼과 상품 연결은 그대로 남습니다. 내릴까요?`,
      )
    )
      return;
    save(row.group.id, draftsWithout(row.group, row.placementIndex));
  };

  return (
    <div className="flex flex-col gap-2">
      <div>
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={mergeChallenges}
              onChange={(e) => setMergeChallenges(e.target.checked)}
            />
          }
          label={
            <span className="text-xsmall14">{MERGE_CHALLENGES_LABEL}</span>
          }
        />
        <p className="ml-8 text-xxsmall12 text-neutral-40">
          {MERGE_CHALLENGES_HELP}
        </p>
      </div>
      <AdvancedArea>
        <span className="text-xsmall14 font-semibold text-neutral-10">
          버튼을 여러 개 골랐을 때
        </span>
        <RadioGroup
          value={matchMode}
          onChange={(e) =>
            setMatchMode(e.target.value as ProgramCategoryMatchMode)
          }
        >
          {(['ANY', 'ALL'] as const).map((mode) => (
            <FormControlLabel
              key={mode}
              value={mode}
              control={<Radio size="small" />}
              label={
                <span className="text-xsmall14">
                  {MATCH_MODE_LABEL[mode]}
                  <span className="ml-2 text-xxsmall12 text-neutral-40">
                    {MATCH_MODE_HELP[mode]}
                  </span>
                </span>
              }
            />
          ))}
        </RadioGroup>
        <div>
          <Button
            size="small"
            color="error"
            variant="outlined"
            disabled={isPending}
            onClick={remove}
          >
            이 필터 줄 내리기
          </Button>
        </div>
      </AdvancedArea>
      {changed && (
        <div>
          <Button
            variant="contained"
            size="small"
            disabled={isPending}
            onClick={() =>
              save(
                row.group.id,
                draftsWith(row.group, row.placementIndex, {
                  mergeChallenges,
                  matchMode,
                }),
              )
            }
          >
            줄 설정 저장
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterRowSettings;
