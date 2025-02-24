'use client';

import { useState } from 'react';

import TopBanner from '@/components/common/home/new/banner/TopBanner';
import Popup from '@/components/common/home/new/ui/Popup';
import IntroSection from '@components/common/home/section/IntroSection';
import MainBannerSection from '@components/common/home/section/MainBannerSection';
import RoadMapSection from '@components/common/home/section/RoadMapSection';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Home = () => {
  const [isShow, setIsShow] = useState(false);

  // const { data } = useGetUserCuration({ locationType: 'UNDER_REVIEW' });
  // console.log(data);
  return (
    <>
      <TopBanner isShow={isShow} setIsShow={setIsShow} />
      {isShow && <div className="h-20 w-full md:h-14" />}
      <div className="mb-6 flex w-full flex-col items-center justify-center pt-10 md:pt-20">
        <IntroSection />
        <RoadMapSection />
        <MainBannerSection />
        {/* <Banner />
          <ProgramSection />
          <ProgramOverviewSection />
          <AdvantageSection />
          <PassReviewSection />
          <ReviewSection /> */}
      </div>
      <Popup />
    </>
  );
};

export default Home;
