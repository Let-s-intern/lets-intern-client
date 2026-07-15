/**
 * 3.3.T1 — 미션 일자 앵커 기간 규칙 순수함수 단위 테스트.
 *
 * PRD §4·§6-2 표 근거:
 *  - 슬롯 오픈: 미션 시작 -3일 00:00:00 ~ -2일 23:59:59
 *  - 진행(LIVE): 미션 종료 +2일 00:00:00 ~ +4일 23:59:59
 *  - 예약:     미션 시작일 00:00:00 ~ 미션 종료일 23:59:59
 */
import { describe, expect, it } from 'vitest';

import {
  PROGRESS_OFFSET_DAYS,
  SLOT_OPEN_OFFSET_DAYS,
  computeProgressWindow,
  computeReservationWindow,
  computeSlotOpenWindow,
  isWithinWindow,
  selectSlotOpenWindow,
} from '../feedbackScheduleRules';

/** 로컬 시각 비교용 — 'YYYY-MM-DD HH:mm:ss' 로 포맷 */
function fmt(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

describe('오프셋 상수', () => {
  it('슬롯 오픈은 -3일 시작 ~ -2일 끝, 진행은 +2일 시작 ~ +4일 끝', () => {
    expect(SLOT_OPEN_OFFSET_DAYS).toEqual({ start: -3, end: -2 });
    expect(PROGRESS_OFFSET_DAYS).toEqual({ start: 2, end: 4 });
  });
});

describe('computeSlotOpenWindow', () => {
  it('미션 시작 -3일 00:00:00 ~ -2일 23:59:59 구간을 만든다', () => {
    const w = computeSlotOpenWindow('2026-07-12T09:30:00');
    expect(fmt(w.start)).toBe('2026-07-09 00:00:00');
    expect(fmt(w.end)).toBe('2026-07-10 23:59:59');
  });
});

describe('computeProgressWindow', () => {
  it('미션 종료 +2일 00:00:00 ~ +4일 23:59:59 구간을 만든다', () => {
    const w = computeProgressWindow('2026-07-15T18:00:00');
    expect(fmt(w.start)).toBe('2026-07-17 00:00:00');
    expect(fmt(w.end)).toBe('2026-07-19 23:59:59');
  });
});

describe('computeReservationWindow', () => {
  it('미션 시작일 00:00:00 ~ 미션 종료일 23:59:59 구간을 만든다', () => {
    const w = computeReservationWindow(
      '2026-07-12T09:30:00',
      '2026-07-15T18:00:00',
    );
    expect(fmt(w.start)).toBe('2026-07-12 00:00:00');
    expect(fmt(w.end)).toBe('2026-07-15 23:59:59');
  });
});

describe('isWithinWindow', () => {
  const window = computeSlotOpenWindow('2026-07-12T00:00:00'); // 07-09 00:00 ~ 07-10 23:59:59

  it('구간 내부 시각은 true', () => {
    expect(isWithinWindow(new Date('2026-07-09T12:00:00'), window)).toBe(true);
    expect(isWithinWindow(new Date('2026-07-10T23:59:00'), window)).toBe(true);
  });

  it('구간 경계(시작 00:00:00)를 포함한다', () => {
    expect(isWithinWindow(new Date('2026-07-09T00:00:00'), window)).toBe(true);
  });

  it('구간 이전/이후 시각은 false', () => {
    expect(isWithinWindow(new Date('2026-07-08T23:59:59'), window)).toBe(false);
    expect(isWithinWindow(new Date('2026-07-11T00:00:00'), window)).toBe(false);
  });
});

describe('selectSlotOpenWindow', () => {
  // 미션 시작 2026-07-12 → 오픈 윈도 07-09 00:00 ~ 07-10 23:59:59
  const missionA = '2026-07-12T09:30:00';

  it('미션 일자가 없으면 null (BE 미반영 폴백 → 게이팅 미적용)', () => {
    expect(
      selectSlotOpenWindow([], new Date('2026-07-09T12:00:00')),
    ).toBeNull();
    expect(
      selectSlotOpenWindow(
        [null, undefined, ''],
        new Date('2026-07-09T12:00:00'),
      ),
    ).toBeNull();
  });

  it('now가 오픈 윈도 안이면 그 윈도를 반환한다 (게이팅 통과)', () => {
    const w = selectSlotOpenWindow([missionA], new Date('2026-07-09T12:00:00'));
    expect(w).not.toBeNull();
    expect(isWithinWindow(new Date('2026-07-09T12:00:00'), w!)).toBe(true);
  });

  it('now가 윈도 이전이면 앞으로 열릴 그 예정 윈도를 반환한다 (안내용)', () => {
    // now(07-01)는 07-09 오픈 전 → 예정 윈도를 안내
    const w = selectSlotOpenWindow([missionA], new Date('2026-07-01T00:00:00'));
    expect(w).not.toBeNull();
    // 반환 윈도 자체는 07-09 시작
    expect(isWithinWindow(new Date('2026-07-09T00:00:00'), w!)).toBe(true);
    // 현재 시각은 그 윈도 밖 → 게이팅 활성
    expect(isWithinWindow(new Date('2026-07-01T00:00:00'), w!)).toBe(false);
  });

  it('now가 모든 윈도 이후(전부 과거)면 null (게이팅 미적용)', () => {
    expect(
      selectSlotOpenWindow([missionA], new Date('2026-08-01T00:00:00')),
    ).toBeNull();
  });

  it('여러 미션 중 하나라도 now를 포함하면 그 활성 윈도를 우선 반환한다 (union)', () => {
    const missionFuture = '2026-08-20T00:00:00'; // 오픈 08-17~08-18
    const w = selectSlotOpenWindow(
      [missionFuture, missionA],
      new Date('2026-07-10T10:00:00'), // missionA 윈도 안
    );
    expect(w).not.toBeNull();
    expect(isWithinWindow(new Date('2026-07-10T10:00:00'), w!)).toBe(true);
  });

  it('활성 윈도가 없으면 가장 가까운 예정 윈도를 반환한다', () => {
    const missionFar = '2026-09-20T00:00:00'; // 오픈 09-17~
    const missionNear = '2026-08-01T00:00:00'; // 오픈 07-29~
    const w = selectSlotOpenWindow(
      [missionFar, missionNear],
      new Date('2026-07-20T00:00:00'),
    );
    expect(w).not.toBeNull();
    // 가까운 예정(07-29 시작)을 골라야 한다
    expect(isWithinWindow(new Date('2026-07-29T00:00:00'), w!)).toBe(true);
    expect(isWithinWindow(new Date('2026-09-17T00:00:00'), w!)).toBe(false);
  });
});
