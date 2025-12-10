// src/domain/home/components/HomeScreenSection.tsx

import TopBanner from '@/domain/home/new/banner/TopBanner';
import Popup from '@/domain/home/new/ui/Popup';

import BottomBannerSection from '@/domain/home/banner/BottomBannerSection';
import LogoPlaySection from '@/domain/home/banner/LogoPlaySection';
import MainBannerSection from '@/domain/home/banner/MainBannerSection';
import MainCurationSection from '@/domain/home/banner/MainCurationSection';
import BlogCurationSection from '@/domain/home/blog/BlogCurationSection';
import CurrentBlogSection from '@/domain/home/blog/CurrentBlogSection';
import InterviewSection from '@/domain/home/blog/InterviewSection';
import IntroSection from '@/domain/home/Intro/IntroSection';
import ActiveProgramSection from '@/domain/home/program/ActiveProgramSection';
import LetsCareerSection from '@/domain/home/program/LetsCareerSection';
import ReviewCurationSection from '@/domain/home/review/ReviewCurationSection';
import ReviewSection from '@/domain/home/review/ReviewSection';

export default function HomeScreen() {
  return (
    <>
      <TopBanner />
      <div className="mb-20 flex w-full flex-col items-center justify-center pt-9 md:mb-44 md:pt-[68px]">
        <IntroSection />
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
        <BlogCurationSection />
      </div>
      <Popup />
    </>
  );
}
