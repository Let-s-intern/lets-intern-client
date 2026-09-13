import { render, screen } from '@testing-library/react';
import PaymentSubmitSection from './PaymentSubmitSection';

describe('PaymentSubmitSection 안내 문구', () => {
  it('안내가 있으면 결제 버튼 위에 보인다', () => {
    render(
      <PaymentSubmitSection
        onSubmit={jest.fn()}
        buttonText="결제하기"
        disabled
        notice="버전을 선택해주세요"
      />,
    );

    const notice = screen.getByText('버전을 선택해주세요');
    const button = screen.getByRole('button', { name: '결제하기' });

    expect(button).toBeDisabled();
    expect(notice).toHaveClass('text-xsmall14', 'text-primary');
    expect(notice.nextElementSibling).toBe(button);
  });

  it('안내가 없으면 문구를 그리지 않는다', () => {
    render(<PaymentSubmitSection onSubmit={jest.fn()} buttonText="결제하기" />);

    expect(screen.queryByText('버전을 선택해주세요')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '결제하기' })).toBeEnabled();
  });
});
