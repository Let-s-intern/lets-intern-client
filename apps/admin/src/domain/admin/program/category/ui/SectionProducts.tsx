import { Checkbox, ListSubheader, MenuItem, Select } from '@mui/material';
import { SOURCES_HELP, SOURCES_LABEL, SOURCES_TAG } from '../constants/wording';
import { usePublicCategoryTargets } from '../hooks/usePublicCategoryTargets';
import ProgramCategoryTargetList from '../ProgramCategoryTargetList';
import {
  programCategoryTargetTypeLabel,
  type ProgramCategory,
  type ProgramCategoryGroup,
  type ProgramCategoryTargetType,
} from '../programCategoryApi';
import { filterRowsOf } from '../utils/placementUtils';

const title = 'text-xsmall14 font-semibold text-neutral-10';

/** 고른 필터 버튼에서 오는 상품. 읽기 전용이다 */
const PulledProducts = ({ sourceIds }: { sourceIds: number[] }) => {
  const { data: targets = [], isLoading } = usePublicCategoryTargets(
    sourceIds,
    true,
  );
  if (sourceIds.length === 0) return null;
  if (isLoading)
    return <p className="text-xxsmall12 text-neutral-40">불러오는 중…</p>;
  if (targets.length === 0)
    return (
      <p className="text-xxsmall12 text-neutral-40">
        고른 버튼에 연결된 상품이 아직 없어요.
      </p>
    );
  return (
    <ul className="flex flex-col">
      {targets.map((t) => (
        <li
          key={`${t.targetType}-${t.targetId}`}
          className="flex items-center gap-2 py-1 text-xsmall14"
        >
          <span className="shrink-0 rounded-xs bg-neutral-95 px-1.5 text-neutral-40">
            {programCategoryTargetTypeLabel[
              t.targetType as ProgramCategoryTargetType
            ] ?? t.targetType}
          </span>
          <span className="truncate text-neutral-10">{t.title}</span>
          <span className="ml-auto shrink-0 rounded-xs bg-primary-5 px-1.5 text-xxsmall12 text-primary">
            {SOURCES_TAG}
          </span>
        </li>
      ))}
    </ul>
  );
};

/**
 * 섹션 상품을 넣는 두 방법을 나란히 둔다.
 * 직접 고르기 = 이 카테고리에 연결된 상품, 필터 버튼에서 가져오기 = sourceCategoryIds
 */
const SectionProducts = ({
  category,
  groups,
  sources,
  onSourcesChange,
}: {
  category: ProgramCategory;
  groups: ProgramCategoryGroup[];
  sources: number[];
  onSourcesChange: (ids: number[]) => void;
}) => {
  const filterGroups = [
    ...new Map(filterRowsOf(groups).map((r) => [r.group.id, r.group])).values(),
  ];
  const filterIds = new Set(
    filterGroups.flatMap((g) => g.categoryList.map((c) => c.id)),
  );
  // 예전에 필터가 아닌 카테고리를 골라 둔 경우도 지우지 않고 보여준다
  const others = groups.flatMap((g) =>
    g.categoryList
      .filter((c) => sources.includes(c.id) && !filterIds.has(c.id))
      .map((c) => ({ group: g, category: c })),
  );
  const labelOf = new Map(
    groups.flatMap((g) =>
      g.categoryList.map((c) => [c.id, `${g.title} > ${c.title}`] as const),
    ),
  );

  return (
    <div className="flex flex-col gap-2">
      <span className={title}>상품</span>
      {category.programCount === 0 && sources.length === 0 && (
        <p className="text-xsmall14 text-neutral-30">
          이 섹션에 보일 상품을 넣어 주세요. 직접 고르거나, 필터 버튼의 상품을
          가져올 수 있어요.
        </p>
      )}
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-1 rounded-xs bg-white p-3">
          <span className={title}>직접 고르기</span>
          <p className="text-xxsmall12 text-neutral-40">
            각 상품 수정 화면의 &quot;노출 분류&quot;에서 이 섹션을 체크하면
            여기에 들어와요.
          </p>
          <ProgramCategoryTargetList categoryId={category.id} />
        </div>
        <div className="flex min-w-0 flex-col gap-2 rounded-xs bg-white p-3">
          <span className={title}>{SOURCES_LABEL}</span>
          <p className="text-xxsmall12 text-neutral-40">{SOURCES_HELP}</p>
          <Select
            size="small"
            multiple
            displayEmpty
            value={sources}
            onChange={(e) => onSourcesChange(e.target.value as number[])}
            renderValue={(ids) =>
              ids.length === 0
                ? '버튼 고르기'
                : ids.map((id) => labelOf.get(id) ?? `#${id}`).join(', ')
            }
          >
            {filterGroups.flatMap((g) => [
              <ListSubheader key={`g-${g.id}`}>{g.title}</ListSubheader>,
              ...g.categoryList
                .filter((c) => c.id !== category.id)
                .map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    <Checkbox size="small" checked={sources.includes(c.id)} />
                    {g.title} &gt; {c.title}
                  </MenuItem>
                )),
            ])}
            {others.length > 0 && (
              <ListSubheader>
                필터가 아닌 카테고리 (예전에 고른 것)
              </ListSubheader>
            )}
            {others.map(({ group, category: c }) => (
              <MenuItem key={c.id} value={c.id}>
                <Checkbox size="small" checked />
                {group.title} &gt; {c.title}
              </MenuItem>
            ))}
          </Select>
          <PulledProducts sourceIds={sources} />
        </div>
      </div>
    </div>
  );
};

export default SectionProducts;
