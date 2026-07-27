import dayjs from '@/lib/dayjs';
import { ChallengeType, Schedule } from '@/schema';
import { Dayjs } from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

// 챌린지 종류별 재구매 할인 쿠폰 금액. 목록에 없는 챌린지 종류는 쿠폰이 없다(=팝업 미노출).
const COUPON_AMOUNT_BY_CHALLENGE_TYPE: Partial<Record<ChallengeType, number>> =
  {
    CAREER_START: 5000, // 이력서 챌린지
    EXPERIENCE_SUMMARY: 5000, // 경험정리 챌린지
    PERSONAL_STATEMENT: 8000, // 자기소개서 챌린지
    PORTFOLIO: 8000, // 포트폴리오 챌린지
  };

interface Params {
  challengeType: ChallengeType | undefined;
  challengeEndDate: Dayjs | null | undefined;
  todayTh: number;
  schedules: Schedule[];
}

const useCouponRewardPopup = ({
  challengeType,
  challengeEndDate,
  todayTh,
  schedules,
}: Params) => {
  const [isOpen, setIsOpen] = useState(false);

  const amount = challengeType
    ? COUPON_AMOUNT_BY_CHALLENGE_TYPE[challengeType]
    : undefined;

  // 쿠폰 유효기간: 챌린지 종료일 + 2개월
  // dayjs 객체는 렌더마다 새로 생성되므로, endDate의 실제 시각(primitive) 값에만 의존해 메모이제이션한다.
  const challengeEndDateMs = challengeEndDate?.valueOf();
  const couponEndDate = useMemo(
    () => challengeEndDate?.add(2, 'month'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [challengeEndDateMs],
  );

  useEffect(() => {
    if (!amount) return;

    const missionSchedules = schedules.filter(
      (s) =>
        s.missionInfo.th !== null &&
        s.missionInfo.th !== 0 &&
        s.missionInfo.th < 99,
    );
    if (!missionSchedules.length) return;

    const halfPoint = Math.ceil(missionSchedules.length / 2);
    if (todayTh < halfPoint) return;

    if (!couponEndDate || dayjs().isAfter(couponEndDate)) return;

    setIsOpen(true);
  }, [todayTh, schedules, couponEndDate, amount]);

  return {
    isOpen,
    close: () => setIsOpen(false),
    amount: amount ?? 0,
    endDate: couponEndDate,
  };
};

export default useCouponRewardPopup;
