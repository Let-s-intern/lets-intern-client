import { Button, Checkbox, FormControlLabel } from '@mui/material';
import { useState } from 'react';
import { useAdminProgramCategoryGroupsQuery } from './programCategoryApi';

interface ProgramCategoryPickerProps {
  /** 아직 모르면 undefined. 그동안은 체크를 막는다 */
  selectedIds: number[] | undefined;
  onToggle: (id: number) => void;
  /** 펼쳤을 때 체크박스 위에 붙는 안내 */
  note: string;
}

/** 노출 분류 화면 부분. 평소에는 고른 카테고리만 한 줄로 보이고 "수정" 을 눌러 펼친다 */
const ProgramCategoryPicker = ({
  selectedIds,
  onToggle,
  note,
}: ProgramCategoryPickerProps) => {
  const { data: groups = [] } = useAdminProgramCategoryGroupsQuery();
  const [expanded, setExpanded] = useState(false);

  const selected = groups.flatMap((group) =>
    group.categoryList
      .filter((category) => selectedIds?.includes(category.id))
      .map((category) => ({ group, category })),
  );

  return (
    <div className="rounded-xs border border-neutral-80 px-3 py-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xsmall14 font-semibold text-neutral-0">
          노출 분류
        </span>
        {selected.length === 0 ? (
          <span className="text-xsmall14 text-neutral-40">지정 안 됨</span>
        ) : (
          selected.map(({ group, category }) => (
            <span
              key={category.id}
              className="rounded-xs bg-neutral-95 px-2 py-0.5 text-xsmall14 text-neutral-10"
            >
              {group.title} · {category.title}
              {(!group.isVisible || !category.isVisible) && ' (숨김)'}
            </span>
          ))
        )}
        <Button
          size="small"
          sx={{ ml: 'auto' }}
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? '접기' : '수정'}
        </Button>
      </div>

      {expanded &&
        (groups.length === 0 ? (
          <p className="mt-2 text-xsmall14 text-neutral-40">
            노출 분류가 없습니다. 사이드바 프로그램 관리의 "노출 분류"에서 먼저
            추가하세요.
          </p>
        ) : (
          <div className="mt-2 flex flex-col gap-2 border-t border-neutral-80 pt-2">
            <p className="text-xsmall14 text-neutral-40">{note}</p>
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
                          disabled={!selectedIds}
                          checked={selectedIds?.includes(category.id) ?? false}
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
        ))}
    </div>
  );
};

export default ProgramCategoryPicker;
