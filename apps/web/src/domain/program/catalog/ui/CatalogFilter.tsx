import type {
  ProgramCategoryTargetType,
  PublicProgramCategoryGroup,
} from '@/api/program-category/programCategory';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
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
  // 모바일은 체크박스가 목록을 한참 밀어내서 필터 버튼 아래로 접어 둔다. 데스크톱은 늘 펼친 사이드바
  const [isOpen, setIsOpen] = useState(false);
  const filterCount =
    query.categoryIds.length + (query.type !== DEFAULT_CATALOG_TYPE ? 1 : 0);

  return (
    <aside className="flex flex-col gap-4 md:w-[200px] md:shrink-0 md:gap-8">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className="flex items-center justify-between rounded-xs border border-neutral-85 px-4 py-3 text-xsmall16 font-semibold text-neutral-0 md:hidden"
      >
        <span>
          필터
          {filterCount > 0 && (
            <span className="ml-1 text-primary">{filterCount}</span>
          )}
        </span>
        <ChevronDown
          size={20}
          className={clsx('transition-transform', isOpen && 'rotate-180')}
        />
      </button>
      <div
        className={clsx('flex-col gap-8 md:flex', isOpen ? 'flex' : 'hidden')}
      >
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
              onChange({
                ...query,
                categoryIds: [],
                type: DEFAULT_CATALOG_TYPE,
              })
            }
            className="self-end text-xsmall14 text-neutral-40 underline"
          >
            필터 초기화
          </button>
        )}
      </div>
    </aside>
  );
};

export default CatalogFilter;
