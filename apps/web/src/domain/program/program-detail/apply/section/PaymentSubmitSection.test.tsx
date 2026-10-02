import { render, screen } from '@testing-library/react';
import PaymentSubmitSection from './PaymentSubmitSection';

describe('PaymentSubmitSection', () => {
  it('막을 사유가 없으면 결제 버튼이 활성이다', () => {
    render(<PaymentSubmitSection onSubmit={jest.fn()} buttonText="결제하기" />);

    expect(screen.getByRole('button', { name: '결제하기' })).toBeEnabled();
  });
});
