import {
  Autocomplete,
  Chip,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  programCategoryTargetTypeLabel,
  sectionTargetTypes,
  type ProgramCategoryGroup,
  type ProgramCategoryMatchMode,
  type ProgramCategoryTargetType,
} from '../programCategoryApi';
import { tagLabelOf, tagsOf } from '../utils/tagUtils';
import { MATCH_LABEL, type SectionDraft } from './sectionDraft';

/**
 * 섹션 조건. 분류(여러 개면 모두/하나라도) + 상품 유형(비우면 모든 유형).
 * 예: 포트폴리오 그리고 챌린지, (자기소개서 또는 포트폴리오) + VOD
 */
const ConditionEditor = ({
  value,
  onChange,
  groups,
}: {
  value: Pick<SectionDraft, 'tagIds' | 'matchMode' | 'targetTypes'>;
  onChange: (next: Partial<SectionDraft>) => void;
  groups: ProgramCategoryGroup[];
}) => {
  const labelOf = tagLabelOf(groups);
  const options = tagsOf(groups).map(({ tag }) => tag.id);
  const toggleType = (type: ProgramCategoryTargetType) =>
    onChange({
      targetTypes: value.targetTypes.includes(type)
        ? value.targetTypes.filter((t) => t !== type)
        : [...value.targetTypes, type],
    });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-start gap-2">
        <Autocomplete
          multiple
          size="small"
          options={options}
          value={value.tagIds}
          getOptionLabel={(id) => labelOf.get(id) ?? `#${id}`}
          onChange={(_, ids) => onChange({ tagIds: ids })}
          renderInput={(params) => (
            <TextField {...params} label="분류" placeholder="분류 고르기" />
          )}
          sx={{ flex: 1, minWidth: 320 }}
        />
        {value.tagIds.length > 1 && (
          <ToggleButtonGroup
            size="small"
            exclusive
            value={value.matchMode}
            onChange={(_, mode: ProgramCategoryMatchMode | null) =>
              mode && onChange({ matchMode: mode })
            }
          >
            {(['ALL', 'ANY'] as const).map((mode) => (
              <ToggleButton key={mode} value={mode}>
                {MATCH_LABEL[mode]}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xxsmall12 text-neutral-40">
          상품 유형{' '}
          {value.targetTypes.length === 0 && '· 고르지 않으면 모든 유형'}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {sectionTargetTypes.map((type) => {
            const on = value.targetTypes.includes(type);
            return (
              <Chip
                key={type}
                size="small"
                label={programCategoryTargetTypeLabel[type]}
                color={on ? 'primary' : 'default'}
                variant={on ? 'filled' : 'outlined'}
                onClick={() => toggleType(type)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ConditionEditor;
