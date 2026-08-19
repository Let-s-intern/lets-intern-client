import { render, screen } from '@testing-library/react';
import type { ComparePriceItem } from '../lib/useComparePrices';
import IndividualPurchaseCard from './IndividualPurchaseCard';

const items: ComparePriceItem[] = [
  {
    challengeType: 'PERSONAL_STATEMENT_LARGE_CORP',
    name: '대기업 자기소개서 챌린지',
    price: 143200,
  },
  { challengeType: 'ETC', name: '인적성 챌린지', price: 61800 },
];

describe('IndividualPurchaseCard', () => {
  it('항목 이름과 현재 할인가, 합계를 그린다', () => {
    render(
      <IndividualPurchaseCard items={items} total={205000} isLoading={false} />,
    );
    expect(screen.getByText('대기업 자기소개서 챌린지')).toBeInTheDocument();
    expect(screen.getByText('143,200')).toBeInTheDocument();
    expect(screen.getByText('61,800')).toBeInTheDocument();
    expect(screen.getByText('205,000원')).toBeInTheDocument();
    expect(screen.getByText('2개 개별 구매 시')).toBeInTheDocument();
  });

  it('로딩 중에는 금액 대신 스켈레톤을 그린다 (폴백 숫자를 내지 않는다)', () => {
    // 틀린 값이 잠깐 보이는 게 빈 자리보다 나쁘다 — 결정 8.
    render(<IndividualPurchaseCard items={items} total={0} isLoading />);
    expect(screen.queryByText('143,200')).not.toBeInTheDocument();
    expect(screen.queryByText('0원')).not.toBeInTheDocument();
    expect(screen.getAllByLabelText(/불러오는 중/)).toHaveLength(3);
    // 이름은 로딩 중에도 보인다
    expect(screen.getByText('인적성 챌린지')).toBeInTheDocument();
  });

  it('가격이 null 인 항목은 안내 문구를 내고 합계 개수에서 빠진다', () => {
    render(
      <IndividualPurchaseCard
        items={[items[0], { ...items[1], price: null }]}
        total={143200}
        isLoading={false}
      />,
    );
    expect(screen.getByText('현재 모집 중인 기수 없음')).toBeInTheDocument();
    expect(screen.getByText('1개 개별 구매 시')).toBeInTheDocument();
    expect(screen.getByText('143,200원')).toBeInTheDocument();
  });
});
