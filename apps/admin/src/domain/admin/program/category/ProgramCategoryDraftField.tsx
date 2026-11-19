import ProgramCategoryPicker from './ProgramCategoryPicker';
import type { AutoTagInput } from './utils/autoTag';

interface ProgramCategoryDraftFieldProps {
  value: number[];
  onChange: (ids: number[]) => void;
  /** 추천 태그용 상품 정보. "태그 자동 추천" 버튼을 눌렀을 때만 쓴다 */
  autoTagInput?: AutoTagInput;
}

/**
 * 생성 화면의 노출 분류. 아직 id 가 없어 고른 값만 들고 있다가, 생성 직후 저장한다.
 * 추천 태그는 저절로 체크하지 않는다
 */
const ProgramCategoryDraftField = ({
  value,
  onChange,
  autoTagInput,
}: ProgramCategoryDraftFieldProps) => (
  <ProgramCategoryPicker
    selectedIds={value}
    onToggle={(id) =>
      onChange(
        value.includes(id) ? value.filter((v) => v !== id) : [...value, id],
      )
    }
    note="등록하면 같이 저장됩니다."
    autoTagInput={autoTagInput}
  />
);

export default ProgramCategoryDraftField;
