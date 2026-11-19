import { Button, MenuItem, Select } from '@mui/material';
import { useState } from 'react';
import { siteUrl } from '../constants/webMenu';
import { MATCH_MODE_LABEL } from '../constants/wording';
import type { CategoryActions } from '../hooks/useCategoryActions';
import { useSavePlacements } from '../hooks/useSavePlacements';
import {
  programCategoryTargetTypeLabel,
  type ProgramCategory,
  type ProgramCategoryGroup,
} from '../programCategoryApi';
import { ItemRow } from '../ProgramCategoryRows';
import CategoryRowList from '../ui/CategoryRowList';
import MenuButtonEditor from '../ui/MenuButtonEditor';
import { draftsAppended, filterRowsOf } from '../utils/placementUtils';
import FilterRowSettings from './FilterRowSettings';

const buttonCaption = (c: ProgramCategory) =>
  [
    `상품 ${c.programCount}`,
    c.directTargetType && c.directTargetId
      ? `바로 이동 → ${programCategoryTargetTypeLabel[c.directTargetType]} #${c.directTargetId}`
      : c.slug
        ? `/category/${c.slug}`
        : null,
  ]
    .filter(Boolean)
    .join(' · ');

/** 노출 목록 하나를 전체 프로그램 필터 줄로 붙인다 */
const AddFilterRow = ({ groups }: { groups: ProgramCategoryGroup[] }) => {
  const { save, isPending } = useSavePlacements();
  const [groupId, setGroupId] = useState<number | ''>('');
  const candidates = groups.filter(
    (g) =>
      !(g.placements ?? []).some((p) => p.placementType === 'PROGRAM_FILTER'),
  );
  const group = candidates.find((g) => g.id === groupId);

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
    if (ok) setGroupId('');
  };

  return (
    <section className="flex flex-wrap items-center gap-2 rounded-sm border border-dashed border-neutral-80 p-3">
      <span className="text-xsmall14 font-semibold text-neutral-10">
        필터 줄 추가
      </span>
      <Select
        size="small"
        displayEmpty
        value={groupId}
        onChange={(e) => setGroupId(e.target.value as number | '')}
        sx={{ minWidth: 240 }}
      >
        <MenuItem value="" disabled>
          노출 목록 고르기
        </MenuItem>
        {candidates.map((g) => (
          <MenuItem key={g.id} value={g.id}>
            {g.title} (카테고리 {g.categoryList.length}개)
          </MenuItem>
        ))}
      </Select>
      <Button
        variant="outlined"
        size="small"
        disabled={!group || isPending}
        onClick={add}
      >
        추가
      </Button>
      <span className="text-xxsmall12 text-neutral-40">
        목록의 카테고리가 이 줄의 버튼이 됩니다. 새 목록은 &quot;고급 설정&quot;
        탭에서 만듭니다.
      </span>
    </section>
  );
};

/** 전체 프로그램 필터(/program). 줄마다 버튼과 버튼 아래 상품을 보여준다 */
const ProgramFilterTab = ({
  groups,
  actions,
}: {
  groups: ProgramCategoryGroup[];
  actions: CategoryActions;
}) => {
  const rows = filterRowsOf(groups);
  const groupIds = groups.map((g) => g.id);
  // 한 목록이 필터 줄로 두 번 붙을 일은 없지만, 순서는 목록 단위라 id 를 한 번씩만 센다
  const rowGroupIds = [...new Set(rows.map((r) => r.group.id))];

  return (
    <div className="mt-4 flex flex-col gap-4">
      <p className="text-xsmall14 text-neutral-40">
        사이트 전체 프로그램 화면 위쪽의 필터입니다. 줄 = 노출 목록, 버튼 = 그
        안의 카테고리입니다. 버튼을 누르면 연결된 상품이, 톱니를 누르면 메뉴에서
        눌렀을 때 갈 곳이 펼쳐집니다.{' '}
        <a
          href={siteUrl('/program')}
          target="_blank"
          rel="noreferrer"
          className="text-primary hover:underline"
        >
          사이트에서 열기
        </a>
      </p>
      {rows.length === 0 && (
        <p className="text-xsmall14 text-neutral-40">
          전체 프로그램 필터에 붙은 노출 목록이 없습니다.
        </p>
      )}
      {rows.map((row) => {
        const index = rowGroupIds.indexOf(row.group.id);
        return (
          <section
            key={`${row.group.id}:${row.placementIndex}`}
            className="flex flex-col gap-2 rounded-sm border border-neutral-80 bg-white p-3"
          >
            <ul className="border-b border-neutral-80 pb-2">
              <ItemRow
                strong
                title={row.group.title}
                caption={`버튼 ${row.group.categoryList.length}개 · 여러 개 고르면 ${MATCH_MODE_LABEL[row.matchMode]}`}
                isVisible={row.group.isVisible}
                isFirst={index === 0}
                isLast={index === rowGroupIds.length - 1}
                onRename={(title) => actions.renameGroup(row.group.id, title)}
                onToggleVisible={(isVisible) =>
                  actions.toggleGroup(row.group.id, isVisible)
                }
                onMove={(direction) =>
                  actions.moveGroupAmong(
                    groupIds,
                    rowGroupIds,
                    row.group.id,
                    direction,
                  )
                }
                onDelete={() => actions.deleteGroup(row.group)}
              />
            </ul>
            <FilterRowSettings
              key={`${row.mergeChallenges}-${row.matchMode}`}
              row={row}
            />
            <div className="pl-4">
              <CategoryRowList
                group={row.group}
                actions={actions}
                caption={buttonCaption}
                renderEditor={(category, onDone) => (
                  <MenuButtonEditor category={category} onDone={onDone} />
                )}
                emptyText="버튼이 없습니다."
                addPlaceholder={`${row.group.title}에 버튼 추가 (예: 마케팅)`}
              />
            </div>
          </section>
        );
      })}
      <AddFilterRow groups={groups} />
    </div>
  );
};

export default ProgramFilterTab;
