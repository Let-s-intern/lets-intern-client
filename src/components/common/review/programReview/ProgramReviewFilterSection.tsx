'use client';

import { challengeTypes, challengeTypeToText } from '@/utils/convert';
import { useSearchParams } from 'next/navigation';
import ReviewFilter, { ReviewFilterItem } from '../ReviewFilter';

const programTypeFilterList: ReviewFilterItem[] = [
  { caption: '챌린지', value: 'CHALLENGE_REVIEW' },
  { caption: 'LIVE 클래스', value: 'LIVE_REVIEW' },
  { caption: '서류 피드백 REPORT', value: 'REPORT_REVIEW' },
];

const challengeTypeFilterList: ReviewFilterItem[] = challengeTypes.map(
  (item) => ({
    caption: challengeTypeToText[item] + ' 챌린지',
    value: item,
  }),
);

const reviewTypeFilterList: ReviewFilterItem[] = [
  { caption: '미션 수행 후기', value: 'MISSION_REVIEW' },
  { caption: '프로그램 참여 후기', value: 'CHALLENGE_REVIEW' },
];

const ProgramReviewFilterSection = () => {
  const searchParams = useSearchParams();

  const programType = searchParams.get('PROGRAM');
  const challengeType = searchParams.get('CHALLENGE');
  const reviewType = searchParams.get('REVIEW');

  return (
    <section className="w-full flex gap-x-3 md:gap-x-2 px-5 py-6 md:p-0">
      <ReviewFilter
        label="프로그램 후기"
        labelValue="PROGRAM"
        list={programTypeFilterList}
      />
      {programType === 'CHALLENGE_REVIEW' && (
        <ReviewFilter
          label="챌린지 구분"
          labelValue="CHALLENGE"
          list={challengeTypeFilterList}
          multiSelect
        />
      )}
      {programType === 'CHALLENGE_REVIEW' && (
        <ReviewFilter
          label="후기 유형"
          labelValue="REVIEW"
          list={reviewTypeFilterList}
        />
      )}
    </section>
  );
};

export default ProgramReviewFilterSection;
