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
