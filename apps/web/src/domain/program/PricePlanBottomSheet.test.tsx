import type { ChallengeIdPrimitive } from '@/schema';
import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import PricePlanBottomSheet from './PricePlanBottomSheet';

const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
  useSearchParams: () => new URLSearchParams(),
}));

// 실제 스토어처럼 넘긴 값만 덮어쓰는 상태를 둔다. 남아 있던 값이 덮이는지 보기 위해서다
let storeState: Record<string, unknown> = {};
const setProgramApplicationForm = jest.fn((params: Record<string, unknown>) => {
  storeState = { ...storeState, ...params };
});
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

function renderSheet(
  challenge: ChallengeIdPrimitive,
  challengeVersionId: number | null = null,
) {
  render(
    <PricePlanBottomSheet
      challenge={challenge}
      challengeId="406"
      challengeVersionId={challengeVersionId}
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
  setProgramApplicationForm.mockClear();
  storeState = {};
});

describe('PricePlanBottomSheet — 버전 고정 (LC-3247)', () => {
  it('버전을 고르는 UI 없이 신청하기가 활성이다', () => {
    renderSheet(makeChallenge(VERSIONS), 11);

    expect(screen.queryByText('챌린지 버전 선택 (필수)')).toBeNull();
    expect(
      screen.queryByRole('radio', { name: '인턴·실무 경험자 Ver.' }),
    ).toBeNull();
    expect(screen.getByRole('button', { name: '신청하기' })).toBeEnabled();
  });

  it('들어온 페이지의 버전을 신청 정보에 담는다. 스토어에 다른 버전이 남아 있어도 덮어쓴다', () => {
    // 다른 챌린지 상세에서 고른 버전이 남아 있는 상태
    storeState = { challengeVersionId: 99 };
    renderSheet(makeChallenge(VERSIONS), 11);

    fireEvent.click(screen.getByRole('button', { name: '신청하기' }));

    expect(setProgramApplicationForm).toHaveBeenCalledWith(
      expect.objectContaining({ priceId: 2, challengeVersionId: 11 }),
    );
    expect(storeState.challengeVersionId).toBe(11);
    expect(pushMock).toHaveBeenCalledWith('/payment-input');
  });

  it('LIGHT 플랜이면 버전 페이지여도 버전을 비운다', () => {
    const challenge = makeChallenge(VERSIONS);
    challenge.priceInfo.push({
      ...PRICE_BASE,
      priceId: 4,
      challengePricePlanType: 'LIGHT',
      title: '라이트 플랜',
    } as unknown as ChallengeIdPrimitive['priceInfo'][number]);
    storeState = { challengeVersionId: 11 };
    renderSheet(challenge, 11);

    // LIGHT 가 있으면 기본 선택이 LIGHT 다
    fireEvent.click(screen.getByRole('button', { name: '신청하기' }));

    expect(setProgramApplicationForm).toHaveBeenCalledWith(
      expect.objectContaining({ challengeVersionId: null }),
    );
    expect(storeState.challengeVersionId).toBeNull();
  });

  it('이용료가 0원이어도 옵션 금액이 있는 플랜은 유료 신청으로 담는다', () => {
    renderSheet(makeChallenge([]));

    // 기본 선택은 스탠다드(이용료 0원 + LIVE 옵션 1,000원)
    fireEvent.click(screen.getByRole('button', { name: '신청하기' }));

    expect(setProgramApplicationForm).toHaveBeenCalledWith(
      expect.objectContaining({ priceId: 2, totalPrice: 1000, isFree: false }),
    );
  });

  it('총 결제 금액이 0원인 플랜만 무료 신청으로 담는다', () => {
    renderSheet(makeChallenge([]));

    fireEvent.click(screen.getByRole('radio', { name: '베이직 플랜' }));
    fireEvent.click(screen.getByRole('button', { name: '신청하기' }));

    expect(setProgramApplicationForm).toHaveBeenCalledWith(
      expect.objectContaining({ priceId: 1, totalPrice: 0, isFree: true }),
    );
  });

  it('버전이 없는 챌린지는 버전을 비워 신청한다', () => {
    renderSheet(makeChallenge([]));

    fireEvent.click(screen.getByRole('button', { name: '신청하기' }));

    expect(setProgramApplicationForm).toHaveBeenCalledWith(
      expect.objectContaining({ challengeVersionId: null }),
    );
  });
});
