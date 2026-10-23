import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';

import CreditList from './CreditList';

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

const mockPayments = jest.fn();

jest.mock('@/api/payment/payment', () => ({
  paymentListQueryOptions: {
    queryKey: ['credit-list-test'],
    queryFn: () => mockPayments(),
  },
}));

const row = (paymentId: number, paymentKey: string | null, title: string) => ({
  programInfo: {
    paymentId,
    applicationId: paymentId + 100,
    programType: paymentId === 502 ? 'VOD_PASS' : 'CHALLENGE',
    title,
    price: 60000,
    paybackPrice: 0,
    optionPrice: 0,
    paidAmount: paymentId === 502 ? 29000 : 60000,
    isCanceled: false,
    isRefunded: false,
    createDate: '2026-10-12T10:00:00',
  },
  tossInfo: paymentKey
    ? { status: 'DONE', paymentKey, totalAmount: 89000 }
    : { status: 'DONE', totalAmount: 60000 },
  paymentItems: paymentKey
    ? [
        { paymentId: 501, paidAmount: 60000 },
        { paymentId: 502, paidAmount: 29000 },
      ]
    : null,
  orderTotalPaidAmount: paymentKey ? 89000 : null,
});

function renderList() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <CreditList />
    </QueryClientProvider>,
  );
}

describe('CreditList 거래 묶음', () => {
  it('같은 거래의 챌린지와 이용권을 한 카드로 보이고 합계는 한 번만 그린다', async () => {
    mockPayments.mockResolvedValue({
      payments: [
        row(501, 'pk-A', '챌린지'),
        row(502, 'pk-A', 'VOD 이용권'),
        row(503, null, '다른 챌린지'),
      ],
    });

    renderList();

    expect(await screen.findByText('총 결제금액')).toBeInTheDocument();
    expect(screen.getAllByText('총 결제금액')).toHaveLength(1);
    expect(screen.getAllByText('89,000원')).toHaveLength(1);
    // 묶음의 두 항목 + 단독 항목 하나
    expect(screen.getAllByRole('link')).toHaveLength(3);
  });

  it('거래가 겹치지 않으면 결제마다 카드가 하나다', async () => {
    mockPayments.mockResolvedValue({
      payments: [row(501, 'pk-A', '챌린지'), row(503, null, '다른 챌린지')],
    });

    renderList();

    expect(await screen.findByText('챌린지')).toBeInTheDocument();
    expect(screen.queryByText('총 결제금액')).not.toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });
});
