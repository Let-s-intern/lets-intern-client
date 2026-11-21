'use client';

import {
  useFilterProgramCategoryGroupsQuery,
  useProgramCategoryTargetsQuery,
} from '@/api/program-category/programCategory';
import AiChat from '@/domain/ai-chat/AiChat';
import { Sparkles } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import type { AiChatItem } from '@/domain/ai-chat/types/aiChat';
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

/** AI 맞춤 탐색 입력창 아래 예시 질문 */
const AI_SUGGESTIONS = [
  '경험 정리가 어려워요',
  '면접 준비가 필요해요',
  '직무를 탐색하고 싶어요',
];

/** AI 추천 상품의 주소에서 목록 카드와 맞출 열쇠(유형-id)를 뽑는다. 주소로 못 맞추면 null */
const toTargetKey = (href: string) => {
  const m = href.match(
    /\/(?:program\/(challenge|live|vod|guidebook)|(all-in-one-pass))\/(\d+)/,
  );
  if (!m) return null;
  return `${(m[1] ?? 'membership').toUpperCase()}-${m[3]}`;
};

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
  const filtered = useMemo(
    () => filterCatalogTargets(targets, query.type, undefined, query.status),
    [targets, query.type, query.status],
  );

  // AI 추천: 추천받은 상품을 필터와 상관없이 목록 맨 앞에 올리고 배지를 단다
  const [aiItems, setAiItems] = useState<AiChatItem[]>([]);
  const handleRecommend = useCallback(
    (items: AiChatItem[]) => setAiItems(items),
    [],
  );
  const recommendedKeys = useMemo(
    () =>
      new Set(
        aiItems
          .map((item) => toTargetKey(item.href))
          .filter(Boolean) as string[],
      ),
    [aiItems],
  );
  const targetKey = (t: { targetType: string; targetId: number }) =>
    `${t.targetType}-${t.targetId}`;
  const list = useMemo(() => {
    if (recommendedKeys.size === 0) return filtered;
    const picked = targets.filter((t) => recommendedKeys.has(targetKey(t)));
    const pickedKeys = new Set(picked.map(targetKey));
    return [
      ...picked,
      ...filtered.filter((t) => !pickedKeys.has(targetKey(t))),
    ];
  }, [targets, filtered, recommendedKeys]);

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
        <p className="flex items-center gap-1 text-xsmall14 font-semibold text-primary">
          <Sparkles size={14} aria-hidden />
          AI 맞춤 탐색
        </p>
        <h2 className="mt-1 text-center text-small20 font-bold text-neutral-0 md:text-medium24">
          어떤 멘토의 도움이 필요하세요?
        </h2>
        <p className="mt-2 text-center text-xsmall14 text-neutral-30">
          상황을 알려주시면 관련 프로그램과 추천 이유를 함께 보여드려요.
        </p>
        <AiChat
          placeholder="자소서를 어디서부터 써야 할지 모르겠어요"
          submitLabel="추천받기"
          suggestions={AI_SUGGESTIONS}
          onRecommend={handleRecommend}
        />
      </section>

      {/* 필터는 왼쪽, 목록은 오른쪽. 모바일은 위아래로 쌓는다 */}
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-10">
        <CatalogFilter groups={groups} query={query} onChange={handleChange} />
        <section className="min-w-0 flex-1">
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
              <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-5 xl:grid-cols-4">
                {list.slice(0, visibleCount).map((target) => (
                  <li key={`${target.targetType}-${target.targetId}`}>
                    <CatalogCard
                      target={target}
                      recommended={recommendedKeys.has(targetKey(target))}
                    />
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
      </div>
    </div>
  );
};

export default ProgramCatalogPage;
