import { Suspense } from 'react';

import ProgramReviewContentSection from '@components/common/review/programReview/ProgramReviewContentSection';
import ProgramReviewFilterSection from '@components/common/review/programReview/ProgramReviewFilterSection';

const Page = () => {
  return (
    <div className="flex w-full flex-col md:gap-y-6 md:pr-5 lg:pr-0">
      <Suspense>
        <ProgramReviewFilterSection />
        <ProgramReviewContentSection />
      </Suspense>
    </div>
  );
};

export default Page;
