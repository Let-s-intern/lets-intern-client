import { Suspense } from 'react';

import MissionReviewContentSection from '@components/common/review/missionReview/MissionReviewContentSection';
import MissionReviewFilterSection from '@components/common/review/missionReview/MissionReviewFilterSection';

const Page = () => {
  return (
    <div className="flex w-full flex-col md:gap-y-6 md:pr-5 lg:pr-0">
      <Suspense>
        <MissionReviewFilterSection />
        <MissionReviewContentSection />
      </Suspense>
    </div>
  );
};

export default Page;
