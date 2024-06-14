import ProgramSection from '../../../components/common/home/new/program/ProgramSection';
import ProgramOverviewSection from '../../../components/common/home/new/overview/ProgramOverviewSection';
import AdvantageSection from '../../../components/common/home/new/advantage/AdvantageSection';
import PassReviewSection from '../../../components/common/home/new/pass-review/PassReviewSection';
import ReviewSection from '../../../components/common/home/new/review/ReviewSection';

const Home = () => {
  return (
    <div className="px-5">
      <div className="mx-auto my-6 flex max-w-[1080px] flex-col gap-16 sm:gap-20">
        <ProgramSection />
        <ProgramOverviewSection />
        <AdvantageSection />
        <PassReviewSection />
        <ReviewSection />
      </div>
    </div>
  );
};

export default Home;
