/**
 * @jest-environment jsdom
 */
import {
  buildChallengeSchedules,
  dawnAfterMission,
  noonOfMission,
} from '@/domain/challenge/utils/__fixtures__/challengeSchedule';
import dayjs from '@/lib/dayjs';
import { renderHook } from '@testing-library/react';
import useCouponRewardPopup from './useCouponRewardPopup';

// 픽스처 편성: 1~23회차 + 보너스(100). 쿠폰 판정에 세는 회차는 23개라 절반은 12개다.
const CHALLENGE_END_DATE = dayjs('2026-08-12T23:59:00+09:00');

const setup = (now: { valueOf: () => number }) => {
  jest.useFakeTimers().setSystemTime(now.valueOf());

  return renderHook(() =>
    useCouponRewardPopup({
      challengeType: 'CAREER_START',
      challengeEndDate: CHALLENGE_END_DATE,
      schedules: buildChallengeSchedules(),
    }),
  ).result;
};

afterEach(() => {
  jest.useRealTimers();
});

describe('useCouponRewardPopup', () => {
  // 예전에는 todayTh 폴백(가장 큰 th + 1 = 101)이 절반 검사를 늘 통과시켜,
  // 진행 중인 미션이 없는 시간대라면 챌린지 첫날에도 팝업이 뜰 수 있었다.
  it('챌린지 첫날에는 뜨지 않는다', () => {
    expect(setup(noonOfMission(1)).current.isOpen).toBe(false);
  });

  it('진행 중인 미션이 없는 첫날 새벽에도 뜨지 않는다', () => {
    expect(setup(dawnAfterMission(1)).current.isOpen).toBe(false);
  });

  it('절반에 못 미치면 뜨지 않는다', () => {
    expect(setup(noonOfMission(12)).current.isOpen).toBe(false);
  });

  it('절반을 지나면 뜬다', () => {
    expect(setup(noonOfMission(13)).current.isOpen).toBe(true);
  });

  it('절반을 지난 뒤 새벽에도 뜬다', () => {
    expect(setup(dawnAfterMission(12)).current.isOpen).toBe(true);
  });

  it('쿠폰이 없는 챌린지 종류면 뜨지 않는다', () => {
    jest.useFakeTimers().setSystemTime(noonOfMission(20).valueOf());

    const { result } = renderHook(() =>
      useCouponRewardPopup({
        challengeType: 'MARKETING',
        challengeEndDate: CHALLENGE_END_DATE,
        schedules: buildChallengeSchedules(),
      }),
    );

    expect(result.current.isOpen).toBe(false);
  });

  it('쿠폰 유효기간(종료 + 2개월)이 지나면 뜨지 않는다', () => {
    jest
      .useFakeTimers()
      .setSystemTime(CHALLENGE_END_DATE.add(3, 'month').valueOf());

    const { result } = renderHook(() =>
      useCouponRewardPopup({
        challengeType: 'CAREER_START',
        challengeEndDate: CHALLENGE_END_DATE,
        schedules: buildChallengeSchedules(),
      }),
    );

    expect(result.current.isOpen).toBe(false);
  });
});
