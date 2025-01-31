'use client';

import { ProgramTypeEnum } from '@/schema';
import ReviewFilter from '@components/common/review/ReviewFilter';
import { Suspense } from 'react';
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
  return (
    <>
      <div className="py-6">
        <Suspense>
          <ReviewFilter
            label="프로그램 후기"
            labelValue="type"
            list={filterList}
            multiSelect
          />
        </Suspense>
      </div>
      <BlogReviewListSection />
    </>
  );
}

export default BlogReviewWrapper;
