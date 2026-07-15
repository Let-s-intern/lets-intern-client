import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import ProgramReview from '@/domain/review/programReview/ProgramReview';

const Page = () => {
  return (
    <div className="flex w-full flex-col md:gap-y-6">
      <AsyncBoundary pendingFallback={null}>
        <ProgramReview />
      </AsyncBoundary>
    </div>
  );
};

export default Page;
