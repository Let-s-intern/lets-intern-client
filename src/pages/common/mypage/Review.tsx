import DoneSection from '../../../components/common/mypage/review/section/DoneSection';
import WaitingSection from '../../../components/common/mypage/review/section/WaitingSection';

const Review = () => {
  return (
    <main className="flex flex-col gap-16 pb-20">
      <WaitingSection />
      <DoneSection />
    </main>
  );
};

export default Review;
