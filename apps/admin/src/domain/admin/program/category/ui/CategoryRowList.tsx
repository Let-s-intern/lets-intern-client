import { useState, type ReactNode } from 'react';
import type { CategoryActions } from '../hooks/useCategoryActions';
import ProgramCategoryTargetList from '../ProgramCategoryTargetList';
import type {
  ProgramCategory,
  ProgramCategoryGroup,
} from '../programCategoryApi';
import AddInline from './AddInline';
import CompactRow from './CompactRow';

/**
 * 노출 목록 안 카테고리 줄들. 줄에는 순서·노출만, 이름 바꾸기·삭제는 "⋯" 안에 둔다.
 * editorHasProducts 면 줄을 눌러 편집기(상품 포함)를, 아니면 상품 목록을 펼치고 편집기는 "⋯" 에서 연다
 */
const CategoryRowList = ({
  group,
  actions,
  caption,
  renderEditor,
  editorHasProducts = false,
  itemLabel,
  emptyText,
  addPlaceholder,
}: {
  group: ProgramCategoryGroup;
  actions: CategoryActions;
  caption: (category: ProgramCategory) => string;
  renderEditor: (category: ProgramCategory, onDone: () => void) => ReactNode;
  editorHasProducts?: boolean;
  /** "섹션", "카테고리" 처럼 메뉴 문구에 들어갈 이름 */
  itemLabel: string;
  emptyText: string;
  addPlaceholder: string;
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [productsId, setProductsId] = useState<number | null>(null);
  const toggle = (setter: typeof setEditingId, id: number) =>
    setter((prev) => (prev === id ? null : id));

  return (
    <div>
      <ul className="flex flex-col">
        {group.categoryList.map((category, index) => (
          <li key={category.id}>
            <CompactRow
              title={category.title}
              caption={caption(category)}
              active={editingId === category.id || productsId === category.id}
              onClick={() =>
                toggle(
                  editorHasProducts ? setEditingId : setProductsId,
                  category.id,
                )
              }
              isVisible={category.isVisible}
              isFirst={index === 0}
              isLast={index === group.categoryList.length - 1}
              renameLabel={`${itemLabel} 이름`}
              onRename={(title) => actions.renameCategory(category.id, title)}
              onToggleVisible={(isVisible) =>
                actions.toggleCategory(category.id, isVisible)
              }
              onMove={(direction) =>
                actions.moveCategory(group, index, direction)
              }
              menuItems={[
                ...(editorHasProducts
                  ? []
                  : [
                      {
                        label: '설정',
                        onClick: () => toggle(setEditingId, category.id),
                      },
                    ]),
                {
                  label: `${itemLabel} 삭제`,
                  danger: true,
                  onClick: () => actions.deleteCategory(category),
                },
              ]}
            />
            {editingId === category.id &&
              renderEditor(category, () => setEditingId(null))}
            {!editorHasProducts && productsId === category.id && (
              <ProgramCategoryTargetList categoryId={category.id} />
            )}
          </li>
        ))}
        {group.categoryList.length === 0 && (
          <li className="py-2 pl-3 text-xsmall14 text-neutral-40">
            {emptyText}
          </li>
        )}
      </ul>
      <div className="mt-1">
        <AddInline
          label={`${itemLabel} 추가`}
          placeholder={addPlaceholder}
          onAdd={(title) => actions.createCategory(group.id, title)}
        />
      </div>
    </div>
  );
};

export default CategoryRowList;
