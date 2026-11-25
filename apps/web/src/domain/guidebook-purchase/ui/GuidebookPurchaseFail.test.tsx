import { render, screen } from '@testing-library/react';
import GuidebookPurchaseFail from './GuidebookPurchaseFail';

let mockParams = new URLSearchParams();

jest.mock('next/navigation', () => ({
  useSearchParams: () => mockParams,
}));

describe('GuidebookPurchaseFail', () => {
  it('토스가 붙인 실패 메시지와 코드를 보여준다', () => {
    mockParams = new URLSearchParams(
      'code=PAY_PROCESS_CANCELED&message=사용자가 결제를 취소했어요&orderId=order1',
    );

    render(<GuidebookPurchaseFail guidebookId={12} />);

    expect(screen.getByText('사용자가 결제를 취소했어요')).toBeInTheDocument();
    expect(screen.getByText('PAY_PROCESS_CANCELED')).toBeInTheDocument();
  });

  it('다시 시도하기는 returnUrl 을 유지한 같은 구매 화면으로, 닫기 버튼도 준다', () => {
    mockParams = new URLSearchParams(
      'code=PAY_PROCESS_CANCELED&returnUrl=https%3A%2F%2Fogonggo.co.kr%2Fr',
    );

    render(<GuidebookPurchaseFail guidebookId={12} />);

    const retry = screen.getByRole('link', { name: '다시 시도하기' });
    const url = new URL(retry.getAttribute('href') ?? '', 'https://x.test');
    expect(url.pathname).toBe('/guidebook/purchase/12');
    expect(url.searchParams.get('returnUrl')).toBe('https://ogonggo.co.kr/r');
    expect(screen.getByRole('button', { name: '닫기' })).toBeInTheDocument();
  });
});
