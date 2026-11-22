/**
 * [HOME-LEGACY] 홈 개편(AI 상담·고민 섹션) 전의 홈 화면 백업.
 * 기준: main 076f76dea (LC-3610). 태그 home-legacy-backup 과 같은 시점이다.
 *
 * 되돌리는 법: app/(user)/page.tsx 에서
 *   import HomeScreen from '@/domain/home/HomeScreen';
 * 를
 *   import HomeScreen from '@/domain/home/legacy/LegacyHomeScreen';
 * 로 바꾼다. 개편 중 바뀐 TopBanner·ReviewSection 은 이 폴더의 원본 사본을 쓴다.
 */

import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import TopBanner from '@/domain/home/legacy/LegacyTopBanner';
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
import ReviewSection from '@/domain/home/legacy/LegacyReviewSectionClient';

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
