import { Button, TextField } from '@mui/material';
import { cardStyleOf, isLegacyFixedStyle } from '../constants/cardStyle';
import {
  displayTypeLabel,
  type ProgramCategoryGroup,
} from '../programCategoryApi';
import DirectTargetPicker from '../ui/DirectTargetPicker';
import DisplayTypePicker from '../ui/DisplayTypePicker';
import { tagLabelOf } from '../utils/tagUtils';
import ConditionEditor from './ConditionEditor';
import {
  describeCondition,
  withCardStyle,
  type SectionDraft,
} from './sectionDraft';

const label = 'text-xsmall14 font-semibold text-neutral-10';

/** 섹션 하나: 제목·설명·카드 모양·조건·(큰 카드면) 고정 상품. 값은 위로 올리고 저장은 목록에서 한 번에 */
const SectionForm = ({
  value,
  onChange,
  groups,
}: {
  value: SectionDraft;
  onChange: (next: SectionDraft) => void;
  groups: ProgramCategoryGroup[];
}) => {
  const set = (patch: Partial<SectionDraft>) =>
    onChange({ ...value, ...patch });
  const labelOf = tagLabelOf(groups);
  const featured = value.displayType === 'FEATURED';

  return (
    <div className="mb-3 ml-3 mt-1 flex flex-col gap-4 rounded-xs bg-neutral-95 p-4">
      <div className="flex flex-wrap gap-2">
        <TextField
          size="small"
          label="섹션 제목"
          value={value.title}
          inputProps={{ maxLength: 30 }}
          onChange={(e) => set({ title: e.target.value })}
          sx={{ minWidth: 240 }}
        />
        <TextField
          size="small"
          label="섹션 설명"
          placeholder="제목 아래 한 줄 (비우면 안 보임)"
          value={value.description}
          inputProps={{ maxLength: 100 }}
          onChange={(e) => set({ description: e.target.value })}
          sx={{ flex: 1, minWidth: 280 }}
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className={label}>보여 줄 상품</span>
        <ConditionEditor value={value} onChange={set} groups={groups} />
        <p className="text-xxsmall12 text-neutral-40">
          → {describeCondition(value, (id) => labelOf.get(id) ?? `#${id}`)}{' '}
          상품이 이 섹션에 자동으로 모여요. 상품은 각 상품 수정 화면에서 분류를
          고르면 들어와요.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <span className={label}>카드 모양</span>
        <DisplayTypePicker
          value={cardStyleOf(value.displayType)}
          onChange={(style) => onChange(withCardStyle(value, style))}
        />
        {isLegacyFixedStyle(value.displayType) && (
          <p className="text-xxsmall12 text-neutral-40">
            예전에 &quot;{displayTypeLabel[value.displayType]}&quot;(으)로
            저장된 섹션이에요. 바꾸지 않으면 그대로 둬요.
          </p>
        )}
      </div>

      {featured && (
        <div className="flex flex-col gap-2">
          <span className={label}>큰 카드에 보일 상품</span>
          <p className="text-xxsmall12 text-neutral-40">
            비워 두면 조건에 맞는 상품 중 마감이 가장 가까운 것이 보여요.
          </p>
          <div className="flex flex-wrap items-start gap-2">
            <DirectTargetPicker
              targetType={value.pinnedTargetType ?? ''}
              targetId={
                value.pinnedTargetId ? String(value.pinnedTargetId) : ''
              }
              onChange={(next) =>
                set({
                  pinnedTargetType: next.targetType || null,
                  pinnedTargetId: next.targetId ? Number(next.targetId) : null,
                })
              }
            />
            {value.pinnedTargetType && (
              <Button
                size="small"
                onClick={() =>
                  set({ pinnedTargetType: null, pinnedTargetId: null })
                }
              >
                고정 풀기
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionForm;
