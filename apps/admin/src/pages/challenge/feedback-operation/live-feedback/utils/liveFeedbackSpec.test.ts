import { describe, expect, it } from 'vitest';
import type { FeedbackAdminVo } from '@/api/feedback/feedbackSchema';
import { resolveAdminVoLiveSpec, resolveRowTone } from './liveFeedbackSpec';

/** 진행일시 분기 기준 시각: 세션은 2026-06-09 17:00~17:30 으로 고정. */
const START = '2026-06-09T17:00:00';
const END = '2026-06-09T17:30:00';
const BEFORE = new Date('2026-06-09T16:00:00');
const DURING = new Date('2026-06-09T17:10:00');
const AFTER = new Date('2026-06-09T18:00:00');

function makeVo(over: Partial<FeedbackAdminVo> = {}): FeedbackAdminVo {
  return {
    feedbackId: 1,
    programTitle: '챌린지',
    mentorName: '멘토',
    menteeName: '멘티',
    startDate: START,
    endDate: END,
    createDate: '2026-06-01T09:00:00',
    mentorStatus: 'PENDING',
    menteeStatus: 'PENDING',
    status: 'RESERVED',
    ...over,
  };
}

describe('resolveAdminVoLiveSpec — 진리표 도달 가능 케이스', () => {
  it('진행 전: 멘토·멘티 모두 진행 예정 (진리표 4행)', () => {
    const spec = resolveAdminVoLiveSpec(makeVo(), BEFORE);
    expect(spec.mentorBadge?.label).toBe('진행 예정');
    expect(spec.menteeBadge?.label).toBe('진행 예정');
    expect(spec.mentorAttendance).toBe('-');
    expect(spec.menteeAttendance).toBe('-');
  });

  it('진행 중: 멘토·멘티 모두 진행 중 (진리표 8행)', () => {
    const spec = resolveAdminVoLiveSpec(makeVo(), DURING);
    expect(spec.mentorBadge?.label).toBe('진행 중');
    expect(spec.menteeBadge?.label).toBe('진행 중');
  });

  it('진행 후 멘토 참여·멘티 참여: 둘 다 진행 완료 (진리표 9행)', () => {
    const spec = resolveAdminVoLiveSpec(
      makeVo({ mentorStatus: 'PRESENT', menteeStatus: 'PRESENT' }),
      AFTER,
    );
    expect(spec.mentorBadge?.label).toBe('진행 완료');
    expect(spec.menteeBadge?.label).toBe('진행 완료');
    expect(spec.mentorAttendance).toBe('참여');
    expect(spec.menteeAttendance).toBe('참여');
  });

  it('진행 후 멘토 미참여·멘티 참여: 멘토 미진행 / 멘티 확인 필요 (진리표 10행)', () => {
    const spec = resolveAdminVoLiveSpec(
      makeVo({ mentorStatus: 'ABSENT', menteeStatus: 'PRESENT' }),
      AFTER,
    );
    expect(spec.mentorBadge?.label).toBe('미진행');
    expect(spec.menteeBadge?.label).toBe('확인 필요');
  });

  it('진행 후 멘토 참여·멘티 미참여: 멘토 진행 완료 / 멘티 미참여 (진리표 11행)', () => {
    const spec = resolveAdminVoLiveSpec(
      makeVo({ mentorStatus: 'PRESENT', menteeStatus: 'ABSENT' }),
      AFTER,
    );
    expect(spec.mentorBadge?.label).toBe('진행 완료');
    expect(spec.menteeBadge?.label).toBe('미참여');
  });

  it('진행 후 멘토 미참여·멘티 미참여: 멘토 미진행 / 멘티 미참여 (진리표 12행)', () => {
    const spec = resolveAdminVoLiveSpec(
      makeVo({ mentorStatus: 'ABSENT', menteeStatus: 'ABSENT' }),
      AFTER,
    );
    expect(spec.mentorBadge?.label).toBe('미진행');
    expect(spec.menteeBadge?.label).toBe('미참여');
  });

  it('진행 후 출석 미체크(PENDING): 멘토 미진행 / 멘티 미참여로 본다', () => {
    const spec = resolveAdminVoLiveSpec(makeVo(), AFTER);
    expect(spec.mentorBadge?.label).toBe('미진행');
    expect(spec.menteeBadge?.label).toBe('미참여');
  });

  it('예약취소: 뱃지·출석 모두 비움 (취소 표기 미구현)', () => {
    const spec = resolveAdminVoLiveSpec(makeVo({ status: 'CANCELED' }), AFTER);
    expect(spec.mentorBadge).toBeNull();
    expect(spec.menteeBadge).toBeNull();
    expect(spec.mentorAttendance).toBe('-');
    expect(spec.menteeAttendance).toBe('-');
  });
});

describe('resolveRowTone — 행 배경 톤(참여 조합 기준)', () => {
  const toneOf = (over: Partial<FeedbackAdminVo>, now: Date) =>
    resolveRowTone(resolveAdminVoLiveSpec(makeVo(over), now));

  it('둘 다 참여 → green(초록)', () => {
    expect(
      toneOf({ mentorStatus: 'PRESENT', menteeStatus: 'PRESENT' }, AFTER),
    ).toBe('green');
  });

  it('멘토만 참여(한쪽만) → red(빨강)', () => {
    expect(
      toneOf({ mentorStatus: 'PRESENT', menteeStatus: 'ABSENT' }, AFTER),
    ).toBe('red');
  });

  it('멘티만 참여(한쪽만) → red(빨강)', () => {
    expect(
      toneOf({ mentorStatus: 'ABSENT', menteeStatus: 'PRESENT' }, AFTER),
    ).toBe('red');
  });

  it('둘 다 미참여 → gray(진한 회색)', () => {
    expect(
      toneOf({ mentorStatus: 'ABSENT', menteeStatus: 'ABSENT' }, AFTER),
    ).toBe('gray');
  });

  it('아직 진행 안 한 진행 예정 → none(흰색)', () => {
    expect(toneOf({}, BEFORE)).toBe('none');
  });

  it('진행 중 → inProgress(강조) — 출석 조합과 무관', () => {
    expect(toneOf({}, DURING)).toBe('inProgress');
    // 진행 중이면 한쪽만 참여여도 강조가 우선한다.
    expect(
      toneOf({ mentorStatus: 'PRESENT', menteeStatus: 'PENDING' }, DURING),
    ).toBe('inProgress');
  });

  it('예약취소 → none(흰색)', () => {
    expect(toneOf({ status: 'CANCELED' }, AFTER)).toBe('none');
  });
});
