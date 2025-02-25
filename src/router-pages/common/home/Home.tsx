'use client';

import { useState } from 'react';

import TopBanner from '@/components/common/home/new/banner/TopBanner';
import Popup from '@/components/common/home/new/ui/Popup';
import IntroSection from '@components/common/home/section/IntroSection';
import MainBannerSection from '@components/common/home/section/MainBannerSection';
import RoadMapSection from '@components/common/home/section/RoadMapSection';

import ActiveProgramSection from '@components/common/home/section/ActiveProgramSection';
import BottomBannerSection from '@components/common/home/section/BottomBannerSection';
import CurrentBlogSection from '@components/common/home/section/CurrentBlogSection';
import InterviewSection from '@components/common/home/section/InterviewSection';
import LetsCareerSection from '@components/common/home/section/LetsCareerSection';
import LogoPlaySection from '@components/common/home/section/LogoPlaySection';
import MainCurationSection from '@components/common/home/section/MainCurationSection';
import ReviewCurationSection from '@components/common/home/section/ReviewCurationSection';
import ReviewSection from '@components/common/home/section/ReviewSection';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Home = () => {
  const [isShow, setIsShow] = useState(false);

  return (
    <>
      <TopBanner isShow={isShow} setIsShow={setIsShow} />
      {isShow && <div className="h-20 w-full md:h-14" />}
      <div className="mb-6 flex w-full flex-col items-center justify-center pt-10 md:pt-20">
        <IntroSection />
        <RoadMapSection />
        <MainBannerSection />
        <MainCurationSection />
        <ActiveProgramSection />
        <LetsCareerSection />
        <ReviewSection />
        <ReviewCurationSection />
        <LogoPlaySection />
        <BottomBannerSection />
        <InterviewSection />
        <CurrentBlogSection />
      </div>
      <Popup />
    </>
  );
};

export default Home;
