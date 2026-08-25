import { describe, expect, it } from 'vitest';

import {
  adminLiveMentoringParticipantListSchema,
  adminLiveMentoringReservationListSchema,
  adminLiveMentoringReservationSchema,
  adminLiveMentoringSchema,
  liveMentoringApplicationStatusSchema,
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

// ── liveMentoringApplicationStatusSchema ─────────────────────────
describe('liveMentoringApplicationStatusSchema', () => {
  it('백엔드 LiveMentoringApplicationStatus 4종만 파싱한다', () => {
    ['PAYMENT_PENDING', 'EXPIRED', 'CANCELED', 'CONFIRMED'].forEach((value) => {
      expect(() =>
        liveMentoringApplicationStatusSchema.parse(value),
      ).not.toThrow();
    });
    expect(() => liveMentoringApplicationStatusSchema.parse('PAID')).toThrow();
  });
});

// ── adminLiveMentoringReservationSchema ──────────────────────────
describe('adminLiveMentoringReservationSchema', () => {
  function makeReservation(overrides: Record<string, unknown> = {}) {
    return {
      applicationId: 501,
      liveMentoringId: 10,
      productName: '이력서 1대1 첨삭',
      mentorId: 21,
      mentorName: '김멘토',
      mentorNickname: '렛츠멘토',
      mentorEmail: 'mentor@letscareer.co.kr',
      menteeId: 77,
      menteeName: '홍길동',
      menteeEmail: 'hong@example.com',
      menteePhoneNum: '01012340001',
      contactEmail: 'contact@example.com',
      durationMinutes: 30,
      reservationStartAt: '2026-08-20T17:00:00',
      reservationEndAt: '2026-08-20T17:30:00',
      status: 'CONFIRMED',
      createDate: '2026-08-15T10:00:00',
      questionDeferred: false,
      questionContent: '이력서 어느 부분을 먼저 볼까요?',
      ...overrides,
    };
  }

  it('예약 한 건을 파싱한다', () => {
    const parsed = adminLiveMentoringReservationSchema.parse(makeReservation());
    expect(parsed.applicationId).toBe(501);
    expect(parsed.status).toBe('CONFIRMED');
  });

  // 슬롯을 아직 잡지 못했거나 반납한 신청은 예약 일시가 없다. 목록이 통째로 죽으면 안 된다.
  it('점유한 슬롯이 없으면 예약 시작·종료가 null 이어도 파싱된다', () => {
    const parsed = adminLiveMentoringReservationSchema.parse(
      makeReservation({ reservationStartAt: null, reservationEndAt: null }),
    );
    expect(parsed.reservationStartAt).toBeNull();
  });

  it('사전 질문을 미룬 신청은 질문 내용이 null 이어도 파싱된다', () => {
    const parsed = adminLiveMentoringReservationSchema.parse(
      makeReservation({ questionDeferred: true, questionContent: null }),
    );
    expect(parsed.questionDeferred).toBe(true);
    expect(parsed.questionContent).toBeNull();
  });

  it('목록 응답은 reservationList 와 pageInfo 를 갖는다', () => {
    const parsed = adminLiveMentoringReservationListSchema.parse({
      reservationList: [makeReservation()],
      pageInfo: {
        pageNum: 0,
        pageSize: 20,
        totalElements: 1,
        totalPages: 1,
      },
    });
    expect(parsed.reservationList).toHaveLength(1);
    expect(parsed.pageInfo.totalElements).toBe(1);
  });
});

// ── adminLiveMentoringParticipantListSchema ──────────────────────
describe('adminLiveMentoringParticipantListSchema', () => {
  function makeParticipant(overrides: Record<string, unknown> = {}) {
    return {
      applicationId: 501,
      paymentId: 900,
      liveMentoringId: 10,
      productName: '이력서 1대1 첨삭',
      mentorId: 21,
      mentorName: '김멘토',
      mentorNickname: '렛츠멘토',
      menteeId: 77,
      menteeName: '홍길동',
      menteeEmail: 'hong@example.com',
      menteePhoneNum: '01012340001',
      durationMinutes: 60,
      reservationStartAt: '2026-08-20T17:00:00',
      reservationEndAt: '2026-08-20T18:00:00',
      originalPrice: 60000,
      productDiscount: 5000,
      couponDiscount: 10000,
      paidAmount: 45000,
      couponId: 3,
      couponName: '여름 쿠폰',
      status: 'CONFIRMED',
      refunded: false,
      refundAmount: 0,
      createDate: '2026-08-15T10:00:00',
      ...overrides,
    };
  }

  it('결제자 한 명을 파싱한다', () => {
    const parsed = adminLiveMentoringParticipantListSchema.parse({
      participantList: [makeParticipant()],
      pageInfo: { pageNum: 0, pageSize: 20, totalElements: 1, totalPages: 1 },
    });
    expect(parsed.participantList[0].paidAmount).toBe(45000);
  });

  it('쿠폰을 쓰지 않은 결제는 쿠폰 필드가 null 이어도 파싱된다', () => {
    const parsed = adminLiveMentoringParticipantListSchema.parse({
      participantList: [makeParticipant({ couponId: null, couponName: null })],
      pageInfo: { pageNum: 0, pageSize: 20, totalElements: 1, totalPages: 1 },
    });
    expect(parsed.participantList[0].couponName).toBeNull();
  });
});
