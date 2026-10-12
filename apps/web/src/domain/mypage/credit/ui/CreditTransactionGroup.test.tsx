import { render, screen, within } from '@testing-library/react';

import type { PaymentType } from '@/api/payment/paymentSchema';
import CreditTransactionGroup from './CreditTransactionGroup';

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

const paymentItems = [
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
    title: 'VOD 이용권',
    paidAmount: 29000,
  },
] as const;

function makeRow(
  index: 0 | 1,
  overrides: Partial<PaymentType['programInfo']> = {},
): PaymentType {
  const item = paymentItems[index];
  return {
    programInfo: {
      paymentId: item.paymentId,
      applicationId: item.applicationId,
      programType: item.programType,
      title: item.title,
      thumbnail: '/thumb.png',
      isCanceled: false,
      isRefunded: false,
      createDate: '2026-10-12T10:00:00',
      ...overrides,
    },
    tossInfo: { status: 'DONE', paymentKey: 'pk-A', totalAmount: 89000 },
    paymentItems: [...paymentItems],
    orderTotalPaidAmount: 89000,
    orderBalanceAmount: 89000,
  } as unknown as PaymentType;
}

describe('CreditTransactionGroup', () => {
  it('거래 합계를 한 번만 그리고 항목별 금액을 나열한다', () => {
    render(<CreditTransactionGroup payments={[makeRow(0), makeRow(1)]} />);

    expect(screen.getAllByText('89,000원')).toHaveLength(1);
    expect(screen.getByText('60,000원')).toBeInTheDocument();
    expect(screen.getByText('29,000원')).toBeInTheDocument();
    expect(screen.getByText('챌린지')).toBeInTheDocument();
    expect(screen.getByText('VOD 이용권')).toBeInTheDocument();
  });

  it('항목은 각자의 결제 상세로 연결한다', () => {
    render(<CreditTransactionGroup payments={[makeRow(0), makeRow(1)]} />);

    const links = screen.getAllByRole('link');
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/mypage/credit/501',
      '/mypage/credit/502',
    ]);
  });

  it('paymentItems 가 없으면 행의 paidAmount, 합계는 PG 승인 금액을 쓴다', () => {
    const rows = [
      makeRow(0, { paidAmount: 60000 }),
      makeRow(1, { paidAmount: 29000 }),
    ].map((row) => ({
      ...row,
      paymentItems: null,
      orderTotalPaidAmount: null,
    })) as PaymentType[];

    render(<CreditTransactionGroup payments={rows} />);

    expect(screen.getByText('60,000원')).toBeInTheDocument();
    expect(screen.getByText('29,000원')).toBeInTheDocument();
    expect(screen.getByText('89,000원')).toBeInTheDocument();
  });

  it('항목별 상태는 신청 단위로 가른다', () => {
    const rows = [
      makeRow(0, { isCanceled: true }),
      makeRow(1),
    ] as PaymentType[];
    rows.forEach((row) => {
      row.tossInfo = { ...row.tossInfo, status: 'PARTIAL_CANCELED' };
    });

    render(<CreditTransactionGroup payments={rows} />);

    const [challenge, pass] = screen.getAllByRole('link');
    expect(within(challenge).getByText('결제취소')).toBeInTheDocument();
    expect(within(pass).getByText('결제완료')).toBeInTheDocument();
  });
});
