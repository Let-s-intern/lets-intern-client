'use client';

import { ProgramTypeEnum, ProgramTypeUpperCase } from '@/schema';
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
  const [types, setTypes] = useState<string[]>([]);

  const handleSelect = (value: string) => {
    const checked = !types.some((type) => type === value);

    if (checked) setTypes((prev) => [...prev, value]);
    else setTypes((prev) => prev.filter((type) => type !== value));
  };

  return (
    <>
      <div className="py-6">
        <Suspense>
          <ReviewFilter
            label="프로그램 후기"
            list={filterList}
            multiSelect
            onSelect={handleSelect}
          />
        </Suspense>
      </div>
      <BlogReviewListSection types={types as ProgramTypeUpperCase[]} />
    </>
  );
}

export default BlogReviewWrapper;
