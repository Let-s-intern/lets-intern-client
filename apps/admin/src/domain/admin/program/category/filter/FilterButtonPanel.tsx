import { Button } from '@mui/material';
import { useState } from 'react';
import type { CategoryActions } from '../hooks/useCategoryActions';
import ProgramCategoryTargetList from '../ProgramCategoryTargetList';
import {
  programCategoryTargetTypeLabel,
  type ProgramCategory,
  type ProgramCategoryGroup,
} from '../programCategoryApi';
import CompactRow from '../ui/CompactRow';
import MenuButtonEditor from '../ui/MenuButtonEditor';

const destinationOf = (c: ProgramCategory) =>
  c.directTargetType && c.directTargetId
    ? `누르면 상품으로 바로 이동 (${programCategoryTargetTypeLabel[c.directTargetType]} #${c.directTargetId})`
    : c.slug
      ? `메뉴에서 누르면 /category/${c.slug}`
      : '필터 버튼으로만 씀';

/** 펼친 버튼 하나. 위 한 줄에 순서·노출·메뉴, 그 아래 누르면 갈 곳과 상품 */
const FilterButtonPanel = ({
  group,
  category,
  index,
  actions,
}: {
  group: ProgramCategoryGroup;
  category: ProgramCategory;
  index: number;
  actions: CategoryActions;
}) => {
  const [editing, setEditing] = useState(false);
  return (
    <div className="flex flex-col gap-2 rounded-xs bg-neutral-95 p-2">
      <CompactRow
        strong
        title={category.title}
        caption={destinationOf(category)}
        isVisible={category.isVisible}
        isFirst={index === 0}
        isLast={index === group.categoryList.length - 1}
        renameLabel="버튼 이름"
        onRename={(title) => actions.renameCategory(category.id, title)}
        onToggleVisible={(isVisible) =>
          actions.toggleCategory(category.id, isVisible)
        }
        onMove={(direction) => actions.moveCategory(group, index, direction)}
        menuItems={[
          {
            label: '버튼 삭제',
            danger: true,
            onClick: () => actions.deleteCategory(category),
          },
        ]}
      />
      {editing ? (
        <MenuButtonEditor
          category={category}
          onDone={() => setEditing(false)}
        />
      ) : (
        <div className="px-1">
          <Button size="small" onClick={() => setEditing(true)}>
            누르면 갈 곳 설정
          </Button>
        </div>
      )}
      <div className="rounded-xs bg-white py-1">
        <ProgramCategoryTargetList categoryId={category.id} />
      </div>
    </div>
  );
};

export default FilterButtonPanel;
