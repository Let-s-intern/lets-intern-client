import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useMentorGuideListQuery } from '@/api/challenge-mentor-guide/challengeMentorGuide';
import { useMentorChallengeListQuery } from '@/api/user/user';
import type { ChallengeMentorGuideItem } from '@/api/challenge-mentor-guide/challengeMentorGuideSchema';
import MuiPagination from '@/common/pagination/MuiPagination';

const PAGE_SIZE = 10;

/** 최근 7일 이내는 "N일 전", 그 이전은 "M월 D일" */
function formatNoticeDate(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays <= 0) return '오늘';
  if (diffDays <= 7) return `${diffDays}일 전`;
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function NoticeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <h1 className="text-medium22 text-neutral-0 font-semibold">공지사항</h1>
      {children}
    </div>
  );
}

function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="검색어를 입력해주세요"
        className="bg-neutral-95 text-xsmall14 text-neutral-0 placeholder:text-neutral-40 focus:border-primary-20 w-full rounded-xl border border-transparent py-3.5 pl-5 pr-12 outline-none transition-colors focus:bg-white"
      />
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        className="text-neutral-40 absolute right-4 top-1/2 -translate-y-1/2"
      >
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
        <path
          d="m20 20-3-3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="m9 6 6 6-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function GuideRow({
  guide,
  challengeName,
}: {
  guide: ChallengeMentorGuideItem;
  challengeName?: string;
}) {
  const hasContents = !!guide.contents;
  const hasLink = !!guide.link;

  const leftLabel = guide.isFixed ? (
    <span className="text-primary text-xxsmall12 font-semibold">중요</span>
  ) : (
    <span className="text-neutral-40 text-xxsmall12">
      {guide.createDate ? formatNoticeDate(guide.createDate) : ''}
    </span>
  );

  const inner = (
    <>
      <div className="flex w-12 shrink-0 justify-center md:w-16">
        {leftLabel}
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="text-xxsmall12 md:text-xsmall14 text-neutral-20 truncate">
          {guide.title}
        </span>
        {challengeName && (
          <span className="border-primary-20 text-primary text-xxsmall12 shrink-0 rounded-full border px-2 py-0.5 font-medium">
            {challengeName}
          </span>
        )}
      </div>
      <span className="text-xxsmall12 text-neutral-40 hidden shrink-0 items-center gap-1 md:flex">
        자세히 보기
        <ChevronRight />
      </span>
    </>
  );

  const rowClass = `flex items-center gap-3 border-b border-neutral-80 px-3 py-3.5 transition-colors md:gap-4 md:px-4 ${
    guide.isFixed ? 'bg-primary-5 hover:bg-primary-10' : 'hover:bg-neutral-95'
  }`;

  if (hasContents) {
    return (
      <Link to={`/notice/${guide.challengeMentorGuideId}`} className={rowClass}>
        {inner}
      </Link>
    );
  }

  return (
    <a
      href={hasLink ? guide.link! : '#'}
      target={hasLink ? '_blank' : undefined}
      rel={hasLink ? 'noopener noreferrer' : undefined}
      className={rowClass}
    >
      {inner}
    </a>
  );
}

export default function NoticeListPage() {
  const { data, isLoading } = useMentorGuideListQuery();
  const guides = data?.challengeMentorGuideList ?? [];
  const { data: challengeData } = useMentorChallengeListQuery();

  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  // challengeId → 챌린지 이름 매핑
  const challengeNameMap = useMemo(() => {
    const map = new Map<number, string>();
    for (const c of challengeData?.myChallengeMentorVoList ?? []) {
      map.set(c.challengeId, c.title);
    }
    return map;
  }, [challengeData]);

  // 노출 가능한 공지만 필터
  const visibleGuides = useMemo(() => {
    const now = new Date();
    return guides.filter((g) => {
      if (g.isVisible === false) return false;
      if (g.dateType === 'CUSTOM') {
        if (g.startDate && new Date(g.startDate) > now) return false;
        if (g.endDate && new Date(g.endDate) < now) return false;
      }
      return true;
    });
  }, [guides]);

  // 고정(중요) 먼저, 각 그룹 내 최신순으로 단일 리스트 구성
  const sortedGuides = useMemo(() => {
    const byDateDesc = (
      a: ChallengeMentorGuideItem,
      b: ChallengeMentorGuideItem,
    ) =>
      new Date(b.createDate ?? 0).getTime() -
      new Date(a.createDate ?? 0).getTime();
    const fixed = visibleGuides.filter((g) => g.isFixed).sort(byDateDesc);
    const normal = visibleGuides.filter((g) => !g.isFixed).sort(byDateDesc);
    return [...fixed, ...normal];
  }, [visibleGuides]);

  const filteredGuides = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sortedGuides;
    return sortedGuides.filter((g) =>
      (g.title ?? '').toLowerCase().includes(q),
    );
  }, [sortedGuides, query]);

  const totalPages = Math.max(1, Math.ceil(filteredGuides.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedGuides = useMemo(
    () =>
      filteredGuides.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
      ),
    [filteredGuides, currentPage],
  );

  const handleSearch = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  return (
    <NoticeLayout>
      <SearchBar value={query} onChange={handleSearch} />

      {isLoading ? (
        <div className="text-xsmall14 text-neutral-40 py-20 text-center">
          불러오는 중...
        </div>
      ) : filteredGuides.length === 0 ? (
        <div className="text-xsmall14 text-neutral-40 py-20 text-center">
          {query.trim() ? '검색 결과가 없습니다.' : '등록된 공지가 없습니다.'}
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <div className="border-neutral-80 flex flex-col border-t">
            {pagedGuides.map((guide) => (
              <GuideRow
                key={guide.challengeMentorGuideId}
                guide={guide}
                challengeName={
                  guide.challengeId
                    ? challengeNameMap.get(guide.challengeId)
                    : undefined
                }
              />
            ))}
          </div>

          {totalPages > 1 && (
            <MuiPagination
              page={currentPage}
              pageInfo={{
                pageNum: currentPage,
                pageSize: PAGE_SIZE,
                totalElements: filteredGuides.length,
                totalPages,
              }}
              onChange={(_, nextPage) => setPage(nextPage)}
            />
          )}
        </div>
      )}
    </NoticeLayout>
  );
}
