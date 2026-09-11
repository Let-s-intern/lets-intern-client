import {
  isApplicationExpired,
  type CreatedLiveMentoringApplication,
  type LiveMentoringOrderDraft,
} from './useOrderDraft';

/*
  Toss 결제창은 `successUrl` 로 새 문서를 연다. 모듈을 새로 불러와 그 상황을 만든다 —
  같은 모듈에서 넣고 읽으면 메모리가 살아 있어 `persist` 가 없어도 통과해 버린다.
*/
const openNewDocument = async () => {
  let loaded: typeof import('./useOrderDraft') | undefined;
  await jest.isolateModulesAsync(async () => {
    loaded = await import('./useOrderDraft');
  });
  return loaded!.useOrderDraftStore;
};

const APPLICATION: CreatedLiveMentoringApplication = {
  applicationId: 15,
  orderId: 'gKEMQwWav2Lh',
  finalAmount: 60000,
  orderName: '어드민 1:1 LIVE 멘토링',
  customerName: '로컬어드민',
  customerEmail: 'local-admin@letscareer.test',
  customerMobilePhone: '01000000000',
  expiresAt: '2026-08-21T16:23:16.283507',
};

/* `APPLICATION.expiresAt` 을 KST 로 읽은 절대 시각. */
const EXPIRES_AT = new Date('2026-08-21T16:23:16.283+09:00').getTime();
/* 선점 중인 시각. 픽스처의 만료 시각이 이미 지나 있어 시계를 고정한다. */
const WHILE_HELD = EXPIRES_AT - 5 * 60 * 1000;

const DRAFT: LiveMentoringOrderDraft = {
  mentorId: 1,
  openingId: 6,
  productName: '어드민 1:1 LIVE 멘토링',
  thumbnail: null,
  duration: 60,
  durationPriceId: 5,
  price: 60000,
  slots: [
    {
      slotId: 158,
      date: '2026-09-19',
      time: '12:00',
      startDate: '2026-09-19T12:00:00',
      endDate: '2026-09-19T12:30:00',
    },
  ],
  mentoringCategory: 'PERSONAL_STATEMENT',
  reservationChangeAgreed: true,
};

beforeEach(() => {
  localStorage.clear();
  jest.spyOn(Date, 'now').mockReturnValue(WHILE_HELD);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('useOrderDraftStore — 결제 복귀(새 문서)', () => {
  it('신청 정보가 복원되고 복원이 끝났음을 알린다', async () => {
    const before = await openNewDocument();
    before.getState().setDraft(DRAFT);
    before.getState().setApplication(APPLICATION);

    const after = await openNewDocument();

    expect(after.getState().application).toEqual(APPLICATION);
    expect(after.getState()._hasHydrated).toBe(true);
  });

  /* 슬롯 선택값을 되살리면 이미 남에게 팔린 슬롯으로 재결제를 시도하게 된다. */
  it('슬롯 선택값은 복원하지 않는다', async () => {
    const before = await openNewDocument();
    before.getState().setDraft(DRAFT);
    before.getState().setApplication(APPLICATION);

    const after = await openNewDocument();

    expect(after.getState().draft).toBeNull();
  });

  it('남긴 것이 없으면 빈 채로 복원을 끝낸다', async () => {
    const after = await openNewDocument();

    expect(after.getState().application).toBeNull();
    expect(after.getState()._hasHydrated).toBe(true);
  });

  /* 지난 신청으로 승인하면 `LIVE_MENTORING_PAYMENT_EXPIRED` 다. */
  it('선점이 끝난 신청은 복원하지 않는다', async () => {
    const before = await openNewDocument();
    before.getState().setApplication(APPLICATION);
    jest.spyOn(Date, 'now').mockReturnValue(EXPIRES_AT);

    const after = await openNewDocument();

    expect(after.getState().application).toBeNull();
    expect(after.getState()._hasHydrated).toBe(true);
  });
});

/* 서버가 `!expiresAt.isAfter(now)` 로 본다. 만료 시각 그 순간이 경계다. */
describe('isApplicationExpired', () => {
  it('만료 시각 직전까지는 만료가 아니다', () => {
    expect(isApplicationExpired(APPLICATION, EXPIRES_AT - 1)).toBe(false);
  });

  it('만료 시각 그 순간부터 만료다', () => {
    expect(isApplicationExpired(APPLICATION, EXPIRES_AT)).toBe(true);
  });

  it('형식을 읽지 못하면 막지 않고 서버 판정에 맡긴다', () => {
    expect(
      isApplicationExpired(
        { ...APPLICATION, expiresAt: 'invalid' },
        EXPIRES_AT,
      ),
    ).toBe(false);
  });
});
