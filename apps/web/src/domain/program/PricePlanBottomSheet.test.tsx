import type { ChallengeIdPrimitive } from '@/schema';
import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import PricePlanBottomSheet from './PricePlanBottomSheet';

const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
  useSearchParams: () => new URLSearchParams(),
}));

const setProgramApplicationForm = jest.fn();
jest.mock('@/store/useProgramStore', () => ({
  __esModule: true,
  default: () => ({ setProgramApplicationForm }),
}));

// additionalMonthPrice 가 없는 응답은 개월 선택을 지원하지 않는 이전 서버다
const VOD_PASS_PRODUCT = {
  id: 7,
  title: 'VOD 전체 이용권',
  price: 29000,
  durationDays: 30,
};

const MULTI_MONTH_VOD_PASS_PRODUCT = {
  ...VOD_PASS_PRODUCT,
  price: 20000,
  additionalMonthPrice: 10000,
};

// 신청폼 응답. 테스트마다 vodPassProduct 만 바꿔 끼운다
let mockApplication: Record<string, unknown> = {};

jest.mock('@/api/application', () => ({
  useProgramApplicationQuery: () => ({ data: mockApplication }),
}));

// PostHog 플래그(vod-pass-purchase). 테스트마다 바꿔 끼운다
let mockVodPassPurchaseEnabled = true;

jest.mock('@/domain/program/useVodPassPurchaseEnabled', () => ({
  __esModule: true,
  useVodPassPurchaseEnabled: () => mockVodPassPurchaseEnabled,
}));

// getPayInfo 가 돌려주는 이용료 유형. 테스트마다 바꿔 끼운다
let mockChallengePriceType = 'CHARGE';

jest.mock('@/lib/order', () => ({
  generateOrderId: () => 'order-1',
  getPayInfo: () => ({ challengePriceType: mockChallengePriceType, price: 0 }),
}));

jest.mock('@/common/sheet/BaseBottomSheet', () => ({
  __esModule: true,
  default: ({ isOpen, children }: { isOpen: boolean; children: ReactNode }) =>
    isOpen ? <div>{children}</div> : null,
}));

jest.mock('@/domain/program/challenge/ui/FeedbackMentoringLink', () => ({
  __esModule: true,
  default: () => null,
}));

const PRICE_BASE = {
  title: '',
  description: '',
  price: 0,
  refund: 0,
  discount: 0,
  challengePriceType: 'CHARGE',
  challengeParticipationType: 'LIVE',
  challengeOptionList: [],
};

function makeChallenge() {
  return {
    title: 'QA 포트폴리오 챌린지',
    challengeType: 'PORTFOLIO',
    priceInfo: [
      { ...PRICE_BASE, priceId: 1, challengePricePlanType: 'BASIC' },
      {
        ...PRICE_BASE,
        priceId: 2,
        challengePricePlanType: 'STANDARD',
        challengeOptionList: [
          {
            challengeOptionId: 3,
            title: 'LIVE 피드백',
            price: 1000,
            discountPrice: 0,
          },
        ],
      },
    ],
  } as unknown as ChallengeIdPrimitive;
}

function renderSheet(challenge: ChallengeIdPrimitive) {
  render(
    <PricePlanBottomSheet
      challenge={challenge}
      challengeId="406"
      isOpen
      onClose={jest.fn()}
    />,
  );
}

function makeApplication(
  vodPassProduct?:
    | typeof VOD_PASS_PRODUCT
    | typeof MULTI_MONTH_VOD_PASS_PRODUCT
    | null,
) {
  return {
    name: 'QA',
    email: 'qa@letscareer.test',
    phoneNumber: '010-0000-0000',
    contactEmail: '',
    priceList: [
      { priceId: 1, challengePricePlanType: 'BASIC' },
      { priceId: 2, challengePricePlanType: 'STANDARD' },
    ],
    ...(vodPassProduct === undefined ? {} : { vodPassProduct }),
  };
}

beforeEach(() => {
  pushMock.mockReset();
  setProgramApplicationForm.mockReset();
  mockApplication = makeApplication();
  mockChallengePriceType = 'CHARGE';
  mockVodPassPurchaseEnabled = true;
});

