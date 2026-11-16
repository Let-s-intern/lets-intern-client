// src/domain/home/components/HomeScreenSection.tsx

import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import TopBanner from '@/domain/home/banner/TopBanner';
import Popup from '@/domain/home/ui/Popup';

import MainBannerSection from '@/domain/home/banner/MainBannerSection';
import BlogCurationSection from '@/domain/home/blog/BlogCurationSection';
import CurrentBlogSection from '@/domain/home/blog/CurrentBlogSectionClient';
import InterviewSection from '@/domain/home/blog/InterviewSectionClient';
import ConcernSection from '@/domain/home/concern/ConcernSection';
import ReviewSection from '@/domain/home/review/ReviewSectionClient';
import { HomeChattingProvider } from '@/domain/home/hero/HomeChattingContext';
import HomeHero from '@/domain/home/hero/HomeHero';

export default function HomeScreen() {
  return (
    <HomeChattingProvider>
      <TopBanner />
      <div className="mb-20 flex w-full flex-col items-center justify-center pt-9 md:mb-44 md:pt-[68px]">
        <HomeHero />
        <ConcernSection />
        <MainBannerSection />
        <AsyncBoundary pendingFallback={null}>
          <ReviewSection />
        </AsyncBoundary>
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
    </HomeChattingProvider>
  );
}
