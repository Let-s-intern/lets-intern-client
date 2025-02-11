'use client';

import useGetActiveMissionReviews from '@/hooks/useGetActiveMissionReviews';
import ReviewFilter from '../ReviewFilter';

interface Props {
  onChangeFilter: () => void;
}

const MissionReviewFilterSection = ({ onChangeFilter }: Props) => {
  const { challengeTypeFilter } = useGetActiveMissionReviews();
  return (
    <section className="flex w-full gap-x-3 px-5 py-6 md:gap-x-2 md:p-0">
      <ReviewFilter
        label="챌린지 구분"
        labelValue="challenge"
        className="challenge_filter"
        list={challengeTypeFilter}
        multiSelect
        dropdownClassName="w-60"
        onChange={onChangeFilter}
      />
    </section>
  );
};

export default MissionReviewFilterSection;
