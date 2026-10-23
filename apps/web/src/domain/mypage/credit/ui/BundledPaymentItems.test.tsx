import { render, screen } from '@testing-library/react';

import type { PaymentDetailType } from '@/api/payment/paymentSchema';
import BundledPaymentItems from './BundledPaymentItems';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const items: PaymentDetailType['paymentItems'] = [
  {
    paymentId: 501,
    applicationId: 10,
    programType: 'CHALLENGE',
    title: '챌린지',
    paidAmount: 60000,
  },
  {
    paymentId: 502,
    applicationId: 11,
    programType: 'VOD_PASS',
    title: 'VOD 전체 이용권',
    paidAmount: 29000,
  },
];

describe('BundledPaymentItems', () => {
  it('현재 항목을 뺀 함께 결제한 항목과 합계를 그린다', () => {
    render(
      <BundledPaymentItems
        items={items}
        currentPaymentId={502}
        totalAmount={89000}
      />,
    );

    expect(screen.getByText('함께 결제한 항목')).toBeInTheDocument();
    expect(screen.getByText('챌린지')).toBeInTheDocument();
    expect(screen.getByText('60,000원')).toBeInTheDocument();
    expect(screen.getByText('89,000원')).toBeInTheDocument();
    expect(screen.queryByText('VOD 전체 이용권')).not.toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/mypage/credit/501',
    );
  });

  it('함께 결제한 항목이 없으면 아무것도 그리지 않는다', () => {
    const { container } = render(
      <BundledPaymentItems
        items={[items![1]]}
        currentPaymentId={502}
        totalAmount={29000}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('응답에 항목이 없는 기존 결제는 아무것도 그리지 않는다', () => {
    const { container } = render(
      <BundledPaymentItems
        items={null}
        currentPaymentId={501}
        totalAmount={60000}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('취소된 항목은 취소 표시를 붙인다', () => {
    render(
      <BundledPaymentItems
        items={[items![0], { ...items![1], isCanceled: true }]}
        currentPaymentId={501}
        totalAmount={89000}
      />,
    );

    expect(screen.getByText('(결제취소)')).toBeInTheDocument();
  });
});
