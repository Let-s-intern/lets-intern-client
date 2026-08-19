import { fireEvent, render, screen } from '@testing-library/react';
import CompareSection from './CompareSection';
import { COMPARE_COMBOS, COMPARE_COPY, getComboTotal } from '../data/compare';

// 올인원 특가만 연동값이다. 개별 구매 금액은 data/compare.ts 하드코딩이라 목이 필요 없다.
const membershipData = jest.fn();
jest.mock('../lib/useMembershipChallengeData', () => ({
  useMembershipChallengeData: () => membershipData(),
}));

describe('CompareSection', () => {
  beforeEach(() => {
    // 세 조합 모두 이 값보다 비싸다(207,500 / 207,000 / 185,000).
    membershipData.mockReturnValue({ salePrice: 169900 });
  });

  it('헤드라인과 서브카피를 렌더한다', () => {
    render(<CompareSection />);
    expect(screen.getByText(COMPARE_COPY.titleLead)).toBeInTheDocument();
    expect(screen.getByText(COMPARE_COPY.titleHi)).toBeInTheDocument();
    expect(screen.getByText(COMPARE_COPY.subtitle)).toBeInTheDocument();
  });

  it('탭 3개를 렌더하고 첫 탭이 활성이다', () => {
    render(<CompareSection />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(3);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('활성 조합의 항목과 합계를 좌측 카드에 그린다', () => {
    render(<CompareSection />);
    const combo = COMPARE_COMBOS[0];
    for (const item of combo.items) {
      expect(screen.getByText(item.name)).toBeInTheDocument();
    }
    // 합계는 항목 가격의 단순 합이다
    expect(getComboTotal(combo)).toBe(
      combo.items.reduce((s, i) => s + i.price, 0),
    );
    expect(
      screen.getByText(
        new RegExp(getComboTotal(combo).toLocaleString('ko-KR')),
      ),
    ).toBeInTheDocument();
  });

  it('탭을 바꾸면 좌측 카드 항목이 그 조합으로 바뀐다', () => {
    render(<CompareSection />);
    const target = COMPARE_COMBOS[2];
    // 라벨에 "+" 가 들어 있어 정규식으로 쓰면 수량자로 해석된다. 문자열 포함으로 찾는다.
    fireEvent.click(
      screen.getByRole('tab', { name: (name) => name.includes(target.label) }),
    );
    for (const item of target.items) {
      expect(screen.getByText(item.name)).toBeInTheDocument();
    }
  });

  it('개별 합계가 올인원 특가 이하인 탭은 숨긴다', () => {
    // 특가를 아주 높게 잡으면 세 조합 모두 "개별이 더 싸다"가 되어 비교가 성립하지 않는다.
    membershipData.mockReturnValue({ salePrice: 999999 });
    const { container } = render(<CompareSection />);
    expect(container.querySelector('.compare')).toBeNull();
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
  });

  it('일부만 성립하면 남은 탭만 보여주고 그중 첫 탭이 활성이 된다', () => {
    // 185,000(조합 3)만 걸러지는 값
    membershipData.mockReturnValue({ salePrice: 200000 });
    render(<CompareSection />);
    const labels = screen.getAllByRole('tab').map((t) => t.textContent);
    expect(labels).toHaveLength(2);
    expect(labels.join()).not.toContain(COMPARE_COMBOS[2].label);
  });

  it('가격은 어드민이 아니라 data/compare.ts 에서 온다', () => {
    // 연동을 되돌린 결정(조합 중 하나라도 미모집이면 탭이 사라지던 문제)을 고정한다.
    for (const combo of COMPARE_COMBOS) {
      for (const item of combo.items) {
        expect(item.price).toBeGreaterThan(0);
        expect(item.regularPrice).toBeGreaterThanOrEqual(item.price);
      }
    }
  });
});
