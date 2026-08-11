import { describe, expect, it } from 'vitest';

import {
  canViewSubmission,
  canWriteWrittenFeedback,
  resolveWrittenSubmissionState,
} from '../writtenSubmissionState';

describe('resolveWrittenSubmissionState', () => {
  it('PRESENT + 출석 id 있음 → submitted', () => {
    expect(
      resolveWrittenSubmissionState({ status: 'PRESENT', attendanceId: 1 }),
    ).toBe('submitted');
  });

  it('UPDATED(제출 후 수정) + 출석 id 있음 → submitted', () => {
    expect(
      resolveWrittenSubmissionState({ status: 'UPDATED', attendanceId: 1 }),
    ).toBe('submitted');
  });

  it('LATE + 출석 id 있음 → late', () => {
    expect(
      resolveWrittenSubmissionState({ status: 'LATE', attendanceId: 1 }),
    ).toBe('late');
  });

  it('ABSENT → notSubmitted', () => {
    expect(
      resolveWrittenSubmissionState({ status: 'ABSENT', attendanceId: 1 }),
    ).toBe('notSubmitted');
  });

  /**
   * 라이브 모달은 `MenteeList` 를 공유하면서 `status: null` 을 넘긴다.
   * null 을 미제출로 판정하면 예약만 된 라이브 세션이 전부 '미제출' 배지가 된다.
   * 서면 목록은 스키마가 null 을 'ABSENT' 로 채우므로 여기서 막을 필요가 없다.
   */
  it('status 가 null 이면 미제출로 보지 않는다 (라이브 리스트 회귀 방지)', () => {
    expect(
      resolveWrittenSubmissionState({ status: null, attendanceId: 1 }),
    ).toBe('submitted');
    expect(
      resolveWrittenSubmissionState({ status: undefined, attendanceId: 1 }),
    ).toBe('submitted');
  });

  it('출석 행이 없으면(id null) status 와 무관하게 notSubmitted', () => {
    expect(
      resolveWrittenSubmissionState({ status: 'PRESENT', attendanceId: null }),
    ).toBe('notSubmitted');
    expect(
      resolveWrittenSubmissionState({ status: 'LATE', attendanceId: null }),
    ).toBe('notSubmitted');
  });
});

describe('canWriteWrittenFeedback', () => {
  it('submitted 만 작성 가능', () => {
    expect(canWriteWrittenFeedback('submitted')).toBe(true);
    expect(canWriteWrittenFeedback('late')).toBe(false);
    expect(canWriteWrittenFeedback('notSubmitted')).toBe(false);
  });
});

describe('canViewSubmission', () => {
  it('지각 제출은 열람만 허용한다', () => {
    expect(canViewSubmission('submitted')).toBe(true);
    expect(canViewSubmission('late')).toBe(true);
    expect(canViewSubmission('notSubmitted')).toBe(false);
  });
});

describe('열람과 작성의 분리 — 이 판정의 핵심', () => {
  it('late 는 열람 가능하지만 작성은 불가하다', () => {
    const state = resolveWrittenSubmissionState({
      status: 'LATE',
      attendanceId: 10,
    });
    expect(canViewSubmission(state)).toBe(true);
    expect(canWriteWrittenFeedback(state)).toBe(false);
  });
});
