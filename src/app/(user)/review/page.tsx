import ProgramReviewSection from '@components/common/review/programReview/ProgramReviewSection';
import MoreHeader from '@components/common/ui/MoreHeader';

const Page = () => {
  return (
    // TODO: 레이아웃 파일로 만들어보기
    <div className="flex w-full">
      <nav className="w-full">
        <ul>
          <li>
            <ProgramReviewSection />
          </li>
          <li>
            <MoreHeader
              title="블로그 후기"
              subtitle="NN개"
              href="/review/blog"
            />
          </li>
          <li>
            <MoreHeader
              title="프로그램 참여자 인터뷰"
              subtitle="NN개"
              href="/review/interview"
            />
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Page;
