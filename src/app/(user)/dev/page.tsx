import { GetReview } from '@/api/review';
import FilterDropdown from '@/common/dropdown/FilterDropdown';
import MoreHeader from '@/common/header/MoreHeader';
import ReviewSection from '@/domain/about/v1/section/ReviewSection';
import ReviewCard from '@/domain/review/ReviewCard';
import { Metadata } from 'next';
import Image from 'next/image';
import { Suspense } from 'react';
import img from './font-test.png';
import TextAreaTest from './text-area-test';

export const metadata: Metadata = {
  robots: 'noindex, nofollow',
};

const mock1: GetReview = {
  reviewInfo: {
    reviewId: 1,
    type: 'MISSION_REVIEW',
    programTitle: '기필코 챌린지',
    challengeType: 'DOCUMENT_PREPARATION',
    createDate: '2021-09-01',
    missionTh: 1,
    missionTitle:
      '미션명 미션명 미션명 미션명 미션명 미션명 미션명 미션명미션명',
    name: '임호정',
    programThumbnail: 'https://placehold.co/600x400',
    wishCompany: 'PM',
    wishJob: 'IT',
  },
  reviewItemList: [
    {
      reviewItemId: 1,
      answer:
        '진짜 너무 미친 퀄리티 너무 좋았다. 내인생에 이런 챌린지는 없다 최고다 렛츠커리어 짱이다 진짜 너무 미친 퀄리티 너무 좋았다. 내인생에 이런 챌린지는 없다 최고다 렛츠커리어 짱이다 내인생에 이런 챌린지는 없다 내인생에 이런 챌린지는 없다',
      questionType: 'WORRY',
    },
  ],
};

const mock3: GetReview = {
  reviewInfo: {
    reviewId: 1,
    type: 'LIVE_REVIEW',
    programTitle:
      '기필코 챌린지 aksd fasdf kalsdfk lsf akldf asldf jaksldfj laksd fk',
    challengeType: 'DOCUMENT_PREPARATION',
    createDate: '2021-09-01',
    missionTh: 1,
    missionTitle:
      '미션명 미션명 미션명 미션명 미션명 미션명 미션명 미션명미션명',
    name: '임호정',
    programThumbnail: 'https://placehold.co/600x400',
    wishCompany: 'PM',
    wishJob: 'IT',
  },
  reviewItemList: [
    {
      reviewItemId: 1,
      answer:
        '진짜 너무 미친 퀄리티 너무 좋았다. 내인생에 이런 챌린지는 없다 최고다 렛츠커리어 짱이다 진짜 너무 미친 퀄리티 너무 좋았다. 내인생에 이런 챌린지는 없다 최고다 렛츠커리어 짱이다 내인생에 이런 챌린지는 없다 내인생에 이런 챌린지는 없다 진짜 너무 미친 퀄리티 너무 좋았다. 내인생에 이런 챌린지는 없다 최고다 렛츠커리어 짱이다 진짜 너무 미친 퀄리티 너무 좋았다. 내인생에 이런 챌린지는 없다 최고다 렛츠커리어 짱이다 내인생에 이런 챌린지는 없다 내인생에 이런 챌린지는 없다 진짜 너무 미친 퀄리티 너무 좋았다. 내인생에 이런 챌린지는 없다 최고다 렛츠커리어 짱이다 진짜 너무 미친 퀄리티 너무 좋았다. 내인생에 이런 챌린지는 없다 최고다 렛츠커리어 짱이다 내인생에 이런 챌린지는 없다 내인생에 이런 챌린지는 없다',
      questionType: 'WORRY',
    },
  ],
};

const mock4: GetReview = {
  reviewInfo: {
    reviewId: 1,
    type: 'REPORT_REVIEW',
    programTitle: '기필코 챌린지',
    challengeType: 'DOCUMENT_PREPARATION',
    createDate: '2021-09-01',
    missionTh: 1,
    missionTitle:
      '미션명 미션명 미션명 미션명 미션명 미션명 미션명 미션명미션명',
    name: '임호정',
    programThumbnail: 'https://placehold.co/600x400',
    wishCompany: 'IT',
    wishJob: 'PM',
  },
  reviewItemList: [
    {
      reviewItemId: 1,
      answer:
        '진짜 너무 미친 퀄리티 너무 좋았다. 내인생에 이런 챌린지는 없다 최고다 렛츠커리어 짱이다 진짜 너무 미친 퀄리티 너무 좋았다. 내인생에 이런 챌린지는 없다 최고다 렛',
      questionType: 'WORRY',
    },
  ],
};

