'use client';

import { useState } from 'react';

import {
  type LiveMentorSort,
  useLiveMentorInfiniteListQuery,
} from '@/api/live-mentoring/liveMentoring';
import type { LiveMentoringCategory } from '@/api/live-mentoring/liveMentoringSchema';
import LiveMentoringFilterSideBar from './LiveMentoringFilterSideBar';
import LoadMoreSentinel from './LoadMoreSentinel';
import MentorCard from './MentorCard';
import MentoringCurationSection from './MentoringCurationSection';
import SortSelect from './SortSelect';

/**
 * 1대1 라이브 멘토링 카탈로그 (PRD §5 S1).
 *
 * 프로그램 목록의 `catalog=mentoring` 탭 본문으로 렌더된다.
 * 좌측 멘토링 전용 필터 + 그리드 + 정렬. 12개씩 무한 스크롤로 이어 붙인다.
 */
const LiveMentoringListPage = () => {
  const [categories, setCategories] = useState<LiveMentoringCategory[]>([]);
  const [sort, setSort] = useState<LiveMentorSort>('LATEST');

  // 서버가 `one-indexed-parameters: true` 라 page 는 1부터 이어 받는다
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useLiveMentorInfiniteListQuery({ categories, sort });
  const openings = data?.pages.flatMap((page) => page.openingList) ?? [];

  const handleToggleCategory = (category: LiveMentoringCategory) => {
    setCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const handleSortChange = (next: LiveMentorSort) => {
    setSort(next);
  };

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:gap-16">
      <LiveMentoringFilterSideBar
        selected={categories}
        onToggle={handleToggleCategory}
      />

      <main className="flex min-w-0 flex-1 flex-col gap-5 md:gap-6">
        <MentoringCurationSection />
        <div className="flex items-center justify-end">
          <SortSelect value={sort} onChange={handleSortChange} />
        </div>

        {isError ? (
          <p className="py-20 text-center text-neutral-40">
            멘토 목록을 불러오지 못했습니다.
          </p>
        ) : isLoading ? (
          <p className="py-20 text-center text-neutral-40">불러오는 중…</p>
        ) : openings.length > 0 ? (
          <>
            {/* 카드가 grid-rows-subgrid 로 행 높이를 공유하므로 래퍼 없이 직속 자식으로 둔다 */}
            <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-4 md:gap-y-11">
              {openings.map((opening) => (
                <MentorCard key={opening.openingId} opening={opening} />
              ))}
            </div>
            {hasNextPage && !isFetchingNextPage && (
              <LoadMoreSentinel
                key={openings.length}
                onVisible={() => fetchNextPage()}
              />
            )}
            {isFetchingNextPage && (
              <p className="py-6 text-center text-neutral-40">불러오는 중…</p>
            )}
          </>
        ) : (
          <p className="py-20 text-center text-neutral-40">
            해당 조건의 멘토가 없습니다.
          </p>
        )}
      </main>
    </div>
  );
};

export default LiveMentoringListPage;
