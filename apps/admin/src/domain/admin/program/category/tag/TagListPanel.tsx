import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { Button } from '@mui/material';
import { useState } from 'react';
import type { CategoryActions } from '../hooks/useCategoryActions';
import {
  useAdminProgramCategoryGroupsQuery,
  useUpdateProgramCategoryPlacements,
  type ProgramCategory,
  type ProgramCategoryGroup,
} from '../programCategoryApi';
import AddInline from '../ui/AddInline';
import CompactRow from '../ui/CompactRow';
import RowMenu from '../ui/RowMenu';
import RenameDialog from '../ui/RenameDialog';
import { filterRowsOf, findCreatedGroup } from '../utils/tagUtils';
import AddTagDialog from './AddTagDialog';
import MoveTagDialog from './MoveTagDialog';

/** 필터 줄 하나: 줄 이름(⋯ 로 이름·숨김·삭제), 그 아래 분류들 */
const RowBlock = ({
  row,
  rowIds,
  allGroupIds,
  selectedId,
  onSelect,
  onMoveTag,
  actions,
}: {
  row: ProgramCategoryGroup;
  rowIds: number[];
  /** 순서 API 는 예전 랜딩 목록까지 모든 목록 id 를 받는다 */
  allGroupIds: number[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onMoveTag: (tag: ProgramCategory, rowId: number) => void;
  actions: CategoryActions;
}) => {
  const [renaming, setRenaming] = useState(false);
  return (
    <section className="flex flex-col">
      <div className="flex items-center gap-1 pl-3">
        <span className="flex-1 truncate text-xxsmall12 font-semibold text-neutral-40">
          {row.title}
          {!row.isVisible && ' · 숨김 · 사이트 필터에 안 보임'}
        </span>
        <RowMenu
          items={[
            { label: '줄 이름 바꾸기', onClick: () => setRenaming(true) },
            {
              label: row.isVisible ? '줄 숨기기' : '줄 보이기',
              onClick: () => actions.toggleGroup(row.id, !row.isVisible),
            },
            {
              label: '줄 위로',
              onClick: () =>
                actions.moveGroupAmong(allGroupIds, rowIds, row.id, -1),
            },
            {
              label: '줄 아래로',
              onClick: () =>
                actions.moveGroupAmong(allGroupIds, rowIds, row.id, 1),
            },
            {
              label: '줄 삭제',
              danger: true,
              onClick: () => actions.deleteGroup(row),
            },
          ]}
        />
      </div>
      {renaming && (
        <RenameDialog
          title={row.title}
          label="줄 이름"
          onClose={() => setRenaming(false)}
          onSave={(title) => actions.renameGroup(row.id, title)}
        />
      )}
      <ul>
        {row.categoryList.map((tag, index) => (
          <li key={tag.id}>
            <CompactRow
              title={tag.title}
              caption={tag.slug ? `/category/${tag.slug}` : '주소 없음'}
              active={selectedId === tag.id}
              onClick={() => onSelect(tag.id)}
              isVisible={tag.isVisible}
              isFirst={index === 0}
              isLast={index === row.categoryList.length - 1}
              renameLabel="분류 이름"
              stacked
              onRename={(title) => actions.renameCategory(tag.id, title)}
              onToggleVisible={(isVisible) =>
                actions.toggleCategory(tag.id, isVisible)
              }
              onMove={(direction) =>
                actions.moveCategory(row, index, direction)
              }
              menuItems={[
                {
                  label: '다른 줄로 옮기기',
                  onClick: () => onMoveTag(tag, row.id),
                },
                {
                  label: '분류 삭제',
                  danger: true,
                  onClick: () => actions.deleteCategory(tag),
                },
              ]}
            />
          </li>
        ))}
        {row.categoryList.length === 0 && (
          <li className="py-1 pl-3 text-xxsmall12 text-neutral-50">
            비어 있음
          </li>
        )}
      </ul>
    </section>
  );
};

/**
 * 왼쪽 분류 목록. 필터 줄(/program 필터의 줄)별로 묶어 보인다. 토글은 필터 버튼으로 보일지다
 */
const TagListPanel = ({
  groups,
  selectedId,
  onSelect,
  actions,
}: {
  groups: ProgramCategoryGroup[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  actions: CategoryActions;
}) => {
  const { snackbar } = useAdminSnackbar();
  const { refetch } = useAdminProgramCategoryGroupsQuery();
  const savePlacements = useUpdateProgramCategoryPlacements();
  const [adding, setAdding] = useState(false);
  const [moving, setMoving] = useState<{
    tag: ProgramCategory;
    rowId: number;
  } | null>(null);
  const rows = filterRowsOf(groups);
  const rowIds = rows.map((r) => r.id);

  // 새 필터 줄: 목록을 만들고 다시 받아 찾은 뒤 /program 필터 위치를 붙인다
  const addRow = async (title: string) => {
    await actions.createGroup(title);
    const { data: fresh = [] } = await refetch();
    const created = findCreatedGroup(groups, fresh, title);
    if (!created) {
      snackbar('줄은 만들었지만 찾지 못했습니다. 새로고침해 보세요.');
      return;
    }
    try {
      await savePlacements.mutateAsync({
        id: created.id,
        placementList: [
          {
            placementType: 'PROGRAM_FILTER',
            mergeChallenges: true,
            matchMode: 'ANY',
          },
        ],
      });
    } catch {
      snackbar('줄은 만들었지만 필터에 붙이지 못했습니다.');
    }
  };

  return (
    <aside className="flex flex-col gap-4">
      <Button
        variant="outlined"
        size="small"
        onClick={() => setAdding(true)}
        sx={{ alignSelf: 'flex-start' }}
      >
        + 분류 추가
      </Button>
      {rows.map((row) => (
        <RowBlock
          key={row.id}
          row={row}
          rowIds={rowIds}
          allGroupIds={groups.map((g) => g.id)}
          selectedId={selectedId}
          onSelect={onSelect}
          onMoveTag={(tag, rowId) => setMoving({ tag, rowId })}
          actions={actions}
        />
      ))}
      <AddInline
        label="필터 줄 추가"
        placeholder="새 줄 이름 (예: 직무)"
        onAdd={addRow}
      />
      {adding && (
        <AddTagDialog
          groups={groups}
          onClose={() => setAdding(false)}
          onCreated={onSelect}
        />
      )}
      {moving && (
        <MoveTagDialog
          tag={moving.tag}
          currentRowId={moving.rowId}
          groups={groups}
          onClose={() => setMoving(null)}
        />
      )}
    </aside>
  );
};

export default TagListPanel;
