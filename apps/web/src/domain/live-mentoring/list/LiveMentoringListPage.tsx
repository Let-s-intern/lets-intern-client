'use client';

import { useState } from 'react';

import {
  type LiveMentorSort,
  useLiveMentorListQuery,
} from '@/api/live-mentoring/liveMentoring';
import type { LiveMentoringCategory } from '@/api/live-mentoring/liveMentoringSchema';
import MuiPagination from '@/common/pagination/MuiPagination';
import LiveMentoringFilterSideBar from './LiveMentoringFilterSideBar';
import MentorCard from './MentorCard';
import SortSelect from './SortSelect';

/**
 * 1대1 라이브 멘토링 카탈로그 (PRD §5 S1).
 *
 * 프로그램 목록의 `catalog=mentoring` 탭 본문으로 렌더된다.
 * 좌측 멘토링 전용 필터 + 4×3=12개/페이지 그리드 + 정렬 + 페이징.
 */
const LiveMentoringListPage = () => {
  // 서버가 `one-indexed-parameters: true` 라 페이지 번호는 1-based로 다룬다.
  // (MuiPagination 도 1-based라 변환 없이 그대로 주고받는다.)
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState<LiveMentoringCategory[]>([]);
  const [sort, setSort] = useState<LiveMentorSort>('LATEST');

  const { data, isLoading, isError } = useLiveMentorListQuery({
    page,
    categories,
    sort,
  });

  const handleToggleCategory = (category: LiveMentoringCategory) => {
    setCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
    setPage(1);
  };

  const handleSortChange = (next: LiveMentorSort) => {
    setSort(next);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:gap-16">
      <LiveMentoringFilterSideBar
        selected={categories}
        onToggle={handleToggleCategory}
      />

      <main className="flex min-w-0 flex-1 flex-col gap-5 md:gap-6">
        <div className="flex items-center justify-end">
          <SortSelect value={sort} onChange={handleSortChange} />
        </div>

        {isError ? (
          <p className="text-neutral-40 py-20 text-center">
            멘토 목록을 불러오지 못했습니다.
          </p>
        ) : isLoading ? (
          <p className="text-neutral-40 py-20 text-center">불러오는 중…</p>
        ) : data && data.openingList.length > 0 ? (
          <>
            {/* 카드가 grid-rows-subgrid 로 행 높이를 공유하므로 래퍼 없이 직속 자식으로 둔다 */}
            <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-4 md:gap-y-11">
              {data.openingList.map((opening) => (
                <MentorCard key={opening.id} opening={opening} />
              ))}
            </div>
            {data.pageInfo.totalPages > 1 && (
              <MuiPagination
                className="mt-6"
                pageInfo={{ totalPages: data.pageInfo.totalPages }}
                page={page}
                onChange={(_, next) => setPage(next)}
              />
            )}
          </>
        ) : (
          <p className="text-neutral-40 py-20 text-center">
            해당 조건의 멘토가 없습니다.
          </p>
        )}
      </main>
    </div>
  );
};

export default LiveMentoringListPage;
