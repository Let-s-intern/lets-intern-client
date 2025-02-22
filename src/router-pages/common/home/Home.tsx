'use client';

import { useState } from 'react';

import TopBanner from '@/components/common/home/new/banner/TopBanner';
import Popup from '@/components/common/home/new/ui/Popup';
import IntroSection from '@components/common/home/section/IntroSection';

const Home = () => {
  const [isShow, setIsShow] = useState(false);
  return (
    <>
      <TopBanner isShow={isShow} setIsShow={setIsShow} />
      {isShow && <div className="h-20 w-full md:h-14" />}
      <div className="flex justify-center pt-10 md:pt-20">
        <div className="mb-6 flex w-full max-w-[1160px] flex-col gap-16 lg:gap-20">
          <IntroSection />
          {/* <Banner />
          <ProgramSection />
          <ProgramOverviewSection />
          <AdvantageSection />
          <PassReviewSection />
          <ReviewSection /> */}
        </div>
      </div>
      <Popup />
    </>
  );
};

export default Home;
