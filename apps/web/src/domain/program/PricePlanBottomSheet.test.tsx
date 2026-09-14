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

function makeChallenge(
  versionList: { challengeVersionId: number; title: string }[],
) {
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
    versionList: versionList.map((version, index) => ({
      ...version,
      sortOrder: index,
    })),
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

const VERSIONS = [
  { challengeVersionId: 10, title: '대학생·무경력자 Ver.' },
  { challengeVersionId: 11, title: '인턴·실무 경험자 Ver.' },
];

beforeEach(() => {
  pushMock.mockReset();
  setProgramApplicationForm.mockReset();
});

describe('PricePlanBottomSheet — 버전 선택 (LC-3247)', () => {
  it('버전이 있는 챌린지는 플랜 선택 위에 버전 선택을 먼저 보이고, 고르기 전에는 신청하기가 비활성이다', () => {
    renderSheet(makeChallenge(VERSIONS));

    const versionHeading = screen.getByText('챌린지 버전 선택 (필수)');
    const planHeading = screen.getByText('챌린지 플랜 선택 (필수)');
    expect(
      versionHeading.compareDocumentPosition(planHeading) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(screen.getByRole('button', { name: '신청하기' })).toBeDisabled();
  });

  it('버전을 고르고 신청하면 고른 버전을 신청 정보에 담아 신청 입력으로 간다', () => {
    renderSheet(makeChallenge(VERSIONS));

    fireEvent.click(
      screen.getByRole('radio', { name: '인턴·실무 경험자 Ver.' }),
    );
    fireEvent.click(screen.getByRole('button', { name: '신청하기' }));

    expect(setProgramApplicationForm).toHaveBeenCalledWith(
      expect.objectContaining({ priceId: 2, challengeVersionId: 11 }),
    );
    expect(pushMock).toHaveBeenCalledWith('/payment-input');
  });

  it('버전이 없는 챌린지는 버전 선택 없이 신청하고 버전을 비운다', () => {
    renderSheet(makeChallenge([]));

    expect(screen.queryByText('챌린지 버전 선택 (필수)')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: '신청하기' }));

    expect(setProgramApplicationForm).toHaveBeenCalledWith(
      expect.objectContaining({ challengeVersionId: null }),
    );
  });
});
