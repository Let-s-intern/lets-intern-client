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
    <section className="w-full flex gap-x-3 md:gap-x-2 px-5 py-6 md:p-0">
      <ReviewFilter
        label="챌린지 구분"
        labelValue="challenge"
        list={challengeTypeFilterList}
        multiSelect
      />
    </section>
  );
};

export default MissionReviewFilterSection;
