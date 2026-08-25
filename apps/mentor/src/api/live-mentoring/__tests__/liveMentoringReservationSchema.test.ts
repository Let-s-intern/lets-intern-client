import { describe, expect, it } from 'vitest';

import {
  liveMentoringReservationListSchema,
  liveMentoringReservationSchema,
} from '../liveMentoringSchema';

/**
 * 멘토 1대1 예약 응답 계약(`MentorLiveMentoringReservationResponse`) 파싱 검증.
 *
 * 서버가 결제 완료 확정 건만 내리므로 스키마도 거르지 않는다 — `status` 는 계약 그대로
 * 4종을 모두 받아들이고, 필터링은 서버 한 곳에서만 한다.
 */
const RESERVATION = {
  applicationId: 91001,
  menteeId: 51001,
  menteeName: '김일대',
  productName: '자소서 실전 첨삭 멘토링',
  durationMinutes: 60,
  reservationStartAt: '2026-08-26T10:00:00',
  reservationEndAt: '2026-08-26T11:00:00',
  status: 'CONFIRMED',
  questionWritten: true,
  attachmentSubmitted: false,
  createDate: '2026-08-20T09:00:00',
};

describe('liveMentoringReservationSchema', () => {
  it('확정 예약 1건을 파싱한다', () => {
    const parsed = liveMentoringReservationSchema.parse(RESERVATION);
    expect(parsed.menteeName).toBe('김일대');
    expect(parsed.durationMinutes).toBe(60);
    expect(parsed.questionWritten).toBe(true);
    expect(parsed.attachmentSubmitted).toBe(false);
  });

  it.each(['PAYMENT_PENDING', 'EXPIRED', 'CANCELED', 'CONFIRMED'])(
    'status %s 를 받아들인다 (거르지 않는다)',
    (status) => {
      expect(() =>
        liveMentoringReservationSchema.parse({ ...RESERVATION, status }),
      ).not.toThrow();
    },
  );

  it('계약에 없는 status 는 거부한다', () => {
    expect(() =>
      liveMentoringReservationSchema.parse({ ...RESERVATION, status: 'DONE' }),
    ).toThrow();
  });

  it('필수 필드가 빠지면 거부한다', () => {
    const { menteeName: _omitted, ...withoutMentee } = RESERVATION;
    expect(() => liveMentoringReservationSchema.parse(withoutMentee)).toThrow();
  });

  it('목록 응답은 reservationList 한 키뿐이다 (페이지네이션 없음)', () => {
    const parsed = liveMentoringReservationListSchema.parse({
      reservationList: [RESERVATION],
    });
    expect(parsed.reservationList).toHaveLength(1);
    expect(parsed).not.toHaveProperty('pageInfo');
  });

  it('예약이 없으면 빈 배열로 파싱된다', () => {
    expect(
      liveMentoringReservationListSchema.parse({ reservationList: [] })
        .reservationList,
    ).toEqual([]);
  });
});
