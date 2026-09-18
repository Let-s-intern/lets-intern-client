import { fireEvent, render, screen } from '@testing-library/react';

// 이벤트 이름·속성은 `analytics.test.ts` 가 덮는다. 여기서는 "언제 부르는가" 만 본다.
jest.mock('../analytics');

import { captureBenefitModalOpened } from '../analytics';
import { CHALLENGE_ITEMS } from '../data/challengeModalItems';
import { GUIDEBOOK_ITEMS } from '../data/guidebooks';
import { PASS_BENEFITS_MODALS, PASS_INTRO } from '../data/passBenefitModals';
import PassIntroSection from './PassIntroSection';

// 썸네일은 어드민 조회다. 이 테스트가 보는 것은 "카드가 열리는가" 라 조회는 세운다.
jest.mock('../lib/useChallengeThumbnails', () => ({
  useChallengeThumbnails: () => ({}),
}));
jest.mock('../lib/useGuidebookThumbnails', () => ({
  useGuidebookThumbnails: () => ({}),
}));

/** n 번째 카드의 "자세히 보기" 를 누른다 */
function openCard(index: number) {
  fireEvent.click(
    screen.getAllByRole('button', { name: `${PASS_INTRO.cardCtaLabel} →` })[
      index
    ],
  );
}

describe('PassIntroSection (개편 시안 6-0)', () => {
  it('인트로 3단과 혜택 4카드를 그린다', () => {
    render(<PassIntroSection />);

    expect(screen.getByText(PASS_INTRO.leadSub)).toBeInTheDocument();
    expect(screen.getByText(PASS_INTRO.bridge)).toBeInTheDocument();
    expect(screen.getByText(PASS_INTRO.title)).toBeInTheDocument();

    for (const entry of PASS_BENEFITS_MODALS) {
      expect(screen.getByText(entry.cardTitle)).toBeInTheDocument();
    }
    expect(
      screen.getAllByRole('button', { name: `${PASS_INTRO.cardCtaLabel} →` }),
    ).toHaveLength(4);
  });

  it('처음에는 모달이 닫혀 있다', () => {
    render(<PassIntroSection />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('카드마다 해당 혜택의 모달이 열린다', () => {
    render(<PassIntroSection />);

    PASS_BENEFITS_MODALS.forEach((entry, index) => {
      openCard(index);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText(entry.modal.badge)).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: '닫기' }));
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  /*
   * 모달 본문의 카드 제목은 **기존 데이터의 실제 상품명**이다. 시안 6-1·6-2 는 썸네일과
   * 제목이 어긋난 칸이 있어 그대로 옮기면 화면에 없는 상품명이 뜬다.
   */
  it('챌린지 모달이 실제 상품명 10종을 그린다', () => {
    render(<PassIntroSection />);
    openCard(0);

    for (const item of CHALLENGE_ITEMS) {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    }
  });

  it('가이드북 모달이 실제 상품명 7종을 그린다', () => {
    render(<PassIntroSection />);
    openCard(1);

    expect(GUIDEBOOK_ITEMS).toHaveLength(7);
    for (const item of GUIDEBOOK_ITEMS) {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    }
  });

  it('하단 CTA 는 가격 비교로 내려보낸다', () => {
    render(<PassIntroSection />);

    expect(screen.getByText(PASS_INTRO.ctaLabel).closest('a')).toHaveAttribute(
      'href',
      `#${PASS_INTRO.ctaAnchor}`,
    );
  });
});

describe('혜택 모달 열기 이벤트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('카드마다 자기 혜택 종류를 보낸다', () => {
    render(<PassIntroSection />);

    PASS_BENEFITS_MODALS.forEach((entry, index) => {
      openCard(index);
      fireEvent.click(screen.getByRole('button', { name: '닫기' }));

      expect(captureBenefitModalOpened).toHaveBeenNthCalledWith(index + 1, {
        benefitId: entry.id,
      });
    });

    expect(captureBenefitModalOpened).toHaveBeenCalledTimes(
      PASS_BENEFITS_MODALS.length,
    );
  });

  /* 닫기는 열기가 아니다. 닫을 때도 세면 열린 횟수가 두 배가 된다. */
  it('모달을 닫을 때는 보내지 않는다', () => {
    render(<PassIntroSection />);

    openCard(0);
    fireEvent.click(screen.getByRole('button', { name: '닫기' }));

    expect(captureBenefitModalOpened).toHaveBeenCalledTimes(1);
  });
});
