import { describe, expect, it } from 'vitest';

import type { ChallengeMentorVo } from '@/api/user/user';

import {
  type ChallengePeriod,
  toActiveChallengePeriods,
  toChallengePeriodCellKeys,
} from '../challengePeriod';

const challenge = (
  overrides: Partial<ChallengeMentorVo> = {},
): ChallengeMentorVo => ({
  challengeMentorId: 1,
  challengeId: 1,
  programStatusType: 'PROCEEDING',
  title: '기필코 경험정리 챌린지 21기',
  shortDesc: '',
  thumbnail: '',
  startDate: '2026-09-01T00:00:00',
  endDate: '2026-09-21T23:59:59',
  ...overrides,
});

const TIMES = ['09:00', '09:30', '10:00'];

describe('toActiveChallengePeriods — 진행중인 챌린지만 남긴다', () => {
  it('종료된 챌린지 기간은 음영 대상에서 빠진다', () => {
    /*
     * 회귀 케이스 — `GET /challenge-mentor` 는 종료된 챌린지까지 전부 준다.
     * 그대로 깔면 화면이 서버 필터보다 넓게 막힌 것처럼 보이고, 멘토는 1대1
     * 신청이 안 들어온다고 오해한다(실제로는 들어온다).
     */
    const periods = toActiveChallengePeriods([
      challenge({ challengeId: 1, programStatusType: 'PROCEEDING' }),
      challenge({ challengeId: 2, programStatusType: 'POST' }),
    ]);

    expect(periods.map((period) => period.challengeId)).toEqual([1]);
  });

  it('모집 예정(PREV)도 음영 대상이 아니다', () => {
    // 서버 필터는 `startDate <= now <= endDate` 인 챌린지만 본다.
    expect(
      toActiveChallengePeriods([challenge({ programStatusType: 'PREV' })]),
    ).toEqual([]);
  });

  it('기간과 제목을 그대로 옮긴다', () => {
    expect(toActiveChallengePeriods([challenge()])).toEqual([
      {
        challengeId: 1,
        title: '기필코 경험정리 챌린지 21기',
        startDate: '2026-09-01T00:00:00',
        endDate: '2026-09-21T23:59:59',
      },
    ]);
  });
});

describe('toChallengePeriodCellKeys — 기간을 그리드 셀로 펼친다', () => {
  const period = (
    overrides: Partial<ChallengePeriod> = {},
  ): ChallengePeriod => ({
    challengeId: 1,
    title: '챌린지',
    startDate: '2026-09-02T09:30:00',
    endDate: '2026-09-03T09:00:00',
    ...overrides,
  });

  it('기간이 없으면 빈 집합이다', () => {
    expect(toChallengePeriodCellKeys([], ['2026-09-02'], TIMES).size).toBe(0);
  });

  it('시작·종료 경계 셀을 포함하고 그 밖은 뺀다', () => {
    // 판정은 셀 시작 시각 기준이다 — 서버의 기간 판정과 같은 식이다.
    const keys = toChallengePeriodCellKeys(
      [period()],
      ['2026-09-02', '2026-09-03'],
      TIMES,
    );

    expect(keys.has('2026-09-02|09:00')).toBe(false); // 시작 직전
    expect(keys.has('2026-09-02|09:30')).toBe(true); // 시작 경계
    expect(keys.has('2026-09-03|09:00')).toBe(true); // 종료 경계
    expect(keys.has('2026-09-03|09:30')).toBe(false); // 종료 직후
  });

  it('보이는 주 밖의 날짜는 펼치지 않는다', () => {
    // 챌린지 하나가 몇 주씩 이어지므로 전 구간을 펼치면 셀 수천 개가 나온다.
    const keys = toChallengePeriodCellKeys(
      [
        period({
          startDate: '2026-09-01T00:00:00',
          endDate: '2026-09-30T23:59:59',
        }),
      ],
      ['2026-09-02'],
      TIMES,
    );

    expect(keys.size).toBe(TIMES.length);
    expect([...keys].every((key) => key.startsWith('2026-09-02'))).toBe(true);
  });

  it('챌린지가 여러 개면 합집합이다', () => {
    const keys = toChallengePeriodCellKeys(
      [
        period({
          startDate: '2026-09-02T09:00:00',
          endDate: '2026-09-02T09:00:00',
        }),
        period({
          challengeId: 2,
          startDate: '2026-09-02T10:00:00',
          endDate: '2026-09-02T10:00:00',
        }),
      ],
      ['2026-09-02'],
      TIMES,
    );

    expect([...keys].sort()).toEqual(['2026-09-02|09:00', '2026-09-02|10:00']);
  });

  it('날짜만 온 경계값은 그날 전체로 읽는다', () => {
    // 사전순 비교라 종료일을 그대로 쓰면 종료일 당일이 통째로 빠진다.
    const keys = toChallengePeriodCellKeys(
      [period({ startDate: '2026-09-02', endDate: '2026-09-02' })],
      ['2026-09-02'],
      TIMES,
    );

    expect(keys.size).toBe(TIMES.length);
  });
});
