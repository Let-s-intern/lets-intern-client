import ProgramReviewSection from '@components/common/review/programReview/ProgramReviewSection';
import MoreHeader from '@components/common/ui/MoreHeader';

const Page = () => {
  return (
    <div className="w-full px-5 md:px-0 md:flex md:flex-col md:gap-[4.25rem]">
      <ProgramReviewSection />
      <MoreHeader title="블로그 후기" subtitle="NN개" href="/review/blog" />
      <MoreHeader
        title="프로그램 참여자 인터뷰"
        subtitle="NN개"
        href="/review/interview"
      />
    </div>
  );
};

export default Page;
