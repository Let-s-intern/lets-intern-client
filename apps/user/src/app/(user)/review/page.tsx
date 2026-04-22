import MainBlogReviewSection from '@/domain/review/MainBlogReviewSection';
import ProgramInterviewSection from '@/domain/review/ProgramInterviewSection';
import ProgramReviewSection from '@/domain/review/programReview/ProgramReviewSection';

const Page = () => {
  return (
    <div className="w-full px-5 md:flex md:flex-col md:gap-[4.25rem] md:px-0 md:pb-8">
      <ProgramReviewSection />
      <MainBlogReviewSection />
      <ProgramInterviewSection />
    </div>
  );
};

export default Page;