describe('PricePlanBottomSheet — 무료 신청 판정', () => {
  it('이용료가 0원이어도 옵션 금액이 있는 플랜은 유료 신청으로 담는다', () => {
    renderSheet(makeChallenge());

    // 기본 선택은 스탠다드(이용료 0원 + LIVE 옵션 1,000원)
    fireEvent.click(screen.getByRole('button', { name: '신청하기' }));

    expect(setProgramApplicationForm).toHaveBeenCalledWith(
      expect.objectContaining({ priceId: 2, totalPrice: 1000, isFree: false }),
    );
  });

  it('총 결제 금액이 0원인 플랜만 무료 신청으로 담는다', () => {
    renderSheet(makeChallenge());

    fireEvent.click(screen.getByRole('radio', { name: '베이직 플랜' }));
    fireEvent.click(screen.getByRole('button', { name: '신청하기' }));

    expect(setProgramApplicationForm).toHaveBeenCalledWith(
      expect.objectContaining({ priceId: 1, totalPrice: 0, isFree: true }),
    );
  });
});

describe('PricePlanBottomSheet — VOD 이용권 선택 카드 (LC-3438)', () => {
  const VOD_CARD = /VOD 전체 이용권/;

  it('vodPassProduct 가 있을 때만 카드를 보여준다', () => {
    mockApplication = makeApplication(VOD_PASS_PRODUCT);
    renderSheet(makeChallenge());

    expect(
      screen.getByRole('checkbox', { name: VOD_CARD }),
    ).toBeInTheDocument();
    expect(screen.getByText('30일 이용권')).toBeInTheDocument();
    expect(screen.getByText('29,000원')).toBeInTheDocument();
    expect(screen.getByText(/결제 즉시 이용이 시작됩니다/)).toBeInTheDocument();
    expect(screen.queryByText(/활성화/)).not.toBeInTheDocument();
  });

  it('PostHog 플래그가 꺼져 있으면 서버가 상품을 내려줘도 카드를 보여주지 않는다', () => {
    mockVodPassPurchaseEnabled = false;
    mockApplication = makeApplication(VOD_PASS_PRODUCT);
    renderSheet(makeChallenge());

    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    expect(screen.queryByText(/VOD 이용권 추가/)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/결제 즉시 이용이 시작됩니다/),
    ).not.toBeInTheDocument();
  });

  it('플래그가 꺼져 있으면 신청해도 이용권 필드는 0 이고 합계는 기존과 같다', () => {
    mockVodPassPurchaseEnabled = false;
    mockApplication = makeApplication(VOD_PASS_PRODUCT);
    renderSheet(makeChallenge());

    fireEvent.click(screen.getByRole('button', { name: '신청하기' }));

    expect(setProgramApplicationForm).toHaveBeenCalledWith(
      expect.objectContaining({
        priceId: 2,
        totalPrice: 1000,
        vodPassProductId: 0,
        vodPassPrice: 0,
        vodPassDurationDays: 0,
        vodPassMonths: 0,
      }),
    );
  });

  it('vodPassProduct 가 null 이면 카드를 렌더하지 않는다', () => {
    mockApplication = makeApplication(null);
    renderSheet(makeChallenge());

    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    expect(
      screen.queryByText(/결제 즉시 이용이 시작됩니다/),
    ).not.toBeInTheDocument();
  });

  it('vodPassProduct 가 누락돼도 카드를 렌더하지 않는다', () => {
    mockApplication = makeApplication();
    renderSheet(makeChallenge());

    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('선택하지 않고 신청하면 이용권 필드는 0 이고 합계는 기존과 같다', () => {
    mockApplication = makeApplication(VOD_PASS_PRODUCT);
    renderSheet(makeChallenge());

    fireEvent.click(screen.getByRole('button', { name: '신청하기' }));

    expect(setProgramApplicationForm).toHaveBeenCalledWith(
      expect.objectContaining({
        priceId: 2,
        totalPrice: 1000,
        vodPassProductId: 0,
        vodPassPrice: 0,
        vodPassDurationDays: 0,
        vodPassMonths: 0,
      }),
    );
  });

  it('선택하면 이용권 값과 이용권이 더해진 합계를 담고, 정가·할인에는 합치지 않는다', () => {
    mockApplication = makeApplication(VOD_PASS_PRODUCT);
    renderSheet(makeChallenge());

    fireEvent.click(screen.getByRole('checkbox', { name: VOD_CARD }));
    fireEvent.click(screen.getByRole('button', { name: '신청하기' }));

    // 스탠다드: 이용료 0 + LIVE 옵션 1,000 → 정가 1,000, 할인 0
    expect(setProgramApplicationForm).toHaveBeenCalledWith(
      expect.objectContaining({
        priceId: 2,
        price: 1000,
        discount: 0,
        totalPrice: 30000,
        vodPassProductId: 7,
        vodPassPrice: 29000,
        vodPassDurationDays: 30,
        vodPassMonths: 1,
        isFree: false,
      }),
    );
  });

  it('총 결제 금액 표시가 스토어에 담는 합계와 같다', () => {
    mockApplication = makeApplication(VOD_PASS_PRODUCT);
    renderSheet(makeChallenge());

    expect(
      screen.getByText('1,000원', { selector: 'span.text-small18' }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('checkbox', { name: VOD_CARD }));

    expect(
      screen.getByText('30,000원', { selector: 'span.text-small18' }),
    ).toBeInTheDocument();
  });

  it('선택을 해제하면 이용권 필드가 다시 0 으로 담긴다', () => {
    mockApplication = makeApplication(VOD_PASS_PRODUCT);
    renderSheet(makeChallenge());

    const card = screen.getByRole('checkbox', { name: VOD_CARD });
    fireEvent.click(card);
    fireEvent.click(card);
    fireEvent.click(screen.getByRole('button', { name: '신청하기' }));

    expect(setProgramApplicationForm).toHaveBeenCalledWith(
      expect.objectContaining({
        totalPrice: 1000,
        vodPassProductId: 0,
        vodPassPrice: 0,
        vodPassDurationDays: 0,
        vodPassMonths: 0,
      }),
    );
  });

  it('플랜을 바꿔도 이용권 선택을 유지한다', () => {
    mockApplication = makeApplication(VOD_PASS_PRODUCT);
    renderSheet(makeChallenge());

    fireEvent.click(screen.getByRole('checkbox', { name: VOD_CARD }));
    fireEvent.click(screen.getByRole('radio', { name: '베이직 플랜' }));

    expect(screen.getByRole('checkbox', { name: VOD_CARD })).toBeChecked();

    fireEvent.click(screen.getByRole('button', { name: '신청하기' }));

    // 베이직: 0원 + 이용권 29,000원. 이용권 때문에 무료 신청이 아니다
    expect(setProgramApplicationForm).toHaveBeenCalledWith(
      expect.objectContaining({
        priceId: 1,
        price: 0,
        discount: 0,
        totalPrice: 29000,
        vodPassProductId: 7,
        isFree: false,
      }),
    );
  });

  it('이용료 FREE 플랜이어도 이용권을 담으면 무료 신청으로 처리하지 않는다', () => {
    // 서버는 이용권을 포함하면 paymentKey 를 요구한다. isFree 이면 결제 결과 화면이 paymentKey 를 비운다
    mockApplication = makeApplication(VOD_PASS_PRODUCT);
    mockChallengePriceType = 'FREE';
    renderSheet(makeChallenge());

    fireEvent.click(screen.getByRole('radio', { name: '베이직 플랜' }));
    fireEvent.click(screen.getByRole('checkbox', { name: VOD_CARD }));
    fireEvent.click(screen.getByRole('button', { name: '신청하기' }));

    expect(setProgramApplicationForm).toHaveBeenCalledWith(
      expect.objectContaining({ totalPrice: 29000, isFree: false }),
    );
  });
});

describe('PricePlanBottomSheet — VOD 이용권 개월 선택 (LC-3438)', () => {
  const VOD_CARD = /VOD 전체 이용권/;
  const MORE = { name: '이용 개월 수 늘리기' };
  const LESS = { name: '이용 개월 수 줄이기' };

  function checkVodPass() {
    fireEvent.click(screen.getByRole('checkbox', { name: VOD_CARD }));
  }

  it('체크하기 전에는 개월 선택이 보이지 않는다', () => {
    mockApplication = makeApplication(MULTI_MONTH_VOD_PASS_PRODUCT);
    renderSheet(makeChallenge());

    expect(screen.queryByRole('button', MORE)).not.toBeInTheDocument();
  });

  it('체크하면 1개월로 시작하고 줄이기 버튼은 막혀 있다', () => {
    mockApplication = makeApplication(MULTI_MONTH_VOD_PASS_PRODUCT);
    renderSheet(makeChallenge());

    checkVodPass();

    expect(screen.getByText('1개월')).toBeInTheDocument();
    expect(screen.getByRole('button', LESS)).toBeDisabled();
    expect(screen.getByText('2개월부터 매월 +10,000원')).toBeInTheDocument();
  });

  it('개월 수를 늘리면 이용권 금액과 총 이용일수가 서버 계산식대로 바뀐다', () => {
    mockApplication = makeApplication(MULTI_MONTH_VOD_PASS_PRODUCT);
    renderSheet(makeChallenge());

    checkVodPass();
    fireEvent.click(screen.getByRole('button', MORE));
    fireEvent.click(screen.getByRole('button', MORE));

    // 20,000 + 10,000 * 2 = 40,000, 30일 * 3 = 90일
    expect(screen.getByText('3개월')).toBeInTheDocument();
    expect(screen.getByText('90일 이용권')).toBeInTheDocument();
    expect(screen.getByText('40,000원')).toBeInTheDocument();
    // 합계 = 챌린지(스탠다드 옵션 1,000) + 이용권 40,000
    expect(
      screen.getByText('41,000원', { selector: 'span.text-small18' }),
    ).toBeInTheDocument();
  });

  it('신청하면 총액·총일수·개월 수를 스토어에 담는다', () => {
    mockApplication = makeApplication(MULTI_MONTH_VOD_PASS_PRODUCT);
    renderSheet(makeChallenge());

    checkVodPass();
    fireEvent.click(screen.getByRole('button', MORE));
    fireEvent.click(screen.getByRole('button', MORE));
    fireEvent.click(screen.getByRole('button', { name: '신청하기' }));

    expect(setProgramApplicationForm).toHaveBeenCalledWith(
      expect.objectContaining({
        totalPrice: 41000,
        vodPassProductId: 7,
        vodPassPrice: 40000,
        vodPassDurationDays: 90,
        vodPassMonths: 3,
      }),
    );
  });

  it('상한에서는 늘리기 버튼이 막힌다', () => {
    mockApplication = makeApplication(MULTI_MONTH_VOD_PASS_PRODUCT);
    renderSheet(makeChallenge());

    checkVodPass();
    for (let i = 0; i < 20; i += 1) {
      const more = screen.getByRole('button', MORE);
      if ((more as HTMLButtonElement).disabled) break;
      fireEvent.click(more);
    }

    expect(screen.getByText('3개월')).toBeInTheDocument();
    expect(screen.getByRole('button', MORE)).toBeDisabled();
  });

  it('체크를 해제했다가 다시 하면 고른 개월 수를 유지한다', () => {
    mockApplication = makeApplication(MULTI_MONTH_VOD_PASS_PRODUCT);
    renderSheet(makeChallenge());

    checkVodPass();
    fireEvent.click(screen.getByRole('button', MORE));
    checkVodPass();
    expect(screen.queryByRole('button', MORE)).not.toBeInTheDocument();
    checkVodPass();

    expect(screen.getByText('2개월')).toBeInTheDocument();
  });

  it('추가 월 가격이 없는 응답은 개월 선택 없이 1개월로 담는다', () => {
    mockApplication = makeApplication(VOD_PASS_PRODUCT);
    renderSheet(makeChallenge());

    checkVodPass();
    expect(screen.queryByRole('button', MORE)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '신청하기' }));

    expect(setProgramApplicationForm).toHaveBeenCalledWith(
      expect.objectContaining({
        vodPassPrice: 29000,
        vodPassDurationDays: 30,
        vodPassMonths: 1,
      }),
    );
  });

  it('추가 월 가격이 0 이면 안내 문구 없이 개월만 늘고 금액은 같다', () => {
    mockApplication = makeApplication({
      ...MULTI_MONTH_VOD_PASS_PRODUCT,
      additionalMonthPrice: 0,
    });
    renderSheet(makeChallenge());

    checkVodPass();
    fireEvent.click(screen.getByRole('button', MORE));

    expect(screen.queryByText(/2개월부터 매월/)).not.toBeInTheDocument();
    expect(screen.getByText('60일 이용권')).toBeInTheDocument();
    expect(screen.getByText('20,000원')).toBeInTheDocument();
  });
});
