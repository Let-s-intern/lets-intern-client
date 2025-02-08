'use client';

import { challengeTypes, challengeTypeToDisplay } from '@/utils/convert';
import ReviewFilter, { ReviewFilterItem } from '../ReviewFilter';

const challengeTypeFilterList: ReviewFilterItem[] = challengeTypes
  .filter((type) => type !== 'ETC')
  .map((item) => ({
    caption: challengeTypeToDisplay[item],
    value: item,
  }));

const MissionReviewFilterSection = () => {
  return (
    <section className="flex w-full gap-x-3 px-5 py-6 md:gap-x-2 md:p-0">
      <ReviewFilter
        label="챌린지 구분"
        labelValue="challenge"
        list={challengeTypeFilterList}
        multiSelect
        dropdownClassName="w-60"
      />
    </section>
  );
};

export default MissionReviewFilterSection;
