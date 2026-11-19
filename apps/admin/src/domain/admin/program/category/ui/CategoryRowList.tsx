import { Fragment, useState, type ReactNode } from 'react';
import type { CategoryActions } from '../hooks/useCategoryActions';
import { AddRow, ItemRow } from '../ProgramCategoryRows';
import ProgramCategoryTargetList from '../ProgramCategoryTargetList';
import type {
  ProgramCategory,
  ProgramCategoryGroup,
} from '../programCategoryApi';

/**
 * 노출 목록 안 카테고리 줄들. 이름·숨김·순서·삭제는 줄에서 바로 하고,
 * 톱니를 누르면 renderEditor 가 펼쳐진다. 편집기가 상품 목록을 품으면 줄을 눌러도 편집기를 연다
 */
const CategoryRowList = ({
  group,
  actions,
  caption,
  renderEditor,
  editorHasProducts = false,
  emptyText,
  addPlaceholder,
}: {
  group: ProgramCategoryGroup;
  actions: CategoryActions;
  caption: (category: ProgramCategory) => string;
  renderEditor: (category: ProgramCategory, onDone: () => void) => ReactNode;
  editorHasProducts?: boolean;
  emptyText: string;
  addPlaceholder: string;
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [productsId, setProductsId] = useState<number | null>(null);
  const toggle = (setter: typeof setEditingId, id: number) =>
    setter((prev) => (prev === id ? null : id));

  return (
    <>
      <ul className="flex flex-col gap-0.5">
        {group.categoryList.map((category, index) => (
          <Fragment key={category.id}>
            <ItemRow
              title={category.title}
              caption={caption(category)}
              active={
                editingId === category.id ||
                (!editorHasProducts && productsId === category.id)
              }
              onClick={() =>
                toggle(
                  editorHasProducts ? setEditingId : setProductsId,
                  category.id,
                )
              }
              isVisible={category.isVisible}
              isFirst={index === 0}
              isLast={index === group.categoryList.length - 1}
              onRename={(title) => actions.renameCategory(category.id, title)}
              onToggleVisible={(isVisible) =>
                actions.toggleCategory(category.id, isVisible)
              }
              onMove={(direction) =>
                actions.moveCategory(group, index, direction)
              }
              onDelete={() => actions.deleteCategory(category)}
              onSettings={() => toggle(setEditingId, category.id)}
            />
            {editingId === category.id && (
              <li>{renderEditor(category, () => setEditingId(null))}</li>
            )}
            {!editorHasProducts && productsId === category.id && (
              <li>
                <ProgramCategoryTargetList categoryId={category.id} />
              </li>
            )}
          </Fragment>
        ))}
        {group.categoryList.length === 0 && (
          <li className="py-2 pl-3 text-xsmall14 text-neutral-40">
            {emptyText}
          </li>
        )}
      </ul>
      <AddRow
        placeholder={addPlaceholder}
        onAdd={(title) => actions.createCategory(group.id, title)}
      />
    </>
  );
};

export default CategoryRowList;
