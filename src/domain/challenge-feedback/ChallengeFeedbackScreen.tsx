'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useRef } from 'react';
import {
  CHALLENGE_LIST,
  findChallengeByKey,
} from './data/challenge-feedback-data';
import ApplyCtaSection from './sections/ApplyCtaSection';
import BeforeAfterSection from './sections/BeforeAfterSection';
import ChallengeMenuSection from './sections/ChallengeMenuSection';
import FeedbackIntroSection from './sections/FeedbackIntroSection';
import HeroSection from './sections/HeroSection';
import LiveMentoringSection from './sections/LiveMentoringSection';
import MentorListSection from './sections/MentorListSection';
import SuccessStoriesSection from './sections/SuccessStoriesSection';
import UserReviewSection from './sections/UserReviewSection';
import type { ChallengeKey } from './types';

interface ChallengeFeedbackScreenProps {
  initialChallenge?: string;
}

const ChallengeFeedbackScreen = ({
  initialChallenge,
}: ChallengeFeedbackScreenProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToContent = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    const headerH = window.innerWidth >= 768 ? 116 : 84;
    const top = el.getBoundingClientRect().top + window.scrollY - headerH;
    window.scrollTo({ top, behavior: 'smooth' });
  }, []);

  const selectedKey =
    (searchParams.get('challenge') as ChallengeKey) ??
    (initialChallenge as ChallengeKey) ??
    CHALLENGE_LIST[0].key;

  const selectedChallenge = useMemo(
    () => findChallengeByKey(selectedKey),
    [selectedKey],
  );

  const handleChallengeSelect = useCallback(
    (key: ChallengeKey) => {
      router.push(`/challenge/feedback-mentoring?challenge=${key}`, {
        scroll: false,
      });
    },
    [router],
  );

  return (
    <div className="flex w-full flex-col items-center bg-[#0C0A1D]">
      <HeroSection onScrollDown={scrollToContent} />

      <div ref={contentRef} className="w-full">
        {/* 02. 챌린지 메뉴 */}
        <ChallengeMenuSection
          selectedKey={selectedKey}
          onSelect={handleChallengeSelect}
        />

        {/* 03. 피드백 소개 */}
        <FeedbackIntroSection challenge={selectedChallenge} />

        {/* 04. 멘토 소개 */}
        <MentorListSection challenge={selectedChallenge} />

        {/* 05. 비포에프터 — 조건부 */}
        {selectedChallenge.beforeAfter && (
          <BeforeAfterSection beforeAfter={selectedChallenge.beforeAfter} />
        )}

        {/* 06. 라이브 멘토링 — 조건부 */}
        {selectedChallenge.liveMentoring && (
          <LiveMentoringSection
            liveMentoring={selectedChallenge.liveMentoring}
          />
        )}

        {/* 07. 유저 후기 — 공통 */}
        <UserReviewSection />

        {/* 08. 취업 성공 사례 — 공통 */}
        <SuccessStoriesSection />

        {/* 09. CTA — 신청하기 */}
        <ApplyCtaSection challenge={selectedChallenge} />
      </div>
    </div>
  );
};

export default ChallengeFeedbackScreen;