const singleReviewFilterList = [
  {
    caption: '전체',
    value: 'all',
  },
  {
    caption: '긍정적 리뷰',
    value: 'positive',
  },
  {
    caption: '부정적 리뷰',
    value: 'negative',
  },
  {
    caption: '일부 리뷰',
    value: 'some',
  },
];

const multiReviewFilterList = [
  {
    caption: '긍정적 리뷰',
    value: 'positive',
  },
  {
    caption: '부정적 리뷰',
    value: 'negative',
  },
  {
    caption: '일부 리뷰',
    value: 'some',
  },
];

const Page = () => {
  return (
    <div className="mx-auto my-20 max-w-[844px]">
      <div className="grid grid-cols-3 gap-5">
        <ReviewCard review={mock1} missionTitleClamp={1} />
        {/* <ReviewCard review={mock2} missionTitleClamp={1} /> */}
        <ReviewCard expandable review={mock3} missionTitleClamp={1} />
        <ReviewCard expandable review={mock4} missionTitleClamp={1} />
      </div>
      <div>
        <ReviewCard
          expandable
          review={mock4}
          missionTitleClamp={1}
          reviewItemLineClamp={2}
          showThumbnail
        />
      </div>
      <MoreHeader
        subtitle="4개"
        href="/review/program"
        gaText="프로그램 참여 후기"
      >
        프로그램 참여 후기{' '}
      </MoreHeader>
      <div className="my-20">
        <Suspense>
          <FilterDropdown
            label="나는 필터야"
            paramKey="filter"
            list={singleReviewFilterList}
          />
          <FilterDropdown
            label="나는 필터야"
            paramKey="filter"
            list={multiReviewFilterList}
            multiSelect
          />
        </Suspense>
      </div>

      <div className="my-20 flex gap-2 text-xsmall14 text-neutral-20">
        <div>
          {/* <p className="font-thin">
          폰트 테스트입니다. 14px 가나다라마바사 abcdefg ABCDEFG -_=
        </p> */}
          {/* <p className="font-extralight">
          폰트 테스트입니다. 14px 가나다라마바사 abcdefg ABCDEFG -_=
        </p> */}
          <p className="font-light leading-[22px]">
            폰트 테스트입니다. 14px 가나다라마바사 abcdefg ABCDEFG -_=
          </p>
          <p className="font-normal leading-[22px]">
            폰트 테스트입니다. 14px 가나다라마바사 abcdefg ABCDEFG -_=
          </p>
          <p className="font-medium leading-[20px]">
            폰트 테스트입니다. 14px 가나다라마바사 abcdefg ABCDEFG -_=
          </p>
          <p className="font-semibold leading-[20px]">
            폰트 테스트입니다. 14px 가나다라마바사 abcdefg ABCDEFG -_=
          </p>
          <p className="font-bold leading-[20px]">
            폰트 테스트입니다. 14px 가나다라마바사 abcdefg ABCDEFG -_=
          </p>
          {/* <p className="font-extrabold">
          폰트 테스트입니다. 14px 가나다라마바사 abcdefg ABCDEFG -_=
        </p>
        <p className="font-black">
          폰트 테스트입니다. 14px 가나다라마바사 abcdefg ABCDEFG -_=
        </p> */}
        </div>
        <div className="pt-1.5">
          <Image src={img} width={367} unoptimized alt="ho" />
        </div>
      </div>
      <hr className="my-10"></hr>
      <h2 className="text-2xl font-semibold">TextArea 테스트</h2>
      <TextAreaTest />
      <hr className="my-10"></hr>
      <h2 className="text-2xl font-semibold">ReviewSection 테스트</h2>
      <ReviewSection />
    </div>
  );
};

export default Page;
