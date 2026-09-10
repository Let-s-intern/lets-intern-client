'use client';

import PricePlanBottomSheet from '@/domain/program/PricePlanBottomSheet';
import useAuthStore from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import {
  buildLoginRedirectPath,
  IS_RECRUITMENT_CLOSED,
  isValidMembershipChallengeId,
  MEMBERSHIP_CHALLENGE_ID,
  MEMBERSHIP_LAUNCH_ALERT_PATH,
} from '../lib/membershipChallenge';
import { onOpenPlanSheet } from '../lib/planSheet';
import { useMembershipChallengeQuery } from '../lib/useMembershipChallengeQuery';
import useMembershipSheetStore from '../store/useMembershipSheetStore';

/**
 * 멤버십 결제 컨트롤러.
 * - env 챌린지(MEMBERSHIP_CHALLENGE_ID)를 1곳에서만 조회한다(prop drilling 금지).
 * - 멤버십 CTA(openPlanSheet 이벤트) 구독 → 로그인 게이트 → 기존 챌린지 결제 시트 오픈.
 * - PricePlanBottomSheet 는 앱 자체 Tailwind 컴포넌트라 `.membership-root` 밖에서 렌더해도 무방.
 */
export default function MembershipPaymentSheet() {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const setSheetOpen = useMembershipSheetStore((s) => s.setSheetOpen);
  const [isOpen, setIsOpen] = useState(false);

  // 로컬 시트 상태를 store 에 동기화 → ApplyBar 가 겹치지 않도록 숨김 제어.
  const openSheet = useCallback(() => {
    setIsOpen(true);
    setSheetOpen(true);
  }, [setSheetOpen]);

  const closeSheet = useCallback(() => {
    setIsOpen(false);
    setSheetOpen(false);
  }, [setSheetOpen]);

  const challengeId = MEMBERSHIP_CHALLENGE_ID;
  const isConfigured = isValidMembershipChallengeId(challengeId);

  const { data: challenge } = useMembershipChallengeQuery({
    challengeId,
    enabled: isConfigured,
  });

  const handleOpen = useCallback(() => {
    /*
      로그인 게이트를 분기보다 앞에 둔다. 결제든 출시 알림이든 로그인이 필요하고,
      여기서 한 번만 처리하면 CTA 세 곳(Hero·FinalCta·ApplyBar)이 그것을 몰라도 된다.

      redirect 에 현재 경로를 실어 로그인 후 이 랜딩으로 돌아오게 한다. 광고로 들어와
      처음 보는 사람이 많은 자리라, 돌아올 곳을 잃으면 그대로 이탈한다.
    */
    if (!isLoggedIn) {
      router.push(
        buildLoginRedirectPath(
          window.location.pathname,
          window.location.search,
        ),
      );
      return;
    }

    /*
      모집이 끝났으면 결제 대신 출시 알림 신청으로 보낸다.

      CTA 를 잠가 "모집 종료" 만 띄우면, 다음 시즌을 기다릴 의사가 있는 사람이 아무것도
      남기지 못하고 나간다. 랜딩을 살려 두는 이유가 그 사람들을 받기 위해서다.

      분기를 이 컨트롤러에 두는 것이 핵심이다. CTA 쪽에 두면 세 곳에 같은 조건을 복사하게
      되고, 한 곳을 빠뜨려도 화면은 멀쩡해 보인다.
    */
    if (IS_RECRUITMENT_CLOSED) {
      router.push(MEMBERSHIP_LAUNCH_ALERT_PATH);
      return;
    }

    if (!isConfigured) {
      // env 미설정 시 결제 비활성: 시트를 열지 않는다.
      return;
    }

    openSheet();
  }, [isConfigured, isLoggedIn, router, openSheet]);

  useEffect(() => onOpenPlanSheet(handleOpen), [handleOpen]);

  // challenge 로딩 전이면 시트를 띄우지 않는다(가드).
  if (!challenge) return null;

  return (
    <PricePlanBottomSheet
      challenge={challenge}
      challengeId={String(challengeId)}
      isOpen={isOpen}
      onClose={closeSheet}
    />
  );
}
