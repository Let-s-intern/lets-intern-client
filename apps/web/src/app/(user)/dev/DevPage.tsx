'use client';

import { useGetUserAdmin } from '@/api/user/user';
import { GetReview } from '@/api/review/review';
import FilterDropdown from '@/common/dropdown/FilterDropdown';
import MoreHeader from '@/common/header/MoreHeader';
import ReviewSection from '@/domain/about/section/ReviewSection';
import ReviewCard from '@/domain/review/ui/ReviewCard';
import useAuthStore from '@/store/useAuthStore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import img from './font-test.png';
import TextAreaTest from './text-area-test';

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
  { caption: '전체', value: 'all' },
  { caption: '긍정적 리뷰', value: 'positive' },
  { caption: '부정적 리뷰', value: 'negative' },
  { caption: '일부 리뷰', value: 'some' },
];

const multiReviewFilterList = [
  { caption: '긍정적 리뷰', value: 'positive' },
  { caption: '부정적 리뷰', value: 'negative' },
  { caption: '일부 리뷰', value: 'some' },
];

export default function DevPage() {
  const { isLoggedIn, isInitialized } = useAuthStore();
  const { data: isAdmin, isLoading } = useGetUserAdmin({
    enabled: isLoggedIn,
    retry: 1,
  });

  if (!isInitialized) return null;
  if (!isLoggedIn) return <NotAdminPrompt />;
  if (isLoading) return null;
  if (!isAdmin) return <NotAdminPrompt />;

  return <DevPageContent />;
}

function DevPageContent() {
  return (
    <div className="mx-auto my-20 max-w-[844px]">
      <div className="grid grid-cols-3 gap-5">
        <ReviewCard review={mock1} missionTitleClamp={1} />
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

      <div className="text-xsmall14 text-neutral-20 my-20 flex gap-2">
        <div>
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
}

function NotAdminPrompt() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-2 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              className="text-amber-500"
            >
              <path
                d="M12 9v4m0 4h.01"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-lg font-bold text-neutral-900">
            관리자 전용 페이지입니다
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-neutral-500">
            이 페이지는 관리자 권한이 있는 계정만 접근할 수 있습니다.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push('/')}
          className="bg-primary hover:bg-primary-hover w-full rounded-xl py-3 text-sm font-medium text-white transition-colors"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}
