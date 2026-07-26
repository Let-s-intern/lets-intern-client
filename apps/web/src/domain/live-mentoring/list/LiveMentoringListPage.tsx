'use client';

import { useState } from 'react';

import {
  type LiveMentorCategoryFilter,
  type LiveMentorSort,
  useLiveMentorListQuery,
} from '@/api/live-mentoring/liveMentoring';
import MuiPagination from '@/common/pagination/MuiPagination';
import CategoryFilter from './CategoryFilter';
import MentorCard from './MentorCard';
import SortSelect from './SortSelect';

/**
 * 공개 1대1 라이브 멘토링 리스트 (PRD §5 S1).
 * 3×3=9개/페이지 그리드 + 카테고리 필터 + 정렬 + 페이징.
 * 서버 컴포넌트 라우트(page.tsx)가 이 클라이언트 컴포넌트를 렌더한다.
 */
const LiveMentoringListPage = () => {
  // 서버가 `one-indexed-parameters: true` 라 페이지 번호는 1-based로 다룬다.
  // (MuiPagination 도 1-based라 변환 없이 그대로 주고받는다.)
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<LiveMentorCategoryFilter>('ALL');
  const [sort, setSort] = useState<LiveMentorSort>('LATEST');

  const { data, isLoading, isError } = useLiveMentorListQuery({
    page,
    category,
    sort,
  });

  const handleCategoryChange = (next: LiveMentorCategoryFilter) => {
    setCategory(next);
    setPage(1);
  };

  const handleSortChange = (next: LiveMentorSort) => {
    setSort(next);
    setPage(1);
  };

  return (
    <div className="mw-1180 flex flex-col gap-6 px-5 py-10">
      <header className="flex flex-col gap-1">
        <h1 className="text-medium22 md:text-medium24 font-bold">
          1대1 라이브 멘토링
        </h1>
        <p className="text-neutral-40 text-xsmall14">
          현직자 멘토와 1:1로 자기소개서·이력서·포트폴리오를 점검하세요.
        </p>
      </header>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <CategoryFilter value={category} onChange={handleCategoryChange} />
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
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.openingList.map((opening) => (
              <li key={opening.id}>
                <MentorCard opening={opening} />
              </li>
            ))}
          </ul>
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
    </div>
  );
};

export default LiveMentoringListPage;
