import ProgramCategoryPicker from './ProgramCategoryPicker';

interface ProgramCategoryDraftFieldProps {
  value: number[];
  onChange: (ids: number[]) => void;
}

/** 생성 화면의 노출 분류. 아직 id 가 없어 고른 값만 들고 있다가, 생성 직후 저장한다 */
const ProgramCategoryDraftField = ({
  value,
  onChange,
}: ProgramCategoryDraftFieldProps) => (
  <ProgramCategoryPicker
    selectedIds={value}
    onToggle={(id) =>
      onChange(
        value.includes(id) ? value.filter((v) => v !== id) : [...value, id],
      )
    }
    note="등록하면 같이 저장됩니다."
  />
);

export default ProgramCategoryDraftField;
