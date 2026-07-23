import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import MainBlogReviewSection from '@/domain/review/blog/MainBlogReviewSection';
import ProgramInterviewSection from '@/domain/review/section/ProgramInterviewSectionClient';
import ProgramReviewSection from '@/domain/review/programReview/ProgramReviewSection';

const Page = () => {
  return (
    <div className="w-full px-5 md:flex md:flex-col md:gap-[4.25rem] md:px-0 md:pb-8">
      <AsyncBoundary pendingFallback={null}>
        <ProgramReviewSection />
      </AsyncBoundary>
      <AsyncBoundary pendingFallback={null}>
        <MainBlogReviewSection />
      </AsyncBoundary>
      <AsyncBoundary pendingFallback={null}>
        <ProgramInterviewSection />
      </AsyncBoundary>
    </div>
  );
};

export default Page;
