'use client';

import { Suspense } from 'react';

import { ProgramTypeEnum } from '@/schema';
import ReviewFilter from '@components/common/review/ReviewFilter';
import BlogReviewListSection from './BlogReviewListSection';

const { CHALLENGE, LIVE, REPORT, VOD} = ProgramTypeEnum.enum;

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

interface Props {
  htmlText?: string;
}

function BlogReviewWrapper({ htmlText }: Props) {
  // useEffect(() => {
  //   // [테스트] 파비콘 가져오기
  //   const domParser = new DOMParser();
  //   const document = domParser.parseFromString(htmlText, 'text/html');
  //   const link = document.querySelector("link[rel='icon']") as HTMLLinkElement;
  //   console.log('href:', link.href);
  // }, [htmlText]);

  return (
    <Suspense>
      <div className="py-6">
        <ReviewFilter
          label="프로그램 후기"
          labelValue="type"
          list={filterList}
          multiSelect
        />
      </div>
      <BlogReviewListSection />
    </Suspense>
  );
}

export default BlogReviewWrapper;
