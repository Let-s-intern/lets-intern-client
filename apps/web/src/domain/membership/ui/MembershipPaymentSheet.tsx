'use client';

import PricePlanBottomSheet from '@/domain/program/PricePlanBottomSheet';
import useAuthStore from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import {
  buildLoginRedirectPath,
  isValidMembershipChallengeId,
  MEMBERSHIP_CHALLENGE_ID,
} from '../lib/membershipChallenge';
import { onOpenPlanSheet } from '../lib/planSheet';
import { useMembershipChallengeQuery } from '../lib/useMembershipChallengeQuery';

/**
 * 멤버십 결제 컨트롤러.
 * - env 챌린지(MEMBERSHIP_CHALLENGE_ID)를 1곳에서만 조회한다(prop drilling 금지).
 * - 멤버십 CTA(openPlanSheet 이벤트) 구독 → 로그인 게이트 → 기존 챌린지 결제 시트 오픈.
 * - PricePlanBottomSheet 는 앱 자체 Tailwind 컴포넌트라 `.membership-root` 밖에서 렌더해도 무방.
 */
export default function MembershipPaymentSheet() {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const challengeId = MEMBERSHIP_CHALLENGE_ID;
  const isConfigured = isValidMembershipChallengeId(challengeId);

  const { data: challenge } = useMembershipChallengeQuery({
    challengeId,
    enabled: isConfigured,
  });

  const handleOpen = useCallback(() => {
    if (!isConfigured) {
      // env 미설정 시 결제 비활성: 시트를 열지 않는다.
      return;
    }

    if (!isLoggedIn) {
      // 로그인 게이트 — 비로그인 시 현재 경로로 돌아오도록 redirect 를 붙여 로그인 페이지로.
      // ChallengeCTAButtons 와 동일 패턴(window.location.pathname + search).
      router.push(
        buildLoginRedirectPath(
          window.location.pathname,
          window.location.search,
        ),
      );
      return;
    }

    setIsOpen(true);
  }, [isConfigured, isLoggedIn, router]);

  useEffect(() => onOpenPlanSheet(handleOpen), [handleOpen]);

  // challenge 로딩 전이면 시트를 띄우지 않는다(가드).
  if (!challenge) return null;

  return (
    <PricePlanBottomSheet
      challenge={challenge}
      challengeId={String(challengeId)}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    />
  );
}
