import { describe, expect, it } from 'vitest';

import {
  adminLiveMentoringSchema,
  liveMentoringStatusSchema,
} from '../liveMentoringSchema';

// ── liveMentoringStatusSchema ────────────────────────────────────
describe('liveMentoringStatusSchema', () => {
  it('백엔드 LiveMentoringStatus 3종(DRAFT/APPROVED/INACTIVE)만 파싱한다', () => {
    expect(() => liveMentoringStatusSchema.parse('DRAFT')).not.toThrow();
    expect(() => liveMentoringStatusSchema.parse('APPROVED')).not.toThrow();
    expect(() => liveMentoringStatusSchema.parse('INACTIVE')).not.toThrow();
  });

  it('더 이상 존재하지 않는 PENDING_REVIEW/REJECTED 는 파싱 실패한다', () => {
    expect(() => liveMentoringStatusSchema.parse('PENDING_REVIEW')).toThrow();
    expect(() => liveMentoringStatusSchema.parse('REJECTED')).toThrow();
  });
});

// ── adminLiveMentoringSchema ─────────────────────────────────────
describe('adminLiveMentoringSchema', () => {
  function makeRow(overrides: Record<string, unknown> = {}) {
    return {
      liveMentoringId: 10,
      mentorId: 21,
      mentorNickname: '렛츠멘토',
      mentorProfileImage: null,
      title: '이력서 피드백',
      status: 'APPROVED',
      categories: ['RESUME'],
      hasDetailPage: true,
      createDate: '2026-08-03T12:00:00',
      lastModifiedDate: '2026-08-03T12:00:00',
      currentOpening: null,
      ...overrides,
    };
  }

  it('approvedAt/approvedByUserId 없이도 정상 파싱된다 (백엔드 AdminLiveMentoringVo 에 없는 필드)', () => {
    const parsed = adminLiveMentoringSchema.parse(makeRow());
    expect('approvedAt' in parsed).toBe(false);
    expect('approvedByUserId' in parsed).toBe(false);
  });

  it('응답에 approvedAt/approvedByUserId 가 섞여 와도 파싱은 성공한다(초과 필드는 무시)', () => {
    expect(() =>
      adminLiveMentoringSchema.parse(
        makeRow({ approvedAt: '2026-08-04T14:30:00', approvedByUserId: 1 }),
      ),
    ).not.toThrow();
  });

  // LC-3206 — currentOpening 에서 모집 기간이 사라졌다. 남겨 두면 목록이 통째로 죽는다.
  it('currentOpening 에 모집 기간 필드가 없어도 파싱된다', () => {
    const parsed = adminLiveMentoringSchema.parse(
      makeRow({
        currentOpening: {
          openingId: 220,
          status: 'OPEN',
          durationPrices: [{ duration: 30, price: 35000 }],
          openedAt: '2026-08-03T11:00:00',
          closedAt: null,
          closeReason: null,
          closedByUserId: null,
          createDate: '2026-08-03T11:00:00',
          lastModifiedDate: '2026-08-03T11:00:00',
        },
      }),
    );
    expect(parsed.currentOpening?.openingId).toBe(220);
    expect(parsed.currentOpening).not.toHaveProperty('feedbackStartDate');
  });
});
