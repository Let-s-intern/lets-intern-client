import { describe, expect, it } from 'vitest';
import type { AdminLiveMentoringReservation } from '@/api/live-mentoring/liveMentoringSchema';
import { toLiveSpecInput } from './reservationRow';

const makeReservation = (
  overrides: Partial<AdminLiveMentoringReservation> = {},
): AdminLiveMentoringReservation => ({
  applicationId: 501,
  liveMentoringId: 10,
  productName: '이력서 1대1 첨삭',
  mentorId: 21,
  mentorName: '김멘토',
  mentorNickname: '렛츠멘토',
  mentorEmail: null,
  menteeId: 77,
  menteeName: '최멘티',
  menteeEmail: null,
  menteePhoneNum: null,
  contactEmail: null,
  durationMinutes: 30,
  reservationStartAt: '2026-05-30T19:00:00',
  reservationEndAt: '2026-05-30T19:30:00',
  status: 'CONFIRMED',
  createDate: '2026-05-21T09:00:00',
  questionDeferred: false,
  questionContent: null,
  mentorStatus: 'PRESENT',
  menteeStatus: 'ABSENT',
  ...overrides,
});

describe('toLiveSpecInput', () => {
  it('CONFIRMED 는 판정 대상(RESERVED)으로 옮기고 시각·출석을 그대로 싣는다', () => {
    expect(toLiveSpecInput(makeReservation())).toEqual({
      status: 'RESERVED',
      startDate: '2026-05-30T19:00:00',
      endDate: '2026-05-30T19:30:00',
      mentorStatus: 'PRESENT',
      menteeStatus: 'ABSENT',
    });
  });

  it('CANCELED 는 표시 없음(CANCELED)으로 옮긴다', () => {
    expect(
      toLiveSpecInput(makeReservation({ status: 'CANCELED' }))?.status,
    ).toBe('CANCELED');
  });

  it('PAYMENT_PENDING 은 잡힌 예약이 아니라 표시 없음으로 옮긴다', () => {
    expect(
      toLiveSpecInput(makeReservation({ status: 'PAYMENT_PENDING' }))?.status,
    ).toBe('CANCELED');
  });

  it('EXPIRED 는 잡힌 예약이 아니라 표시 없음으로 옮긴다', () => {
    expect(
      toLiveSpecInput(makeReservation({ status: 'EXPIRED' }))?.status,
    ).toBe('CANCELED');
  });

  it('슬롯이 없으면 진행 시점을 가를 수 없어 null 이다', () => {
    expect(
      toLiveSpecInput(
        makeReservation({ reservationStartAt: null, reservationEndAt: null }),
      ),
    ).toBeNull();
    expect(
      toLiveSpecInput(makeReservation({ reservationEndAt: null })),
    ).toBeNull();
  });
});
