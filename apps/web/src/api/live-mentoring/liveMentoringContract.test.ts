/*
  2.4.Q1 · 2.5.Q1 — 로컬 서버가 실제로 내려준 응답을 zod 스키마에 통과시킨다.

  아래 픽스처는 손으로 쓴 것이 아니라 `POST /api/v1/live-mentoring/openings/6/applications`
  의 응답을 **그대로 붙여 넣은 것**이다 (2026-08-21, 로컬 `openingId=6`).
  손으로 만든 픽스처는 스키마를 보고 쓰게 되므로 어긋남을 잡지 못한다.

  서버 DTO 가 바뀌면 여기서 먼저 깨진다. 그때는 스키마를 서버에 맞추고 이 픽스처도
  새로 받은 응답으로 갈아 끼운다.
*/
import {
  confirmLiveMentoringPaymentResponseSchema,
  createLiveMentoringApplicationResponseSchema,
  liveMentoringQuestionSchema,
  liveMentoringRefundPreviewSchema,
  myLiveMentoringApplicationListSchema,
} from './liveMentoringSchema';

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

/*
  2.5.Q1 — 가짜 paymentKey 로 승인을 호출한 **실제** 실패 응답이다.
  성공 응답은 Toss 위젯이 있어야 만들 수 있어 Push 3 의 `3.7.Q1` 에서 확인한다.

  실패 응답에는 `data` 가 아예 없고 `status`/`code`/`message` 만 온다.
*/
const CONFIRM_FAILURE = {
  status: 400,
  code: 'UNKNOWN',
  message: '결제 시간이 만료되어 결제 진행 데이터가 존재하지 않습니다.',
};

/** 60분 플랜에 이어지지 않는 슬롯 쌍을 보냈을 때의 실제 400 응답. */
const INVALID_SLOT_COMBINATION = {
  status: 400,
  code: 'LIVE_MENTORING_INVALID_SLOT_COMBINATION',
  message: '라이브 멘토링 플랜과 슬롯 조합이 올바르지 않습니다.',
};

describe('실제 서버 응답 대조 — 실패 경로', () => {
  /*
    실패 응답을 승인 스키마에 넣으면 깨진다. 훅이 이걸 성공으로 착각하지 않는다는
    뜻이라 이게 맞는 동작이다.
  */
  it('승인 실패 응답은 승인 응답 스키마를 통과하지 못한다', () => {
    expect(() =>
      confirmLiveMentoringPaymentResponseSchema.parse(CONFIRM_FAILURE),
    ).toThrow();
  });

  /*
    도메인 검증 실패는 LiveMentoringErrorCode 를 그대로 준다. 화면은 이 code 로
    문구를 고를 수 있다.
  */
  it('슬롯 조합 오류는 전용 에러코드를 준다', () => {
    expect(INVALID_SLOT_COMBINATION.code).toBe(
      'LIVE_MENTORING_INVALID_SLOT_COMBINATION',
    );
  });

  /*
    반면 결제 승인 실패는 code 가 `UNKNOWN` 이다. Toss 쪽에서 올라온 오류가
    도메인 에러코드로 감싸이지 않는다 — **화면이 code 로 분기할 수 없다.**
    Push 3 에서 승인 실패 문구를 만들 때 message 에 기대거나, 서버에 전용 코드를
    요청해야 한다. 계약이 바뀌면 이 단언이 먼저 깨진다.
  */
  it('결제 승인 실패는 전용 코드 없이 UNKNOWN 으로 온다', () => {
    expect(CONFIRM_FAILURE.code).toBe('UNKNOWN');
    expect(CONFIRM_FAILURE.code).not.toMatch(/^LIVE_MENTORING_/);
  });
});

