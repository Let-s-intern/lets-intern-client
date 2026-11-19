import { useEffect, useRef } from 'react';
import ProgramCategoryPicker from './ProgramCategoryPicker';
import { useAdminProgramCategoryGroupsQuery } from './programCategoryApi';
import { suggestTags, type AutoTagInput } from './utils/autoTag';
import { autoTagRulesOf } from './utils/tagUtils';

interface ProgramCategoryDraftFieldProps {
  value: number[];
  onChange: (ids: number[]) => void;
  /** 추천 태그용 상품 정보. 새 상품은 추천 태그를 미리 체크한다 */
  autoTagInput?: AutoTagInput;
}

/**
 * 생성 화면의 노출 분류. 아직 id 가 없어 고른 값만 들고 있다가, 생성 직후 저장한다.
 * 제목 등이 바뀌어 새 추천이 나오면 미리 체크한다. 사람이 끈 추천은 다시 켜지 않는다
 */
const ProgramCategoryDraftField = ({
  value,
  onChange,
  autoTagInput,
}: ProgramCategoryDraftFieldProps) => {
  const { data: groups = [] } = useAdminProgramCategoryGroupsQuery();
  const dismissed = useRef(new Set<number>());
  const autoAdded = useRef(new Set<number>());
  const suggestedIds = autoTagInput
    ? suggestTags(autoTagInput, autoTagRulesOf(groups)).map((s) => s.tagId)
    : [];
  const key = suggestedIds.join(',');

  useEffect(() => {
    const fresh = suggestedIds.filter(
      (id) => !value.includes(id) && !dismissed.current.has(id),
    );
    if (fresh.length === 0) return;
    fresh.forEach((id) => autoAdded.current.add(id));
    onChange([...value, ...fresh]);
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ProgramCategoryPicker
      selectedIds={value}
      onToggle={(id) => {
        if (value.includes(id)) {
          if (autoAdded.current.has(id)) dismissed.current.add(id);
          onChange(value.filter((v) => v !== id));
        } else onChange([...value, id]);
      }}
      note="등록하면 같이 저장됩니다. 추천 태그는 미리 체크해 두었어요."
      autoTagInput={autoTagInput}
    />
  );
};

export default ProgramCategoryDraftField;
