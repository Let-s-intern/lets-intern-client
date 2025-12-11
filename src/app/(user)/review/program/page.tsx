import ProgramReview from '@/common/review/programReview/ProgramReview';
import { Suspense } from 'react';

const Page = () => {
  return (
    <div className="flex w-full flex-col md:gap-y-6">
      <Suspense>
        <ProgramReview />
      </Suspense>
    </div>
  );
};

export default Page;