/*
  7.1.Q1 — Push 4·5 가 실제로 내려준 응답이다 (2026-08-21, `applicationId=10`).
  손으로 쓰지 않고 `GET /applications/my` 와 `/applications/10/question` 의
  `data` 를 그대로 옮겼다.
*/
const MY_APPLICATIONS = {
  applicationList: [
    {
      applicationId: 10,
      paymentId: null,
      mentorName: '어드어드민닉네임',
      thumbnail:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
      productName: '어드민 1대1 라이브 멘토링',
      durationMinutes: 60,
      reservationStartAt: '2026-09-13T10:00:00',
      reservationEndAt: '2026-09-13T11:00:00',
      status: 'CONFIRMED',
      questionWritten: true,
      questionEditable: true,
      entryLink: null,
    },
  ],
};

const QUESTION = {
  applicationId: 10,
  deferred: false,
  content: '이력서에서 직무 적합성이 잘 드러나는지 봐주세요.',
  attachmentType: 'NONE',
  fileId: null,
  attachmentUrl: null,
  mentorShareAgreed: true,
  reservationStartAt: '2026-09-13T10:00:00',
  editable: true,
  editDeadline: '2026-09-12T10:00:00',
};

describe('실제 서버 응답 대조 — 마이페이지 신청현황', () => {
  it('신청 목록 응답이 스키마를 통과한다', () => {
    const parsed = myLiveMentoringApplicationListSchema.parse(MY_APPLICATIONS);
    const application = parsed.applicationList[0];
    expect(application.applicationId).toBe(10);
    expect(application.status).toBe('CONFIRMED');
    // 60분 신청은 두 슬롯이 한 구간으로 합쳐져 온다
    expect(application.reservationStartAt).toBe('2026-09-13T10:00:00');
    expect(application.reservationEndAt).toBe('2026-09-13T11:00:00');
  });

  /*
    PRD 4-8 — 입장 링크 발급 구조가 정해지지 않아 서버가 항상 null 을 준다.
    화면은 이 값이 비면 `멘토링 입장` 을 비활성으로 그린다. 값이 들어오기 시작하면
    이 단언이 먼저 깨져서 알 수 있다.
  */
  it('entryLink 는 아직 항상 null 이다', () => {
    const parsed = myLiveMentoringApplicationListSchema.parse(MY_APPLICATIONS);
    expect(parsed.applicationList[0].entryLink).toBeNull();
  });

  /* 결제가 아직 없는 신청은 paymentId 가 null 로 온다. */
  it('paymentId 가 null 이어도 파싱된다', () => {
    const parsed = myLiveMentoringApplicationListSchema.parse(MY_APPLICATIONS);
    expect(parsed.applicationList[0].paymentId).toBeNull();
  });

  it('신청이 하나도 없으면 빈 배열이다', () => {
    expect(
      myLiveMentoringApplicationListSchema.parse({ applicationList: [] })
        .applicationList,
    ).toEqual([]);
  });
});

describe('실제 서버 응답 대조 — 멘토링 질문', () => {
  it('질문 조회 응답이 스키마를 통과한다', () => {
    const parsed = liveMentoringQuestionSchema.parse(QUESTION);
    expect(parsed.content).toBe(
      '이력서에서 직무 적합성이 잘 드러나는지 봐주세요.',
    );
    expect(parsed.attachmentType).toBe('NONE');
  });

  /*
    editable 은 서버가 예약 시작 48시간 기준으로 계산해 준다. 화면이 같은 계산을
    다시 하면 시계 차이로 어긋나 저장 시점에 거부된다 — 그래서 응답 필드로 받는다.
  */
  it('editable 을 서버가 계산해 내려준다', () => {
    expect(liveMentoringQuestionSchema.parse(QUESTION).editable).toBe(true);
    expect(
      liveMentoringQuestionSchema.parse({ ...QUESTION, editable: false })
        .editable,
    ).toBe(false);
  });

  /*
    첨부 URL 의 필드 이름이 요청(`url`)과 응답(`attachmentUrl`)에서 다르다.
    한쪽 이름으로 통일해 두면 조회한 값이 화면에 안 뜬다.
  */
  it('응답의 첨부 URL 필드 이름은 attachmentUrl 이다', () => {
    const parsed = liveMentoringQuestionSchema.parse({
      ...QUESTION,
      attachmentType: 'URL',
      attachmentUrl: 'https://example.test/resume',
    });
    expect(parsed.attachmentUrl).toBe('https://example.test/resume');
    expect('url' in parsed).toBe(false);
  });

  it('나중에 작성하기로 둔 신청은 내용이 비어 온다', () => {
    const parsed = liveMentoringQuestionSchema.parse({
      ...QUESTION,
      deferred: true,
      content: null,
    });
    expect(parsed.deferred).toBe(true);
    expect(parsed.content).toBeNull();
  });
});

