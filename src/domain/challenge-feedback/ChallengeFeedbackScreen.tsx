'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  CHALLENGE_LIST,
  findChallengeByKey,
} from './data/challenge-feedback-data';
import { REFERRER_KEYWORD_MAP } from './data/urls';
import ApplyCtaSection from './sections/ApplyCtaSection';
import BeforeAfterSection from './sections/BeforeAfterSection';
import ChallengeMenuSection from './sections/ChallengeMenuSection';
import FeedbackIntroSection from './sections/FeedbackIntroSection';
import HeroSection from './sections/HeroSection';
import LiveMentoringSection from './sections/LiveMentoringSection';
import MentorListSection from './sections/MentorListSection';
import SuccessStoriesSection from './sections/SuccessStoriesSection';
import UserReviewSection from './sections/UserReviewSection';
import WrittenFeedbackSection from './sections/WrittenFeedbackSection';
import type { ChallengeKey, FeedbackDetailWithTiers } from './types';

function detectChallengeFromReferrer(): ChallengeKey | null {
  if (typeof window === 'undefined') return null;
  const rawReferrer = document.referrer;
  if (!rawReferrer) return null;

  let referrer: string;
  try {
    referrer = decodeURIComponent(rawReferrer);
  } catch {
    referrer = rawReferrer;
  }

  if (!referrer.includes('/program/challenge/')) return null;
  for (const { keyword, key } of REFERRER_KEYWORD_MAP) {
    if (referrer.toLowerCase().includes(keyword.toLowerCase())) return key;
  }
  return null;
}

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

  // referrer에서 챌린지 자동 감지
  useEffect(() => {
    if (searchParams.get('challenge')) return;
    const detected = detectChallengeFromReferrer();
    if (detected) {
      router.replace(`/challenge/feedback-mentoring?challenge=${detected}`, {
        scroll: false,
      });
    }
  }, [router, searchParams]);

  const selectedKey =
    (searchParams.get('challenge') as ChallengeKey) ??
    (initialChallenge as ChallengeKey) ??
    CHALLENGE_LIST[0].key;

  const selectedChallenge = useMemo(
    () => findChallengeByKey(selectedKey),
    [selectedKey],
  );

  const detailsWithTiers = useMemo(() => {
    const map = new Map<string, FeedbackDetailWithTiers>();
    selectedChallenge.feedbackOptions.forEach((opt) => {
      opt.feedbackDetails.forEach((d) => {
        const existing = map.get(d.round);
        if (existing) {
          if (!existing.tiers.includes(opt.tier)) existing.tiers.push(opt.tier);
        } else {
          map.set(d.round, { ...d, tiers: [opt.tier] });
        }
      });
    });
    return Array.from(map.values());
  }, [selectedChallenge]);

  const writtenFeedbackDetails = useMemo(
    () =>
      detailsWithTiers.filter(
        (d) => d.method === '서면' && d.exampleImages.length > 0,
      ),
    [detailsWithTiers],
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

        {/* 04. 서면 피드백 예시 — 조건부 */}
        {writtenFeedbackDetails.length > 0 && (
          <WrittenFeedbackSection writtenDetails={writtenFeedbackDetails} />
        )}

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

        {/* 07. 멘토 소개 */}
        <MentorListSection challenge={selectedChallenge} />

        {/* 07. 유저 후기 — 공통 */}
        <UserReviewSection />

        {/* 08. 취업 성공 사례 — 공통 */}
        <SuccessStoriesSection />
      </div>

      {/* 플로팅 CTA */}
      <ApplyCtaSection challenge={selectedChallenge} />
    </div>
  );
};

export default ChallengeFeedbackScreen;
