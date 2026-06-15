'use client';
import { useGetChallengeQuery } from '@/api/program';
import {
  MEMBERSHIP_BEGINNING,
  MEMBERSHIP_CHALLENGE_ID,
  MEMBERSHIP_DEADLINE,
  MEMBERSHIP_END_DATE,
  MEMBERSHIP_PLANS,
  MEMBERSHIP_START_DATE,
  MembershipPlanKey,
} from '../constants';

export interface MembershipPlanView {
  /** 정가 */
  originalPrice: number;
  /** 할인 적용 결제가 */
  price: number;
  label: string;
  discount: string;
  pricePlan: MembershipPlanKey;
}

/**
 * 멤버십 모집 정보(마감일·플랜 가격)를 어드민이 설정한 챌린지 API에서 읽어온다.
 * 어드민이 프로그램 편집기에서 가격/마감일을 수정하면 랜딩페이지에 그대로 반영된다.
 * API 응답이 없으면(미설정·비로그인 등) constants 의 기본값으로 폴백한다.
 *
 * 잔여 좌석(N석 남음)은 공개 API 가 현재 신청 인원을 노출하지 않아 API 산출이 불가하다.
 * (challenge 응답의 participationCount 는 현재 인원이 아닌 총 정원이다.)
 */
export function useMembershipProgram() {
  const { data } = useGetChallengeQuery({
    challengeId: MEMBERSHIP_CHALLENGE_ID,
    enabled: MEMBERSHIP_CHALLENGE_ID > 0,
  });

  const beginning = data?.beginning
    ? data.beginning.toDate()
    : MEMBERSHIP_BEGINNING;
  const deadline = data?.deadline
    ? data.deadline.toDate()
    : MEMBERSHIP_DEADLINE;
  const startDate = data?.startDate
    ? data.startDate.toDate()
    : MEMBERSHIP_START_DATE;
  const endDate = data?.endDate ? data.endDate.toDate() : MEMBERSHIP_END_DATE;

  const planKeys = Object.keys(MEMBERSHIP_PLANS) as MembershipPlanKey[];
  const plans = planKeys.reduce(
    (acc, key) => {
      const base = MEMBERSHIP_PLANS[key];
      const apiPrice = data?.priceInfo?.find(
        (p) => p.challengePricePlanType === key,
      );
      const originalPrice = apiPrice?.price ?? base.originalPrice;
      const discountAmount =
        apiPrice?.discount ?? base.originalPrice - base.price;
      acc[key] = {
        label: base.label,
        discount: base.discount,
        pricePlan: base.pricePlan,
        originalPrice,
        price: Math.max(originalPrice - discountAmount, 0),
      };
      return acc;
    },
    {} as Record<MembershipPlanKey, MembershipPlanView>,
  );

  return { beginning, deadline, startDate, endDate, plans };
}

/** 1,000 단위 콤마 (예: 79000 -> "79,000") */
export function formatKRW(value: number): string {
  return value.toLocaleString('ko-KR');
}