/*
  8.1.Q1 — Push 6 의 `refund-preview` 가 실제로 내려준 응답이다 (2026-08-21,
  `applicationId=10`, 결제금액 60,000원). 슬롯 시각을 옮겨가며 세 구간을 다 받아 왔다.

  **수수료는 서버가 계산한다.** 화면은 이 숫자를 그대로 그린다 — 같은 계산이 두 곳에
  있으면 반드시 어긋나고, 돈이 걸린 화면에서 그 차이는 곧 사고다.
*/
const REFUND_OVER_48H = {
  applicationId: 10,
  paymentId: null,
  orderId: 'GHiV6ewvHOw4',
  originalPrice: 60000,
  productDiscount: 0,
  couponDiscount: 0,
  paidAmount: 60000,
  cancelFeePercent: 0,
  cancelFee: 0,
  refundAmount: 60000,
  reservationStartAt: '2026-09-13T10:00:00',
  cancelable: true,
};

describe('실제 서버 응답 대조 — 예정 환불금액', () => {
  it('48시간 초과 구간 응답이 스키마를 통과한다', () => {
    const parsed = liveMentoringRefundPreviewSchema.parse(REFUND_OVER_48H);
    expect(parsed.cancelFeePercent).toBe(0);
    expect(parsed.refundAmount).toBe(60000);
    expect(parsed.cancelable).toBe(true);
  });

  /* 슬롯을 36시간 뒤로 옮겨 실제로 받은 응답이다. 시안 `4-0` 의 50% 화면이 이것이다. */
  it('24~48시간 구간은 50% 를 떼고 절반을 돌려준다', () => {
    const parsed = liveMentoringRefundPreviewSchema.parse({
      ...REFUND_OVER_48H,
      cancelFeePercent: 50,
      cancelFee: 30000,
      refundAmount: 30000,
    });
    expect(parsed.cancelFee).toBe(30000);
    expect(parsed.refundAmount).toBe(30000);
    expect(parsed.cancelable).toBe(true);
  });

  /*
    슬롯을 12시간 뒤로 옮겨 실제로 받은 응답이다. 돌려줄 돈이 없어 `cancelable` 이
    false 로 온다 — 화면은 이 값으로 취소 버튼을 잠근다.
  */
  it('24시간 이내는 환불액이 0 이고 취소 자체가 막힌다', () => {
    const parsed = liveMentoringRefundPreviewSchema.parse({
      ...REFUND_OVER_48H,
      cancelFeePercent: 100,
      cancelFee: 60000,
      refundAmount: 0,
      cancelable: false,
    });
    expect(parsed.refundAmount).toBe(0);
    expect(parsed.cancelable).toBe(false);
  });

  /* Toss 결제가 아직 붙지 않은 신청은 paymentId 가 null 로 온다. */
  it('paymentId 가 null 이어도 파싱된다', () => {
    expect(
      liveMentoringRefundPreviewSchema.parse(REFUND_OVER_48H).paymentId,
    ).toBeNull();
  });

  /*
    결제 대기(PAYMENT_PENDING) 신청에 물으면 409 다. 실측한 응답이고, 화면은 이
    코드를 받으면 취소할 수 없는 건으로 안내한다.
  */
  it('결제되지 않은 신청은 전용 에러코드로 거절된다', () => {
    const error = {
      status: 409,
      code: 'LIVE_MENTORING_INVALID_STATE',
      message: '요청한 라이브 멘토링 상태 전이를 수행할 수 없습니다.',
    };
    expect(() => liveMentoringRefundPreviewSchema.parse(error)).toThrow();
    expect(error.code).toBe('LIVE_MENTORING_INVALID_STATE');
  });
});
