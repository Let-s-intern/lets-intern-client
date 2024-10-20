import { useState } from 'react';
import AdvantageSection from '../../../components/common/home/new/advantage/AdvantageSection';
import Banner from '../../../components/common/home/new/banner/Banner';
import TopBanner from '../../../components/common/home/new/banner/TopBanner';
import ProgramOverviewSection from '../../../components/common/home/new/overview/ProgramOverviewSection';
import PassReviewSection from '../../../components/common/home/new/pass-review/PassReviewSection';
import ProgramSection from '../../../components/common/home/new/program/ProgramSection';
import ReviewSection from '../../../components/common/home/new/review/ReviewSection';
import Popup from '../../../components/common/home/new/ui/Popup';

const Home = () => {
  const [isShow, setIsShow] = useState(false);
  return (
    <>
      <TopBanner isShow={isShow} setIsShow={setIsShow} />
      {isShow && <div className="h-20 w-full md:h-10" />}
      <div className="flex justify-center py-5">
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
