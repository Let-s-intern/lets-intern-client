import type {
  ProgramCategoryTargetType,
  PublicProgramCategoryGroup,
} from '@/api/program-category/programCategory';
import clsx from 'clsx';
import { CATALOG_TYPES, CatalogQuery } from '../catalogFilter';

const Chip = ({
  selected,
  label,
  onClick,
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={selected}
    className={clsx(
      'program_catalog_filter shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xsmall14',
      selected
        ? 'border-primary bg-primary-5 font-semibold text-primary'
        : 'border-neutral-80 text-neutral-20 hover:border-neutral-60',
    )}
    data-text={label}
  >
    {label}
  </button>
);

const Row = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
    <span className="w-24 shrink-0 text-xsmall14 font-semibold text-neutral-10">
      {label}
    </span>
    <div className="-mx-5 flex gap-2 overflow-x-auto px-5 scrollbar-hide md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
      {children}
    </div>
  </div>
);

interface CatalogFilterProps {
  groups: PublicProgramCategoryGroup[];
  query: CatalogQuery;
  onChange: (next: CatalogQuery) => void;
}

/**
 * 노출 목록마다 한 줄(어드민 노출 분류의 필터용 목록), 마지막 줄은 상품 유형.
 * 같은 줄 안은 하나라도, 줄끼리는 전부 맞아야 한다 (match=GROUP)
 */
const CatalogFilter = ({ groups, query, onChange }: CatalogFilterProps) => {
  const toggleCategory = (id: number) =>
    onChange({
      ...query,
      categoryIds: query.categoryIds.includes(id)
        ? query.categoryIds.filter((c) => c !== id)
        : [...query.categoryIds, id],
    });
  const selectType = (type: ProgramCategoryTargetType | null) =>
    onChange({ ...query, type });
  const hasFilter = query.categoryIds.length > 0 || query.type !== null;

  return (
    <div className="flex flex-col gap-4 rounded-md border border-neutral-85 px-5 py-5 md:px-6">
      {groups
        .filter((group) => group.categoryList.length > 0)
        .map((group) => (
          <Row key={group.id} label={group.title}>
            {group.categoryList.map((category) => (
              <Chip
                key={category.id}
                label={category.title}
                selected={query.categoryIds.includes(category.id)}
                onClick={() => toggleCategory(category.id)}
              />
            ))}
          </Row>
        ))}
      <Row label="프로그램 유형">
        {CATALOG_TYPES.map((type) => (
          <Chip
            key={type.label}
            label={type.label}
            selected={query.type === type.key}
            onClick={() => selectType(type.key)}
          />
        ))}
      </Row>
      {hasFilter && (
        <button
          type="button"
          onClick={() => onChange({ ...query, categoryIds: [], type: null })}
          className="self-end text-xsmall14 text-neutral-40 underline"
        >
          필터 초기화
        </button>
      )}
    </div>
  );
};

export default CatalogFilter;
