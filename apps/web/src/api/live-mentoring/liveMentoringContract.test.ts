/*
  2.4.Q1 — 로컬 서버가 실제로 내려준 응답을 zod 스키마에 통과시킨다.

  아래 픽스처는 손으로 쓴 것이 아니라 `POST /api/v1/live-mentoring/openings/6/applications`
  의 응답을 **그대로 붙여 넣은 것**이다 (2026-08-21, 로컬 `openingId=6`).
  손으로 만든 픽스처는 스키마를 보고 쓰게 되므로 어긋남을 잡지 못한다.

  서버 DTO 가 바뀌면 여기서 먼저 깨진다. 그때는 스키마를 서버에 맞추고 이 픽스처도
  새로 받은 응답으로 갈아 끼운다.
*/
import { createLiveMentoringApplicationResponseSchema } from './liveMentoringSchema';

/** 30분 플랜 · 슬롯 1칸 · 질문 나중에 작성 (`applicationId=14`). */
const CREATE_30MIN = {
  applicationId: 14,
  product: {
    durationPriceId: 4,
    name: '어드민 1대1 라이브 멘토링',
    durationMinutes: 30,
  },
  reservation: {
    slotIds: [148],
    startAt: '2026-09-15T10:30:00',
    endAt: '2026-09-15T11:00:00',
    applicationStatus: 'PAYMENT_PENDING',
    expiresAt: '2026-08-21T16:22:56.029739',
  },
  mentoringTypes: [{ mentoringTypeId: 1, name: '자기소개서' }],
  payment: {
    originalPrice: 35000,
    productDiscount: 0,
    couponDiscount: 0,
    finalAmount: 35000,
    orderId: 'ON5-6V4M6A57',
    currency: 'KRW',
  },
};

/** 60분 플랜 · 연속 2칸 · 질문 즉시 작성 + URL 첨부 (`applicationId=15`). */
const CREATE_60MIN = {
  applicationId: 15,
  product: {
    durationPriceId: 5,
    name: '어드민 1대1 라이브 멘토링',
    durationMinutes: 60,
  },
  reservation: {
    slotIds: [158, 159],
    startAt: '2026-09-19T12:00:00',
    endAt: '2026-09-19T13:00:00',
    applicationStatus: 'PAYMENT_PENDING',
    expiresAt: '2026-08-21T16:23:16.283507',
  },
  mentoringTypes: [{ mentoringTypeId: 1, name: '자기소개서' }],
  payment: {
    originalPrice: 60000,
    productDiscount: 0,
    couponDiscount: 0,
    finalAmount: 60000,
    orderId: 'gKEMQwWav2Lh',
    currency: 'KRW',
  },
};

describe('실제 서버 응답 대조 — 신청 생성', () => {
  it('30분 플랜 응답이 스키마를 통과한다', () => {
    const parsed =
      createLiveMentoringApplicationResponseSchema.parse(CREATE_30MIN);
    expect(parsed.payment.finalAmount).toBe(35000);
    expect(parsed.reservation.slotIds).toEqual([148]);
    expect(parsed.reservation.applicationStatus).toBe('PAYMENT_PENDING');
  });

  it('60분 플랜의 연속 2슬롯 응답이 스키마를 통과한다', () => {
    const parsed =
      createLiveMentoringApplicationResponseSchema.parse(CREATE_60MIN);
    expect(parsed.reservation.slotIds).toHaveLength(2);
    // 두 칸이 합쳐져 한 시간 구간 하나로 내려온다
    expect(parsed.reservation.startAt).toBe('2026-09-19T12:00:00');
    expect(parsed.reservation.endAt).toBe('2026-09-19T13:00:00');
  });

  /*
    `expiresAt` 에만 마이크로초가 붙어 온다("...T16:22:56.029739"). 나머지 시각은
    초까지다. 스키마가 z.string() 이라 둘 다 통과하지만, 이 값을 Date 로 파싱해
    남은 시간을 세는 쪽(Push 3 의 10분 선점 카운트다운)이 형식을 가정하면 깨진다.
  */
  it('expiresAt 은 마이크로초가 붙고 예약 시각은 초까지다', () => {
    const parsed =
      createLiveMentoringApplicationResponseSchema.parse(CREATE_30MIN);
    expect(parsed.reservation.expiresAt).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+$/,
    );
    expect(parsed.reservation.startAt).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/,
    );
  });

  /*
    응답 DTO 에는 orderId 를 null 로 채우는 생성자 오버로드가 있다. 신청 생성
    경로는 매퍼에서 항상 채우므로 스키마를 non-null 로 뒀다 — 실측으로 확인한다.
  */
  it('orderId 가 실제로 채워져 온다 — Toss 에 넘길 값이다', () => {
    expect(
      createLiveMentoringApplicationResponseSchema.parse(CREATE_30MIN).payment
        .orderId,
    ).toBe('ON5-6V4M6A57');
    expect(
      createLiveMentoringApplicationResponseSchema.parse(CREATE_60MIN).payment
        .orderId,
    ).toBe('gKEMQwWav2Lh');
  });
});
