// src/domain/home/components/HomeScreenSection.tsx

import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import TopBanner from '@/domain/home/banner/TopBanner';
import Popup from '@/domain/home/ui/Popup';

import BottomBannerSection from '@/domain/home/banner/BottomBannerSection';
import LogoPlaySection from '@/domain/home/banner/LogoPlaySection';
import MainBannerSection from '@/domain/home/banner/MainBannerSection';
import MainCurationSection from '@/domain/home/banner/MainCurationSection';
import BlogCurationSection from '@/domain/home/blog/BlogCurationSection';
import CurrentBlogSection from '@/domain/home/blog/CurrentBlogSectionClient';
import InterviewSection from '@/domain/home/blog/InterviewSectionClient';
import IntroSection from '@/domain/home/Intro/IntroSection';
import ActiveProgramSection from '@/domain/home/program/ActiveProgramSection';
import LetsCareerSection from '@/domain/home/program/LetsCareerSection';
import ReviewCurationSection from '@/domain/home/review/ReviewCurationSection';
import ReviewSection from '@/domain/home/review/ReviewSectionClient';

export default function HomeScreen() {
  return (
    <>
      <TopBanner />
      <div className="mb-20 flex w-full flex-col items-center justify-center pt-9 md:mb-44 md:pt-[68px]">
        <IntroSection />
        <MainBannerSection />
        <AsyncBoundary pendingFallback={null}>
          <MainCurationSection />
        </AsyncBoundary>
        <AsyncBoundary pendingFallback={null}>
          <ActiveProgramSection />
        </AsyncBoundary>
        <AsyncBoundary pendingFallback={null}>
          <LetsCareerSection />
        </AsyncBoundary>
        <AsyncBoundary pendingFallback={null}>
          <ReviewSection />
        </AsyncBoundary>
        <AsyncBoundary pendingFallback={null}>
          <ReviewCurationSection />
        </AsyncBoundary>
        <LogoPlaySection />
        <BottomBannerSection />
        <AsyncBoundary pendingFallback={null}>
          <InterviewSection />
        </AsyncBoundary>
        <AsyncBoundary pendingFallback={null}>
          <CurrentBlogSection />
        </AsyncBoundary>
        <AsyncBoundary pendingFallback={null}>
          <BlogCurationSection />
        </AsyncBoundary>
      </div>
      <Popup />
    </>
  );
}
