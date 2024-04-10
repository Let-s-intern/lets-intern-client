import ProgramSection from '../../../components/common/home/current/program/ProgramSection';
import ProgramOverviewSection from '../../../components/common/home/current/overview/ProgramOverviewSection';
import AdvantageSection from '../../../components/common/home/current/advantage/AdvantageSection';
import PassReviewSection from '../../../components/common/home/current/pass-review/PassReviewSection';

const Home = () => {
  return (
    <div className="px-5">
      <div className="mx-auto mb-16 mt-6 flex max-w-[1080px] flex-col gap-16 sm:gap-20">
        <ProgramSection />
        <ProgramOverviewSection />
        <AdvantageSection />
        <PassReviewSection />
      </div>
    </div>
  );
};

export default Home;
