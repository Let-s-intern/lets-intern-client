'use client';

import FilterDropdown from '@/common/dropdown/FilterDropdown';
import MuiPagination from '@/domain/program/pagination/MuiPagination';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import LibraryCard from './card/LibraryCard';
import LibraryTabNav from './ui/LibraryTabNav';

const TABS = [
  { label: '자료집 콘텐츠', value: 'contents' },
  { label: 'MY 자료집', value: 'my' },
];

// TODO: API 연동 시 실제 카테고리로 변경
const CATEGORY_FILTER_LIST = [
  { caption: '카테고리 1', value: 'CATEGORY_1' },
  { caption: '카테고리 2', value: 'CATEGORY_2' },
  { caption: '카테고리 3', value: 'CATEGORY_3' },
  { caption: '카테고리 4', value: 'CATEGORY_4' },
  { caption: '카테고리 5', value: 'CATEGORY_5' },
];

function Content() {
  const params = useSearchParams();
  const [activeTab, setActiveTab] = useState('contents');
  const [page, setPage] = useState(1);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* 탭 + 필터 */}
      <div className="flex items-center justify-between">
        <LibraryTabNav
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        <FilterDropdown
          label="콘텐츠 카테고리"
          list={CATEGORY_FILTER_LIST}
          paramKey="category"
          multiSelect
          onChange={() => setPage(1)}
          dropdownClassName="max-w-fit right-0"
        />
      </div>

      {/* 카드 그리드 */}
      <LibraryGrid />

      {/* 페이지네이션 */}
      {/* TODO: API 연동 시 실제 pageInfo로 변경 */}
      <MuiPagination
        className="flex justify-center"
        page={page}
        pageInfo={{ totalPages: 4, totalElements: 16, pageNum: 1, pageSize: 16 }}
        onChange={(_, newPage) => {
          setPage(newPage);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}

// TODO: API 연동 시 실제 데이터로 변경
function LibraryGrid() {
  return (
    <div className="grid grid-cols-1 gap-y-[54px] md:grid-cols-4 md:gap-x-5">
      <LibraryCard
        href="/library/1"
        thumbnail={undefined}
        category="카테고리 분류"
        title="제목이 한줄 일때"
        date="2025. 01. 30"
        status="upcoming"
      />
      <LibraryCard
        href="/library/2"
        thumbnail={undefined}
        category="카테고리 분류"
        title="제목이 들어갑니다 제목이 들어갑니다 제목이 들어갑니다 제목이 들어갑니다 제목"
        date="2025. 01. 30"
        status="notified"
      />
      <LibraryCard
        href="/library/3"
        thumbnail={undefined}
        category="카테고리 분류"
        title="나의 경험을 200% 활용하여 제작하는 자기소개서 2주 완성 챌린지"
      />
      <LibraryCard
        href="/library/4"
        thumbnail={undefined}
        category="카테고리 분류"
        title="제목이 들어갑니다 제목이 들어갑니다 제목이 들어갑니다 제목이 들어갑니다 제목"
        date="2025. 01. 30"
        status="published"
      />
    </div>
  );
}

export default function LibraryListContent() {
  return (
    <Suspense>
      <Content />
    </Suspense>
  );
}
