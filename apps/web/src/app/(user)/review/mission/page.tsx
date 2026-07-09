import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import MissionReview from '@/domain/review/missionReview/MissionReview';

const Page = () => {
  return (
    <div className="flex w-full flex-col md:gap-y-6">
      <AsyncBoundary pendingFallback={null}>
        <MissionReview />
      </AsyncBoundary>
    </div>
  );
};

export default Page;
