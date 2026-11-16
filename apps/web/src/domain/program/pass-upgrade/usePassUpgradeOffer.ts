'use client';

import { useGetAllInOnePassLanding } from '@/domain/all-in-one-pass/api/landing';
import {
  useGetMembershipPrivilege,
  useGetOpenMembershipPrivilege,
} from '@/domain/all-in-one-pass/api/privilege';
import { usePassPricing } from '@/domain/all-in-one-pass/landing/usePassPricing';

/**
 * 챌린지 결제·결제 완료 화면의 올인원 패스 업그레이드 제안.
 * 열린 패스에 챌린지 권한이 있고, 이 챌린지에 패스 권한이 없을 때만 보인다.
 * 업그레이드 결제는 패스 상세에서 한다 — 여기서는 그 링크와 가격만 준다.
 */
export const usePassUpgradeOffer = (challengeId: number, enabled: boolean) => {
  const { data: privilege } = useGetMembershipPrivilege(
    'CHALLENGE',
    enabled ? challengeId : -1,
  );
  const { data: openPrivilege } = useGetOpenMembershipPrivilege({ enabled });

  const openCount = openPrivilege?.openCount ?? 0;
  // 열린 패스가 하나일 때만 그 패스의 가격·구성을 보인다
  const singleMembershipId =
    openCount === 1 ? (openPrivilege?.membershipId ?? null) : null;
  const { data: landing } = useGetAllInOnePassLanding(singleMembershipId ?? -1);
  const { passPrice, contentRows } = usePassPricing(landing?.plans ?? []);

  const openHasChallenge =
    !!openPrivilege?.exists &&
    openPrivilege.privilegeList.some((p) => p.programType === 'CHALLENGE');
  const visible = enabled && openHasChallenge && !privilege?.hasPrivilege;

  const passHref =
    openCount >= 2
      ? '/program?type=MEMBERSHIP'
      : openPrivilege?.membershipId != null
        ? `/all-in-one-pass/${openPrivilege.membershipId}`
        : null;

  return {
    visible: visible && passHref !== null,
    passHref,
    /** 단일 패스의 최저가 플랜 가격. 모르면 null */
    passPrice: landing ? passPrice : null,
    /** 패스 구성 요약 (예: "취준 필수 챌린지 - 베이직 플랜 3종") */
    contentLabels: contentRows.map((row) => row.label),
  };
};
