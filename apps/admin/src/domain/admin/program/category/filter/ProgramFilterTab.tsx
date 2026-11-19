import { Button, MenuItem, Select } from '@mui/material';
import { useState } from 'react';
import { siteUrl } from '../constants/webMenu';
import type { CategoryActions } from '../hooks/useCategoryActions';
import { useSavePlacements } from '../hooks/useSavePlacements';
import type { ProgramCategoryGroup } from '../programCategoryApi';
import AddInline from '../ui/AddInline';
import CompactRow from '../ui/CompactRow';
import {
  draftsAppended,
  filterRowsOf,
  type FilterRow,
} from '../utils/placementUtils';
import FilterButtonPanel from './FilterButtonPanel';
import FilterRowSettingsDialog from './FilterRowSettingsDialog';

/** 노출 목록 하나를 전체 프로그램 필터 줄로 붙인다. 평소에는 버튼 하나만 보인다 */
const AddFilterRow = ({ groups }: { groups: ProgramCategoryGroup[] }) => {
  const { save, isPending } = useSavePlacements();
  const [open, setOpen] = useState(false);
  const [groupId, setGroupId] = useState<number | ''>('');
  const candidates = groups.filter(
    (g) =>
      !(g.placements ?? []).some((p) => p.placementType === 'PROGRAM_FILTER'),
  );
  const group = candidates.find((g) => g.id === groupId);

  if (!open)
    return (
      <div>
        <Button size="small" onClick={() => setOpen(true)}>
          + 필터 줄 추가
        </Button>
      </div>
    );

  const add = async () => {
    if (!group) return;
    const ok = await save(
      group.id,
      draftsAppended(group, {
        placementType: 'PROGRAM_FILTER',
        slug: '',
        mergeChallenges: true,
        matchMode: 'ANY',
      }),
    );
    if (ok) {
      setGroupId('');
      setOpen(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        size="small"
        displayEmpty
        value={groupId}
        onChange={(e) => setGroupId(e.target.value as number | '')}
        sx={{ minWidth: 240 }}
      >
        <MenuItem value="" disabled>
          줄로 쓸 노출 목록
        </MenuItem>
        {candidates.map((g) => (
          <MenuItem key={g.id} value={g.id}>
            {g.title} (카테고리 {g.categoryList.length}개)
          </MenuItem>
        ))}
      </Select>
      <Button
        variant="contained"
        size="small"
        disabled={!group || isPending}
        onClick={add}
      >
        추가
      </Button>
      <Button size="small" onClick={() => setOpen(false)}>
        취소
      </Button>
    </div>
  );
};

/** 필터 줄 하나. 제목 줄, 버튼 칩, 펼친 버튼의 상품 */
const FilterRowCard = ({
  row,
  isFirst,
  isLast,
  onMove,
  actions,
}: {
  row: FilterRow;
  isFirst: boolean;
  isLast: boolean;
  onMove: (direction: -1 | 1) => void;
  actions: CategoryActions;
}) => {
  const { group } = row;
  const [openId, setOpenId] = useState<number | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const openIndex = group.categoryList.findIndex((c) => c.id === openId);

  return (
    <section className="flex flex-col gap-2 py-3">
      <CompactRow
        strong
        title={group.title}
        caption={`버튼 ${group.categoryList.length}개`}
        isVisible={group.isVisible}
        isFirst={isFirst}
        isLast={isLast}
        renameLabel="줄 이름"
        onRename={(title) => actions.renameGroup(group.id, title)}
        onToggleVisible={(isVisible) =>
          actions.toggleGroup(group.id, isVisible)
        }
        onMove={onMove}
        menuItems={[{ label: '줄 설정', onClick: () => setSettingsOpen(true) }]}
      />
      {settingsOpen && (
        <FilterRowSettingsDialog
          row={row}
          onClose={() => setSettingsOpen(false)}
        />
      )}
      <div className="flex flex-wrap items-center gap-1.5 pl-3">
        {group.categoryList.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setOpenId((prev) => (prev === c.id ? null : c.id))}
            className={`rounded-full border px-3 py-1 text-xsmall14 ${
              openId === c.id
                ? 'border-neutral-0 bg-neutral-0 text-white'
                : 'border-neutral-80 bg-white text-neutral-10 hover:border-neutral-50'
            } ${c.isVisible ? '' : 'opacity-50'}`}
          >
            {c.title}
            <span
              className={`ml-1.5 ${
                c.programCount === 0
                  ? 'text-red-500'
                  : openId === c.id
                    ? 'text-neutral-80'
                    : 'text-neutral-40'
              }`}
            >
              {c.programCount}
            </span>
          </button>
        ))}
        <AddInline
          label="버튼 추가"
          placeholder={`${group.title}에 버튼 추가 (예: 마케팅)`}
          onAdd={(title) => actions.createCategory(group.id, title)}
        />
      </div>
      {openIndex >= 0 && (
        <div className="pl-3">
          <FilterButtonPanel
            key={group.categoryList[openIndex].id}
            group={group}
            category={group.categoryList[openIndex]}
            index={openIndex}
            actions={actions}
          />
        </div>
      )}
    </section>
  );
};

/** 전체 프로그램 필터(/program). 줄 = 노출 목록, 버튼 = 그 안의 카테고리 */
const ProgramFilterTab = ({
  groups,
  actions,
}: {
  groups: ProgramCategoryGroup[];
  actions: CategoryActions;
}) => {
  const rows = filterRowsOf(groups);
  const groupIds = groups.map((g) => g.id);
  // 순서는 목록 단위라 id 를 한 번씩만 센다
  const rowGroupIds = [...new Set(rows.map((r) => r.group.id))];

  return (
    <div className="mt-4 flex max-w-[960px] flex-col">
      <p className="text-xsmall14 text-neutral-40">
        버튼을 누르면 상품이 펼쳐집니다.{' '}
        <a
          href={siteUrl('/program')}
          target="_blank"
          rel="noreferrer"
          className="text-primary hover:underline"
        >
          사이트에서 열기
        </a>
      </p>
      <div className="divide-y divide-neutral-90">
        {rows.map((row) => {
          const index = rowGroupIds.indexOf(row.group.id);
          return (
            <FilterRowCard
              key={`${row.group.id}:${row.placementIndex}`}
              row={row}
              isFirst={index === 0}
              isLast={index === rowGroupIds.length - 1}
              onMove={(direction) =>
                actions.moveGroupAmong(
                  groupIds,
                  rowGroupIds,
                  row.group.id,
                  direction,
                )
              }
              actions={actions}
            />
          );
        })}
      </div>
      {rows.length === 0 && (
        <p className="py-3 text-xsmall14 text-neutral-40">
          전체 프로그램 필터에 붙은 노출 목록이 없습니다.
        </p>
      )}
      <AddFilterRow groups={groups} />
    </div>
  );
};

export default ProgramFilterTab;
