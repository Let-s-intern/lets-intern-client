'use client';

import { ProgramTypeEnum } from '@/schema';
import ReviewFilter from '@components/common/review/ReviewFilter';
import { Suspense, useState } from 'react';
import BlogReviewListSection from './BlogReviewListSection';

const { CHALLENGE, LIVE, REPORT } = ProgramTypeEnum.enum;

const filterList = [
  {
    caption: '챌린지',
    value: CHALLENGE,
  },
  {
    caption: 'LIVE 클래스',
    value: LIVE,
  },
  {
    caption: '서류 피드백 REPORT',
    value: REPORT,
  },
];

function BlogReviewWrapper() {
  const [page, setPage] = useState(1);

  return (
    <Suspense>
      <div className="py-6 md:pt-0">
        <ReviewFilter
          label="프로그램 유형"
          labelValue="type"
          list={filterList}
          className="program_filter"
          multiSelect
          dropdownClassName="max-w-fit"
          onChange={() => setPage(1)} // 필터 변경 시 페이지 초기화
        />
      </div>
      <BlogReviewListSection page={page} setPage={setPage} />
    </Suspense>
  );
}

export default BlogReviewWrapper;
