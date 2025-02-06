'use client';

import { liveJobList } from '@/schema';
import { challengeTypes, challengeTypeToDisplay } from '@/utils/convert';
import { useSearchParams } from 'next/navigation';
import ReviewFilter, { ReviewFilterItem } from '../ReviewFilter';

const programTypeFilterList: ReviewFilterItem[] = [
  { caption: '챌린지', value: 'CHALLENGE_REVIEW' },
  { caption: 'LIVE 클래스', value: 'LIVE_REVIEW' },
  { caption: '서류 피드백 REPORT', value: 'REPORT_REVIEW' },
];

const liveJobFilterList: ReviewFilterItem[] = liveJobList.map((item) => ({
  caption: item,
  value: item,
}));

const challengeTypeFilterList: ReviewFilterItem[] = challengeTypes
  .filter((type) => type !== 'ETC')
  .map((item) => ({
    caption: challengeTypeToDisplay[item],
    value: item,
  }));

// const reviewTypeFilterList: ReviewFilterItem[] = [
//   { caption: '미션 수행 후기', value: 'MISSION_REVIEW' },
//   { caption: '프로그램 참여 후기', value: 'CHALLENGE_REVIEW' },
// ];

const ProgramReviewFilterSection = () => {
  const searchParams = useSearchParams();

  const programType = searchParams.get('program');
  // const challengeType = searchParams.get('CHALLENGE');
  // const reviewType = searchParams.get('REVIEW');

  return (
    <section className="flex w-full flex-col gap-y-2 px-5 py-6 md:flex-row md:gap-x-2 md:p-0">
      <ReviewFilter
        label="프로그램 후기"
        labelValue="program"
        childLabelValue={['challenge']}
        list={programTypeFilterList}
      />
      {programType === 'CHALLENGE_REVIEW'.toLowerCase() && (
        <ReviewFilter
          label="챌린지 구분"
          labelValue="challenge"
          list={challengeTypeFilterList}
          multiSelect
        />
      )}
      {programType === 'LIVE_REVIEW'.toLowerCase() && (
        <ReviewFilter
          label="직무 구분"
          labelValue="liveJob"
          list={liveJobFilterList}
          multiSelect
        />
      )}
    </section>
  );
};

export default ProgramReviewFilterSection;
