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

  it('status 가 null 이면 notSubmitted (스키마 기본값이 ABSENT)', () => {
    expect(
      resolveWrittenSubmissionState({ status: null, attendanceId: 1 }),
    ).toBe('notSubmitted');
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
