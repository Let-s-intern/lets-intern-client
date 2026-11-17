import { Checkbox, FormControlLabel } from '@mui/material';
import { useAdminProgramCategoryGroupsQuery } from './programCategoryApi';

interface ProgramCategorySectionProps {
  selectedIds: number[];
  onToggle: (id: number) => void;
}

/** 수정 화면의 카테고리 체크박스. 노출 목록별로 묶고, 숨긴 항목은 (숨김) 표시만 붙인다 */
const ProgramCategorySection = ({
  selectedIds,
  onToggle,
}: ProgramCategorySectionProps) => {
  const { data: groups = [] } = useAdminProgramCategoryGroupsQuery();

  if (groups.length === 0) {
    return (
      <p className="text-xsmall14 text-neutral-40">
        노출 분류가 없습니다. 사이드바 프로그램 관리의 "노출 분류"에서 먼저
        추가하세요.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {groups.map((group) => (
        <div key={group.id}>
          <p className="text-xsmall14 font-semibold text-neutral-0">
            {group.title}
            {!group.isVisible && ' (숨김)'}
          </p>
          <div className="flex flex-wrap">
            {group.categoryList.map((category) => (
              <FormControlLabel
                key={category.id}
                control={
                  <Checkbox
                    size="small"
                    checked={selectedIds.includes(category.id)}
                    onChange={() => onToggle(category.id)}
                  />
                }
                label={`${category.title}${category.isVisible ? '' : ' (숨김)'}`}
              />
            ))}
            {group.categoryList.length === 0 && (
              <span className="text-xsmall14 text-neutral-40">
                카테고리 없음
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgramCategorySection;
