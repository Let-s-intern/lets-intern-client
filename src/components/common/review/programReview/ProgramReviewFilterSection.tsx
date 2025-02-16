'use client';

import useGetActiveReviews from '@/hooks/useGetActiveReviews';
import { FilterItem } from '@/types/common';
import { useSearchParams } from 'next/navigation';
import ReviewFilter from '../ReviewFilter';

const programTypeFilterList: FilterItem[] = [
  { caption: '챌린지', value: 'CHALLENGE_REVIEW' },
  { caption: 'LIVE 클래스', value: 'LIVE_REVIEW' },
  { caption: '서류 피드백 REPORT', value: 'REPORT_REVIEW' },
];

interface Props {
  onChangeFilter: () => void;
}

const ProgramReviewFilterSection = ({ onChangeFilter }: Props) => {
  const searchParams = useSearchParams();
  const { challengeTypeFilter, liveJobTypeFilter } = useGetActiveReviews();

  const programType = searchParams.get('program');

  return (
    <section className="flex gap-x-2 overflow-auto px-5 py-6 scrollbar-hide md:gap-x-3 md:overflow-visible md:p-0">
      <ReviewFilter
        label="프로그램 유형"
        labelValue="program"
        childLabelValue={['challenge', 'liveJob']}
        className="program_filter"
        list={programTypeFilterList}
        onChange={onChangeFilter}
      />
      {programType === 'CHALLENGE_REVIEW'.toLowerCase() && (
        <ReviewFilter
          label="챌린지 구분"
          labelValue="challenge"
          list={challengeTypeFilter}
          className="challenge_filter"
          multiSelect
          dropdownClassName="w-60"
          onChange={onChangeFilter}
        />
      )}
      {programType === 'LIVE_REVIEW'.toLowerCase() && (
        <ReviewFilter
          label="LIVE 구분"
          labelValue="liveJob"
          className="live_filter"
          list={liveJobTypeFilter}
          multiSelect
          onChange={onChangeFilter}
        />
      )}
    </section>
  );
};

export default ProgramReviewFilterSection;
