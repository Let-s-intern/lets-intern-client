'use client';

import {
  useFilterProgramCategoryGroupsQuery,
  useProgramCategoryTargetsQuery,
} from '@/api/program-category/programCategory';
import CouponBanner from '@/common/banner/CouponBanner';
import AiChat from '@/domain/ai-chat/AiChat';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import clsx from 'clsx';
import {
  CATALOG_STATUSES,
  CatalogQuery,
  DEFAULT_CATALOG_TYPE,
  filterCatalogTargets,
  parseCatalogQuery,
  toCatalogSearch,
} from './catalogFilter';
import CatalogCard from './ui/CatalogCard';
import CatalogFilter from './ui/CatalogFilter';
import LoadMoreSentinel from './ui/LoadMoreSentinel';

/** 처음 보이는 카드 수와 스크롤로 한 번에 늘어나는 수 */
const PAGE_SIZE = 12;

/**
 * 전체 프로그램 목록. 어드민 노출 분류(필터용)에 걸린 상품을 한 번에 받아 그린다.
 * 필터를 안 고르면 모든 필터용 카테고리의 상품, 고르면 고른 태그 중 하나라도 맞는 상품(match=ANY).
 * 챌린지는 기수·버전과 관계없이 한 장이다
 */
const ProgramCatalogPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: groups = [] } = useFilterProgramCategoryGroupsQuery();

  const query = useMemo(
    () => parseCatalogQuery(new URLSearchParams(searchParams), groups),
    [searchParams, groups],
  );
  const allCategoryIds = useMemo(
    () => groups.flatMap((g) => g.categoryList.map((c) => c.id)),
    [groups],
  );
  const hasCategory = query.categoryIds.length > 0;
  const { data: targets = [], isLoading } = useProgramCategoryTargetsQuery(
    hasCategory ? query.categoryIds : allCategoryIds,
    'ANY',
  );
  const list = useMemo(
    () => filterCatalogTargets(targets, query.type, undefined, query.status),
    [targets, query.type, query.status],
  );

  const search = toCatalogSearch(query);
  // 필터가 바뀌면 처음 개수로 돌아간다
  const [paging, setPaging] = useState({ search, count: PAGE_SIZE });
  const visibleCount = paging.search === search ? paging.count : PAGE_SIZE;

  const handleChange = (next: CatalogQuery) => {
    const nextSearch = toCatalogSearch(next);
    router.replace(nextSearch ? `${pathname}?${nextSearch}` : pathname, {
      scroll: false,
    });
  };

  return (
    <div className="flex flex-col gap-8 px-5 md:gap-10 md:px-0">
      <section className="flex flex-col items-center">
        <h2 className="text-center text-small20 font-bold text-neutral-0 md:text-medium24">
          어떤 프로그램을 찾고 있나요?
        </h2>
        <AiChat />
      </section>

      <CatalogFilter groups={groups} query={query} onChange={handleChange} />

      <section>
        <nav className="mb-5 flex gap-5 border-b border-neutral-85">
          {CATALOG_STATUSES.map((tab) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => handleChange({ ...query, status: tab.key })}
              className={clsx(
                'program_catalog_status -mb-px border-b-2 pb-2 text-small18 font-semibold',
                (query.status ?? null) === tab.key
                  ? 'border-neutral-0 text-neutral-0'
                  : 'border-transparent text-neutral-50',
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <p className="text-xsmall14 text-neutral-30">
          프로그램{' '}
          <span className="font-semibold text-primary">{list.length}</span>개
        </p>
        {isLoading ? (
          <p className="py-20 text-center text-xsmall14 text-neutral-40">
            불러오는 중…
          </p>
        ) : list.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20">
            <p className="text-xsmall14 text-neutral-40">
              조건에 맞는 프로그램이 없어요.
            </p>
            <button
              type="button"
              onClick={() =>
                handleChange({
                  categoryIds: [],
                  type: DEFAULT_CATALOG_TYPE,
                  status: null,
                })
              }
              className="text-xsmall14 text-primary underline"
            >
              필터 초기화
            </button>
          </div>
        ) : (
          <>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-x-5">
              {list.slice(0, visibleCount).map((target) => (
                <li key={`${target.targetType}-${target.targetId}`}>
                  <CatalogCard target={target} />
                </li>
              ))}
            </ul>
            {visibleCount < list.length && (
              <LoadMoreSentinel
                key={visibleCount}
                onVisible={() =>
                  setPaging({ search, count: visibleCount + PAGE_SIZE })
                }
              />
            )}
          </>
        )}
      </section>

      <CouponBanner />
    </div>
  );
};

export default ProgramCatalogPage;
