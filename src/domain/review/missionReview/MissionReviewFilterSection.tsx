'use client';

import useGetActiveMissionReviews from '@/hooks/useGetActiveMissionReviews';
import FilterDropdown from '../../../common/dropdown/FilterDropdown';

interface Props {
  onChangeFilter: () => void;
}

const MissionReviewFilterSection = ({ onChangeFilter }: Props) => {
  const { challengeTypeFilter } = useGetActiveMissionReviews();
  return (
    <section className="flex w-full gap-x-3 px-5 py-6 md:gap-x-2 md:p-0">
      <FilterDropdown
        label="챌린지 구분"
        paramKey="challenge"
        listItemClassName="challenge_filter"
        list={challengeTypeFilter}
        multiSelect
        onChange={onChangeFilter}
      />
    </section>
  );
};

export default MissionReviewFilterSection;
