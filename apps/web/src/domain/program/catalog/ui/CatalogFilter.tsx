import type {
  ProgramCategoryTargetType,
  PublicProgramCategoryGroup,
} from '@/api/program-category/programCategory';
import clsx from 'clsx';
import {
  CATALOG_TYPES,
  CatalogQuery,
  DEFAULT_CATALOG_TYPE,
} from '../catalogFilter';

/** 멘토링 목록 사이드바와 같은 체크박스 줄 */
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
    className="program_catalog_filter flex shrink-0 items-center gap-2 text-left md:gap-3"
    data-text={label}
  >
    <img
      className="w-6 shrink-0"
      src={`/icons/${selected ? 'checkbox-fill.svg' : 'checkbox-fill-none.svg'}`}
      alt=""
    />
    <span
      className={clsx(
        'whitespace-nowrap text-xsmall16',
        selected ? 'font-semibold text-neutral-0' : 'text-neutral-35',
      )}
    >
      {label}
    </span>
  </button>
);

const Row = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-3 md:gap-5">
    <h2 className="text-1-semibold text-neutral-0">{label}</h2>
    <div className="grid grid-cols-2 gap-x-4 gap-y-3 md:flex md:flex-col">
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
 * 분류 태그 한 줄, 그 아래 프로그램 유형 한 줄.
 * 태그는 여러 개 고르면 하나라도 맞는 상품을 보인다 (match=ANY)
 */
const CatalogFilter = ({ groups, query, onChange }: CatalogFilterProps) => {
  const toggleCategory = (id: number) =>
    onChange({
      ...query,
      categoryIds: query.categoryIds.includes(id)
        ? query.categoryIds.filter((c) => c !== id)
        : [...query.categoryIds, id],
    });
  const selectType = (type: ProgramCategoryTargetType) =>
    onChange({ ...query, type });
  const hasFilter =
    query.categoryIds.length > 0 || query.type !== DEFAULT_CATALOG_TYPE;
  // 분류 줄은 나누지 않고 태그만 한 줄로. 줄 순서·줄 안 순서는 어드민을 따른다
  const tags = groups.flatMap((group) => group.categoryList);

  return (
    <aside className="flex flex-col gap-8 md:w-[200px] md:shrink-0">
      {tags.length > 0 && (
        <Row label="분류">
          {tags.map((category) => (
            <Chip
              key={category.id}
              label={category.title}
              selected={query.categoryIds.includes(category.id)}
              onClick={() => toggleCategory(category.id)}
            />
          ))}
        </Row>
      )}
      <Row label="프로그램 유형">
        {CATALOG_TYPES.map((type) => (
          <Chip
            key={type.key}
            label={type.label}
            selected={query.type === type.key}
            onClick={() => selectType(type.key)}
          />
        ))}
      </Row>
      {hasFilter && (
        <button
          type="button"
          onClick={() =>
            onChange({ ...query, categoryIds: [], type: DEFAULT_CATALOG_TYPE })
          }
          className="self-end text-xsmall14 text-neutral-40 underline"
        >
          필터 초기화
        </button>
      )}
    </aside>
  );
};

export default CatalogFilter;
