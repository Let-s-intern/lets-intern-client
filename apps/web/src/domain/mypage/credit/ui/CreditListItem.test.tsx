import { render, screen } from '@testing-library/react';

import type { PaymentType } from '@/api/payment/paymentSchema';
import CreditListItem from './CreditListItem';

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

function makePayment(
  programInfo: Partial<PaymentType['programInfo']>,
): PaymentType {
  return {
    programInfo: {
      paymentId: 501,
      applicationId: 10,
      programType: 'CHALLENGE',
      title: '상품',
      thumbnail: null,
      price: 60000,
      paybackPrice: 0,
      optionPrice: 0,
      isCanceled: false,
      isRefunded: false,
      createDate: '2026-08-21T00:00:00',
      ...programInfo,
    },
    tossInfo: { status: 'DONE', totalAmount: 60000 },
  } as unknown as PaymentType;
}

const link = () => screen.getByRole('link');

/*
  결제 목록에서 상세로 보내는 링크다. 라이브 멘토링만 전용 경로로 갈라지고
  나머지는 이전과 같아야 한다 — 여기가 어긋나면 기존 결제가 엉뚱한 화면으로 간다.
*/
describe('CreditListItem 링크 분기', () => {
  it('챌린지·라이브는 기존 결제 상세로 간다', () => {
    render(<CreditListItem payment={makePayment({ programType: 'LIVE' })} />);

    expect(link()).toHaveAttribute('href', '/mypage/credit/501');
  });

  it('리포트는 기존 리포트 전용 경로로 간다', () => {
    render(<CreditListItem payment={makePayment({ programType: 'REPORT' })} />);

    expect(link()).toHaveAttribute(
      'href',
      '/mypage/credit/report/501?applicationId=10',
    );
  });

  /*
    라이브 멘토링은 applicationId 체계다. Toss 승인 전에는 paymentId 가 null 이라
    기존 경로로는 열 수 없는 구간이 생긴다.
  */
  it('라이브 멘토링은 applicationId 로 전용 상세에 간다', () => {
    render(
      <CreditListItem
        payment={makePayment({
          programType: 'LIVE_MENTORING',
          applicationId: 10,
        })}
      />,
    );

    expect(link()).toHaveAttribute('href', '/mypage/credit/live-mentoring/10');
  });
});

/*
  묶음 표시를 넣으면서 단일 항목 카드가 바뀌면 안 된다.
  이 카드는 `tossInfo.totalAmount` 를 결제금액으로, 할인이 있으면 정가를 함께 그린다.
*/
describe('CreditListItem 금액 표시', () => {
  it('할인이 있으면 정가와 결제금액을 그린다', () => {
    render(
      <CreditListItem
        payment={makePayment({
          price: 70000,
          paybackPrice: 0,
          title: '챌린지',
        })}
      />,
    );

    expect(screen.getByText('70,000원')).toBeInTheDocument();
    expect(screen.getByText('60,000원')).toBeInTheDocument();
  });

  it('할인이 없으면 정가를 숨긴다', () => {
    render(<CreditListItem payment={makePayment({ price: 60000 })} />);

    expect(screen.getAllByText('60,000원')).toHaveLength(1);
  });

  /*
    이용권 행의 tossInfo 는 챌린지와 함께 결제한 거래 전체다.
    합계를 그대로 그리면 이용권이 챌린지 값으로 보인다.
  */
  it('VOD 이용권 행은 거래 합계가 아니라 이 신청의 결제 금액을 그린다', () => {
    const payment = makePayment({
      programType: 'VOD_PASS',
      title: 'VOD 이용권',
      price: 29000,
      paidAmount: 29000,
    });
    payment.tossInfo = { status: 'DONE', totalAmount: 89000 };

    render(<CreditListItem payment={payment} />);

    expect(screen.getByText('29,000원')).toBeInTheDocument();
    expect(screen.queryByText('89,000원')).not.toBeInTheDocument();
  });
});
