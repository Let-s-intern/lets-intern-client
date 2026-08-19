import { fireEvent, render, screen } from '@testing-library/react';
import { COMPARE_COMBOS, COMPARE_COPY } from '../data/compare';

// 가격 조회(2단 API)는 lib/useComparePrices.test.tsx 가 본다. 여기서는 섹션이 훅 결과를
// 어떻게 조립하는지 — 탭 전환, 역전 탭 숨김 — 만 본다.
const comparePrices = jest.fn();
jest.mock('../lib/useComparePrices', () => ({
  useComparePrices: (...args: unknown[]) => comparePrices(...args),
}));
jest.mock('../lib/useMembershipChallengeData', () => ({
  useMembershipChallengeData: () => ({ salePrice: 169900 }),
}));

import CompareSection from './CompareSection';

/** 조합의 항목 이름을 그대로 돌려주는 기본 훅 결과 */
const priceResultFor = (comboId: string) => {
  const combo = COMPARE_COMBOS.find((c) => c.id === comboId);
  return {
    items: (combo?.items ?? []).map((item, index) => ({
      ...item,
      price: 100000 + index,
    })),
    total: 200000,
    isLoading: false,
    isInverted: false,
    isUsable: true,
  };
};

describe('CompareSection', () => {
  beforeEach(() => {
    comparePrices.mockReset();
    comparePrices.mockImplementation((combo) => priceResultFor(combo.id));
    // jsdom 에는 IntersectionObserver 가 없다 — 섹션은 이때 바로 조회하도록 폴백한다.
  });

  it('헤드라인과 서브카피를 렌더한다', () => {
    render(<CompareSection />);
    expect(screen.getByText(COMPARE_COPY.titleLead)).toBeInTheDocument();
    expect(screen.getByText(COMPARE_COPY.titleHi)).toBeInTheDocument();
    expect(screen.getByText(COMPARE_COPY.subtitle)).toBeInTheDocument();
  });

  it('탭 3개와 좌우 카드 라벨을 렌더한다', () => {
    render(<CompareSection />);
    expect(screen.getAllByRole('tab')).toHaveLength(3);
    expect(screen.getByText(COMPARE_COPY.individualLabel)).toBeInTheDocument();
    expect(screen.getByText(COMPARE_COPY.allInOneLabel)).toBeInTheDocument();
  });

  it('첫 탭이 초기 활성이고 그 조합의 항목을 좌측 카드에 그린다', () => {
    render(<CompareSection />);
    for (const item of COMPARE_COMBOS[0].items) {
      expect(screen.getByText(item.name)).toBeInTheDocument();
    }
  });

  it('탭을 바꾸면 좌측 카드 항목이 그 조합으로 바뀐다', () => {
    render(<CompareSection />);
    // 3번 탭에만 있는 항목으로 확인한다 (1번 탭은 인적성, 3번 탭은 이력서)
    const onlyInThird = COMPARE_COMBOS[2].items.find(
      (item) => !COMPARE_COMBOS[0].items.some((f) => f.name === item.name),
    )!;
    expect(screen.queryByText(onlyInThird.name)).not.toBeInTheDocument();

    fireEvent.click(screen.getByText(COMPARE_COMBOS[2].label));

    expect(screen.getByText(onlyInThird.name)).toBeInTheDocument();
    // 활성 탭만 조회한다 — 훅은 바뀐 조합으로 불린다
    expect(comparePrices).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: COMPARE_COMBOS[2].id }),
      expect.anything(),
    );
  });

  it('쓸 수 없는 탭은 목록에서 사라지고 남은 탭으로 옮겨간다', () => {
    // 첫 탭만 사용 불가 — 역전이거나 모집 중인 기수가 없는 경우
    comparePrices.mockImplementation((combo) => ({
      ...priceResultFor(combo.id),
      isUsable: combo.id !== COMPARE_COMBOS[0].id,
    }));

    render(<CompareSection />);

    const labels = screen.getAllByRole('tab').map((t) => t.textContent);
    expect(labels).toHaveLength(2);
    expect(labels.join()).not.toContain(COMPARE_COMBOS[0].label);
    // 활성 탭이 사라졌으므로 남은 첫 탭으로 옮겨간다
    expect(
      screen
        .getAllByRole('tab')
        .find((t) => t.getAttribute('aria-selected') === 'true'),
    ).toHaveTextContent(COMPARE_COMBOS[1].label);
  });

  it('모든 탭을 쓸 수 없으면 섹션 자체를 렌더하지 않는다', () => {
    comparePrices.mockImplementation((combo) => ({
      ...priceResultFor(combo.id),
      isUsable: false,
    }));

    const { container } = render(<CompareSection />);

    expect(container.querySelector('.compare')).toBeNull();
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
  });

  it('로딩 중이면 좌측 카드에 스켈레톤을 그리고 금액을 내지 않는다', () => {
    comparePrices.mockImplementation((combo) => ({
      ...priceResultFor(combo.id),
      items: COMPARE_COMBOS[0].items.map((item) => ({ ...item, price: null })),
      total: 0,
      isLoading: true,
    }));

    render(<CompareSection />);

    expect(screen.getAllByLabelText(/불러오는 중/).length).toBeGreaterThan(0);
    expect(screen.queryByText('0원')).not.toBeInTheDocument();
  });
});
