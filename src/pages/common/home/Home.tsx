import ProgramSection from '../../../components/common/home/new/program/ProgramSection';
import ProgramOverviewSection from '../../../components/common/home/new/overview/ProgramOverviewSection';
import AdvantageSection from '../../../components/common/home/new/advantage/AdvantageSection';
import PassReviewSection from '../../../components/common/home/new/pass-review/PassReviewSection';
import ReviewSection from '../../../components/common/home/new/review/ReviewSection';
import Banner from '../../../components/common/home/new/banner/Banner';
import Popup from '../../../components/common/home/new/ui/Popup';

const Home = () => {
  return (
    <>
      <div className="flex justify-center px-5">
        <div className="mb-6 flex w-full max-w-[1080px] flex-col gap-16 lg:gap-20">
          <Banner />
          <ProgramSection />
          <ProgramOverviewSection />
          <AdvantageSection />
          <PassReviewSection />
          <ReviewSection />
        </div>
      </div>
      <Popup />
    </>
  );
};

export default Home;
