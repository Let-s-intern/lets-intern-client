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

jest.mock('@/api/application', () => ({
  useProgramApplicationQuery: () => ({
    data: {
      name: 'QA',
      email: 'qa@letscareer.test',
      phoneNumber: '010-0000-0000',
      contactEmail: '',
      priceList: [
        { priceId: 1, challengePricePlanType: 'BASIC' },
        { priceId: 2, challengePricePlanType: 'STANDARD' },
      ],
    },
  }),
}));

jest.mock('@/lib/order', () => ({
  generateOrderId: () => 'order-1',
  getPayInfo: () => ({ challengePriceType: 'CHARGE', price: 0 }),
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

beforeEach(() => {
  pushMock.mockReset();
  setProgramApplicationForm.mockReset();
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
