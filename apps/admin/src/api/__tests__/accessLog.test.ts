import { describe, expect, it } from 'vitest';

import { accessLogListSchema, accessLogRowSchema } from '../accessLog';

/**
 * 스키마는 "정확히 파싱한다"보다 "죽지 않는다"가 더 중요하다.
 * 목록이 통째로 파싱 오류로 사라지면 운영은 아무 근거 없이 환불을 판단하게 된다.
 */

const baseRow = {
  applicationId: 6001,
  userId: 13101,
  userName: '김렛츠',
  userEmail: 'lets@example.com',
  programType: 'CHALLENGE',
  programId: 319,
  programTitle: '면접 준비 7일 끝장 챌린지 7기',
  paidAt: '2026-07-28T10:00:00',
  firstAccessedAt: '2026-07-30T14:22:00',
  lastAccessedAt: '2026-08-05T09:11:00',
  accessCount: 12,
  daysFromPaymentToFirstAccess: 2,
  targetSummary: [
    { targetType: 'CHALLENGE_DASHBOARD', count: 1 },
    { targetType: 'MISSION', count: 3 },
  ],
};

const wrap = (
  rows: unknown[],
  trackedFrom: unknown = '2026-06-01T00:00:00',
) => ({
  accessLogList: rows,
  pageInfo: {
    pageNum: 0,
    pageSize: 20,
    totalElements: rows.length,
    totalPages: 1,
  },
  trackedFrom,
});

describe('accessLogRowSchema', () => {
  it('정상 이용 행을 파싱한다', () => {
    const parsed = accessLogRowSchema.parse(baseRow);

    expect(parsed.applicationId).toBe(6001);
    expect(parsed.daysFromPaymentToFirstAccess).toBe(2);
    expect(parsed.targetSummary).toHaveLength(2);
  });

  it('미이용 행(최초 이용 null · 횟수 0)을 파싱한다', () => {
    const parsed = accessLogRowSchema.parse({
      ...baseRow,
      firstAccessedAt: null,
      lastAccessedAt: null,
      accessCount: 0,
      daysFromPaymentToFirstAccess: null,
      targetSummary: [],
    });

    expect(parsed.firstAccessedAt).toBeNull();
    expect(parsed.accessCount).toBe(0);
  });

  it('결제 시각이 없는 행도 파싱한다', () => {
    // 판정 근거가 없는 행이다. 파싱에서 걸러 버리면 화면에서 존재 자체가 사라진다.
    const parsed = accessLogRowSchema.parse({ ...baseRow, paidAt: null });

    expect(parsed.paidAt).toBeNull();
  });

  it('유저 정보가 통째로 비어도 파싱한다', () => {
    // 탈퇴 등으로 유저 행이 사라진 경우다.
    const parsed = accessLogRowSchema.parse({
      ...baseRow,
      userId: null,
      userName: null,
      userEmail: null,
    });

    expect(parsed.userName).toBeNull();
  });

  it('선택 필드가 아예 빠져도 파싱한다', () => {
    // 서버가 필드를 늦게 붙이는 동안에도 화면이 떠 있어야 한다.
    const parsed = accessLogRowSchema.parse({ applicationId: 6009 });

    expect(parsed.applicationId).toBe(6009);
    expect(parsed.targetSummary).toBeUndefined();
  });

  it('모르는 programType 이 와도 파싱이 터지지 않는다', () => {
    // LIVE·REPORT 는 이번 적재 범위 밖이고, 타입은 앞으로 더 늘어난다.
    const parsed = accessLogRowSchema.parse({
      ...baseRow,
      programType: 'MEMBERSHIP',
    });

    expect(parsed.programType).toBe('MEMBERSHIP');
  });

  it('모르는 targetType 이 와도 파싱이 터지지 않는다', () => {
    const parsed = accessLogRowSchema.parse({
      ...baseRow,
      targetSummary: [{ targetType: 'LIVE_SESSION', count: 2 }],
    });

    expect(parsed.targetSummary?.[0]?.targetType).toBe('LIVE_SESSION');
  });

  it('행 키가 없으면 거절한다', () => {
    // applicationId 는 행의 정체 그 자체다. 없으면 무엇에 대한 기록인지 말할 수 없다.
    expect(() =>
      accessLogRowSchema.parse({ ...baseRow, applicationId: null }),
    ).toThrow();
  });
});

describe('accessLogListSchema', () => {
  it('집계 시작 시각을 최상위에서 읽는다', () => {
    const parsed = accessLogListSchema.parse(wrap([baseRow]));

    expect(parsed.trackedFrom).toBe('2026-06-01T00:00:00');
  });

  it('집계 시작 시각이 null 이어도 파싱한다', () => {
    // 이 경우 화면은 집계이전·미이용을 가를 수 없어 전부 `확인 불가` 로 간다.
    const parsed = accessLogListSchema.parse(wrap([baseRow], null));

    expect(parsed.trackedFrom).toBeNull();
  });

  it('집계 시작 시각 필드가 없어도 파싱한다', () => {
    const parsed = accessLogListSchema.parse({
      accessLogList: [baseRow],
      pageInfo: {
        pageNum: 0,
        pageSize: 20,
        totalElements: 1,
        totalPages: 1,
      },
    });

    expect(parsed.trackedFrom).toBeUndefined();
  });

  it('빈 목록을 파싱한다', () => {
    const parsed = accessLogListSchema.parse(wrap([]));

    expect(parsed.accessLogList).toHaveLength(0);
  });
});
