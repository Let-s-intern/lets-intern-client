import MissionReview from '@components/common/review/missionReview/MissionReview';
import { Suspense } from 'react';

const Page = () => {
  return (
    <div className="flex w-full flex-col md:gap-y-6">
      <Suspense>
        <MissionReview />
      </Suspense>
    </div>
  );
};

export default Page;
